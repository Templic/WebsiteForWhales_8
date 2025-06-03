/**
 * Content Management API Routes
 * 
 * Handles multimedia uploads, content CRUD operations, and workflow management
 */
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { contentItems, mediaAssets, contentWorkflow } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3|wav|txt|md/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

/**
 * POST /api/content-management/upload
 * Upload multiple files
 */
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    const uploadedAssets = [];

    for (const file of files) {
      // Create media asset record
      const [mediaAsset] = await db.insert(mediaAssets).values({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        altText: file.originalname,
        tags: []
      }).returning();

      uploadedAssets.push(mediaAsset);
    }

    res.json({
      success: true,
      message: `Successfully uploaded ${files.length} file(s)`,
      data: uploadedAssets
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/content-management/content
 * Create new content item
 */
router.post('/content', async (req, res) => {
  try {
    const { title, content, contentType, status, targetPages, metadata } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const [contentItem] = await db.insert(contentItems).values({
      title,
      content,
      contentType: contentType || 'text',
      status: status || 'draft',
      targetPages: targetPages || [],
      metadata: metadata || {},
      createdBy: 'admin' // TODO: Get from authenticated user
    }).returning();

    // Create workflow entry
    await db.insert(contentWorkflow).values({
      contentId: contentItem.id,
      status: 'created',
      actorId: 'admin',
      action: 'content_created',
      notes: `Content "${title}" created`
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: contentItem
    });

  } catch (error) {
    console.error('Content creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/content-management/content
 * Get content items with pagination
 */
router.get('/content', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const content = await db
      .select()
      .from(contentItems)
      .orderBy(desc(contentItems.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: content.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

/**
 * PUT /api/content-management/content/:id
 * Update content item
 */
router.put('/content/:id', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const { title, content, contentType, status, targetPages, metadata } = req.body;

    const [updatedContent] = await db
      .update(contentItems)
      .set({
        title,
        content,
        contentType,
        status,
        targetPages,
        metadata,
        updatedAt: new Date()
      })
      .where(eq(contentItems.id, contentId))
      .returning();

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Create workflow entry
    await db.insert(contentWorkflow).values({
      contentId: contentId,
      status: 'updated',
      actorId: 'admin',
      action: 'content_updated',
      notes: `Content "${title}" updated`
    });

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });

  } catch (error) {
    console.error('Content update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
});

/**
 * DELETE /api/content-management/content/:id
 * Delete content item
 */
router.delete('/content/:id', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);

    const [deletedContent] = await db
      .delete(contentItems)
      .where(eq(contentItems.id, contentId))
      .returning();

    if (!deletedContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Create workflow entry
    await db.insert(contentWorkflow).values({
      contentId: contentId,
      status: 'deleted',
      actorId: 'admin',
      action: 'content_deleted',
      notes: `Content "${deletedContent.title}" deleted`
    });

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Content deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

/**
 * GET /api/content-management/media
 * Get media assets with pagination
 */
router.get('/media', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const media = await db
      .select()
      .from(mediaAssets)
      .orderBy(desc(mediaAssets.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: media.map(asset => ({
        ...asset,
        createdAt: asset.createdAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Media fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

/**
 * DELETE /api/content-management/media/:id
 * Delete media asset
 */
router.delete('/media/:id', async (req, res) => {
  try {
    const assetId = parseInt(req.params.id);

    const [deletedAsset] = await db
      .delete(mediaAssets)
      .where(eq(mediaAssets.id, assetId))
      .returning();

    if (!deletedAsset) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found'
      });
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), 'uploads', deletedAsset.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'Media asset deleted successfully'
    });

  } catch (error) {
    console.error('Media deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media asset'
    });
  }
});

/**
 * GET /api/content-management/workflow/:contentId
 * Get workflow history for content
 */
router.get('/workflow/:contentId', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);

    const workflow = await db
      .select()
      .from(contentWorkflow)
      .where(eq(contentWorkflow.contentId, contentId))
      .orderBy(desc(contentWorkflow.createdAt));

    res.json({
      success: true,
      data: workflow.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Workflow fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workflow'
    });
  }
});

/**
 * GET /api/content-management/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Content management service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;