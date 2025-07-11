import express, { Request, Response } from 'express';
import { db } from './db';
import { 
  products, 
  productCategories, 
  carts, 
  cartItems, 
  orders, 
  orderItems,
  coupons,
  insertProductSchema,
  insertProductCategorySchema,
  insertCartSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from '../shared/schema';
import { eq, and, or, like, desc, asc, between, gt, lt, isNull, isNotNull, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { sql } from 'drizzle-orm';

// Utility function to create URL-friendly slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

const router = express.Router();

// Get all products with filtering and sorting
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      search, 
      minPrice,
      maxPrice,
      inStock,
      onSale,
      featured,
      sortBy,
      limit,
      offset
    } = req.query;

    let query = db.select().from(products: any);

    // Apply filters
    const filters = [];

    // Category filter
    if (category: any) {
      const categoryIds = Array.isArray(category: any) 
        ? category.map(c => parseInt(c as string)) 
        : [parseInt(category as string)];
      
      filters.push(inArray(products.categoryId, categoryIds));
    }

    // Search filter
    if (search: any) {
      filters.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.shortDescription || '', `%${search}%`)
        )
      );
    }

    // Price range filter
    if (minPrice && maxPrice) {
      filters.push(between(products.price, parseFloat(minPrice as string), parseFloat(maxPrice as string)));
    } else if (minPrice: any) {
      filters.push(gt(products.price, parseFloat(minPrice as string)));
    } else if (maxPrice: any) {
      filters.push(lt(products.price, parseFloat(maxPrice as string)));
    }

    // In stock filter
    if (inStock === 'true') {
      filters.push(gt(products.inventory, 0));
    }

    // On sale filter
    if (onSale === 'true') {
      filters.push(
        and(
          isNotNull(products.salePrice),
          lt(products.salePrice, products.price)
        )
      );
    }

    // Featured filter
    if (featured === 'true') {
      filters.push(eq(products.featured, true));
    }

    // Only show published products
    filters.push(eq(products.published, true));

    // Apply all filters
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    // Apply sorting
    if (sortBy: any) {
      switch (sortBy: any) {
        case 'price-low-high':
          query = query.orderBy(asc(products.price));
          break;
        case 'price-high-low':
          query = query.orderBy(desc(products.price));
          break;
        case 'name-a-z':
          query = query.orderBy(asc(products.name));
          break;
        case 'name-z-a':
          query = query.orderBy(desc(products.name));
          break;
        case 'newest':
        default:
          query = query.orderBy(desc(products.createdAt));
      }
    } else {
      // Default sort by newest
      query = query.orderBy(desc(products.createdAt));
    }

    // Apply pagination
    const limitValue = limit ? parseInt(limit as string) : 20;
    const offsetValue = offset ? parseInt(offset as string) : 0;
    query = query.limit(limitValue: any).offset(offsetValue: any);

    const result = await query;
    res.json(result: any);
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    res.status(500: any).json({ error: 'Failed to fetch products' });
  }
});

// Create new product (admin only: any)
router.post('/products', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price) {
      return res.status(400: any).json({ message: 'Missing required fields' });
    }
    
    // Format price as cents
    const priceInCents = Math.round(parseFloat(productData.price) * 100);
    
    // Create product
    const newProduct = await db.insert(products: any).values({
      name: productData.name,
      slug: productData.slug || slugify(productData.name),
      description: productData.description,
      price: priceInCents,
      inventory: productData.inventory || 0,
      categoryId: productData.categoryId || null,
      imageUrl: productData.imageUrl || null,
      type: productData.type || 'physical',
      digitalFileUrl: productData.digitalFileUrl || null,
      featuredProduct: productData.featuredProduct || false,
      salePrice: productData.salePrice ? Math.round(parseFloat(productData.salePrice) * 100) : null,
      weight: productData.weight || null,
      dimensions: productData.dimensions || null,
      metadata: productData.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201: any).json(newProduct[0]);
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    res.status(500: any).json({ message: 'Error creating product' });
  }
});

// Update product (admin only: any)
router.patch('/products/:id', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const productId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products: any)
      .where(eq(products.id, productId))
      .limit(1: any);
      
    if (!existingProduct.length) {
      return res.status(404: any).json({ message: 'Product not found' });
    }
    
    // Process price fields to convert to cents
    const updates: any = { ...updateData, updatedAt: new Date() };
    
    if (updates.price !== undefined) {
      updates.price = Math.round(parseFloat(updates.price) * 100);
    }
    
    if (updates.salePrice !== undefined && updates.salePrice !== null) {
      updates.salePrice = Math.round(parseFloat(updates.salePrice) * 100);
    }
    
    // Update the product
    const updatedProduct = await db
      .update(products: any)
      .set(updates: any)
      .where(eq(products.id, productId))
      .returning();
      
    res.json(updatedProduct[0]);
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    res.status(500: any).json({ message: 'Error updating product' });
  }
});

// Delete product (admin only: any)
router.delete('/products/:id', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const productId = parseInt(req.params.id);
    
    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products: any)
      .where(eq(products.id, productId))
      .limit(1: any);
      
    if (!existingProduct.length) {
      return res.status(404: any).json({ message: 'Product not found' });
    }
    
    // Delete the product
    await db
      .delete(products: any)
      .where(eq(products.id, productId));
      
    res.json({ message: 'Product deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    res.status(500: any).json({ message: 'Error deleting product' });
  }
});

// Get a single product by ID or slug
router.get('/products/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    
    // Determine if ID or slug was provided
    const isId = !isNaN(parseInt(idOrSlug: any));
    
    const result = isId
      ? await db.select().from(products: any).where(eq(products.id, parseInt(idOrSlug: any))).limit(1: any)
      : await db.select().from(products: any).where(eq(products.slug, idOrSlug)).limit(1: any);
    
    if (result.length === 0) {
      return res.status(404: any).json({ error: 'Product not found' });
    }
    
    res.json(result[0]);
  } catch (error: unknown) {
    console.error('Error fetching product:', error);
    res.status(500: any).json({ error: 'Failed to fetch product' });
  }
});

// Get all product categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(productCategories: any);
    res.json(result: any);
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    res.status(500: any).json({ error: 'Failed to fetch categories' });
  }
});

// Create product category (admin only: any)
router.post('/categories', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const { name, description, slug, parentId } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400: any).json({ message: 'Missing required fields' });
    }
    
    // Create category
    const newCategory = await db.insert(productCategories: any).values({
      name,
      description,
      slug: slug || slugify(name: any),
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201: any).json(newCategory[0]);
  } catch (error: unknown) {
    console.error('Error creating product category:', error);
    res.status(500: any).json({ message: 'Error creating product category' });
  }
});

// Update product category (admin only: any)
router.patch('/categories/:id', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const categoryId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Check if category exists
    const existingCategory = await db
      .select()
      .from(productCategories: any)
      .where(eq(productCategories.id, categoryId))
      .limit(1: any);
      
    if (!existingCategory.length) {
      return res.status(404: any).json({ message: 'Category not found' });
    }
    
    // Update the category
    const updatedCategory = await db
      .update(productCategories: any)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(productCategories.id, categoryId))
      .returning();
      
    res.json(updatedCategory[0]);
  } catch (error: unknown) {
    console.error('Error updating product category:', error);
    res.status(500: any).json({ message: 'Error updating product category' });
  }
});

// Delete product category (admin only: any)
router.delete('/categories/:id', async (req: Request, res: Response) => {
  // Check for admin permissions
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403: any).json({ message: 'Unauthorized' });
  }
  
  try {
    const categoryId = parseInt(req.params.id);
    
    // Check if category exists
    const existingCategory = await db
      .select()
      .from(productCategories: any)
      .where(eq(productCategories.id, categoryId))
      .limit(1: any);
      
    if (!existingCategory.length) {
      return res.status(404: any).json({ message: 'Category not found' });
    }
    
    // Check if category has products
    const productsInCategory = await db
      .select()
      .from(products: any)
      .where(eq(products.categoryId, categoryId))
      .limit(1: any);
      
    if (productsInCategory.length > 0) {
      return res.status(400: any).json({ 
        message: 'Cannot delete category with products. Remove products first or move them to another category.' 
      });
    }
    
    // Check if category has child categories
    const childCategories = await db
      .select()
      .from(productCategories: any)
      .where(eq(productCategories.parentId, categoryId))
      .limit(1: any);
      
    if (childCategories.length > 0) {
      return res.status(400: any).json({ 
        message: 'Cannot delete category with child categories. Remove child categories first.' 
      });
    }
    
    // Delete the category
    await db
      .delete(productCategories: any)
      .where(eq(productCategories.id, categoryId));
      
    res.json({ message: 'Category deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting product category:', error);
    res.status(500: any).json({ message: 'Error deleting product category' });
  }
});

// Get a single category by ID or slug
router.get('/categories/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    
    // Determine if ID or slug was provided
    const isId = !isNaN(parseInt(idOrSlug: any));
    
    const result = isId
      ? await db.select().from(productCategories: any).where(eq(productCategories.id, parseInt(idOrSlug: any))).limit(1: any)
      : await db.select().from(productCategories: any).where(eq(productCategories.slug, idOrSlug)).limit(1: any);
    
    if (result.length === 0) {
      return res.status(404: any).json({ error: 'Category not found' });
    }
    
    res.json(result[0]);
  } catch (error: unknown) {
    console.error('Error fetching category:', error);
    res.status(500: any).json({ error: 'Failed to fetch category' });
  }
});

// Get products by category
router.get('/categories/:categoryId/products', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit, offset } = req.query;
    
    let query = db.select()
      .from(products: any)
      .where(and(
        eq(products.categoryId, parseInt(categoryId: any)),
        eq(products.published, true)
      ));
    
    // Apply pagination
    const limitValue = limit ? parseInt(limit as string) : 20;
    const offsetValue = offset ? parseInt(offset as string) : 0;
    query = query.limit(limitValue: any).offset(offsetValue: any);
    
    const result = await query;
    res.json(result: any);
  } catch (error: unknown) {
    console.error('Error fetching category products:', error);
    res.status(500: any).json({ error: 'Failed to fetch category products' });
  }
});

// Get Cart (create if doesn't exist)
router.get('/cart', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    // Find existing cart for this session
    let cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    let cart = cartResult[0];
    
    // If no cart exists, create a new one
    if (!cart) {
      // Create new cart
      const result = await db.insert(carts: any).values({
        sessionId: req.session.id,
        userId: req.session.userId || null
      }).returning();
      
      cart = result[0];
    }
    
    // Get cart items with product details
    const cartItemsResult = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      product: products
    })
    .from(cartItems: any)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    res.json({
      cart,
      items: cartItemsResult
    });
  } catch (error: unknown) {
    console.error('Error fetching cart:', error);
    res.status(500: any).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/cart/items', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const addToCartSchema = z.object({
      productId: z.number(),
      quantity: z.number().min(1: any)
    });
    
    const validatedData = addToCartSchema.parse(req.body);
    
    // Find existing cart for this session
    let cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    let cart = cartResult[0];
    
    // If no cart exists, create a new one
    if (!cart) {
      // Create new cart
      const result = await db.insert(carts: any).values({
        sessionId: req.session.id,
        userId: req.session.userId || null
      }).returning();
      
      cart = result[0];
    }
    
    // Check if product exists
    const productResult = await db.select()
      .from(products: any)
      .where(eq(products.id, validatedData.productId))
      .limit(1: any);
    
    if (productResult.length === 0) {
      return res.status(404: any).json({ error: 'Product not found' });
    }
    
    const product = productResult[0];
    
    // Check if product is in stock
    if (product.inventory < validatedData.quantity) {
      return res.status(400: any).json({ error: 'Not enough inventory available' });
    }
    
    // Check if item is already in cart
    const existingItemResult = await db.select()
      .from(cartItems: any)
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, validatedData.productId)
      ))
      .limit(1: any);
    
    if (existingItemResult.length > 0) {
      // Update quantity of existing item
      const existingItem = existingItemResult[0];
      const newQuantity = existingItem.quantity + validatedData.quantity;
      
      // Check if new quantity exceeds inventory
      if (newQuantity > product.inventory) {
        return res.status(400: any).json({ error: 'Not enough inventory available' });
      }
      
      await db.update(cartItems: any)
        .set({ 
          quantity: newQuantity,
          updatedAt: new Date()
        })
        .where(eq(cartItems.id, existingItem.id));
      
      const updatedItem = {
        ...existingItem,
        quantity: newQuantity,
        product
      };
      
      // @ts-ignore - Response type issue
  return res.json(updatedItem: any);
    }
    
    // Add new item to cart
    const result = await db.insert(cartItems: any).values({
      cartId: cart.id,
      productId: validatedData.productId,
      quantity: validatedData.quantity
    }).returning();
    
    const newItem = {
      ...result[0],
      product
    };
    
    res.status(201: any).json(newItem: any);
  } catch (error: unknown) {
    console.error('Error adding item to cart:', error);
    res.status(500: any).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item
router.patch('/cart/items/:itemId', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    const { itemId } = req.params;
    
    // Validate request body
    const updateCartItemSchema = z.object({
      quantity: z.number().min(1: any)
    });
    
    const { quantity } = updateCartItemSchema.parse(req.body);
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    if (cartResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Get the cart item
    const itemResult = await db.select()
      .from(cartItems: any)
      .where(and(
        eq(cartItems.id, parseInt(itemId: any)),
        eq(cartItems.cartId, cart.id)
      ))
      .limit(1: any);
    
    if (itemResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart item not found' });
    }
    
    const item = itemResult[0];
    
    // Check if product has enough inventory
    const productResult = await db.select()
      .from(products: any)
      .where(eq(products.id, item.productId))
      .limit(1: any);
    
    if (productResult.length === 0) {
      return res.status(404: any).json({ error: 'Product not found' });
    }
    
    const product = productResult[0];
    
    if (quantity > product.inventory) {
      return res.status(400: any).json({ error: 'Not enough inventory available' });
    }
    
    // Update the cart item
    await db.update(cartItems: any)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(eq(cartItems.id, item.id));
    
    const updatedItem = {
      ...item,
      quantity,
      product
    };
    
    res.json(updatedItem: any);
  } catch (error: unknown) {
    console.error('Error updating cart item:', error);
    res.status(500: any).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/cart/items/:itemId', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    const { itemId } = req.params;
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    if (cartResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Delete the cart item
    await db.delete(cartItems: any)
      .where(and(
        eq(cartItems.id, parseInt(itemId: any)),
        eq(cartItems.cartId, cart.id)
      ));
    
    res.status(204: any).end();
  } catch (error: unknown) {
    console.error('Error removing item from cart:', error);
    res.status(500: any).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/cart', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    if (cartResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Delete all cart items
    await db.delete(cartItems: any)
      .where(eq(cartItems.cartId, cart.id));
    
    res.status(204: any).end();
  } catch (error: unknown) {
    console.error('Error clearing cart:', error);
    res.status(500: any).json({ error: 'Failed to clear cart' });
  }
});

// Create order (checkout: any)
router.post('/orders', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const createOrderSchema = z.object({
      billingAddress: z.object({
        firstName: z.string().min(2: any),
        lastName: z.string().min(2: any),
        address1: z.string().min(5: any),
        address2: z.string().optional(),
        city: z.string().min(2: any),
        state: z.string().min(2: any),
        postalCode: z.string().min(3: any),
        country: z.string().min(2: any),
        email: z.string().email(),
        phone: z.string().optional()
      }),
      shippingAddress: z.object({
        firstName: z.string().min(2: any),
        lastName: z.string().min(2: any),
        address1: z.string().min(5: any),
        address2: z.string().optional(),
        city: z.string().min(2: any),
        state: z.string().min(2: any),
        postalCode: z.string().min(3: any),
        country: z.string().min(2: any),
        email: z.string().email(),
        phone: z.string().optional()
      }),
      paymentMethod: z.string(),
      paymentId: z.string().optional(),
      customerNote: z.string().optional()
    });
    
    const validatedData = createOrderSchema.parse(req.body);
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    if (cartResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Get cart items with product details
    const cartItemsResult = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products
    })
    .from(cartItems: any)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    if (cartItemsResult.length === 0) {
      return res.status(400: any).json({ error: 'Cart is empty' });
    }
    
    // Calculate order totals
    const subtotal = cartItemsResult.reduce((total: any, item: any) => {
      const price = item.product.salePrice || item.product.price;
      return total + (Number(price: any) * item.quantity);
    }, 0);
    
    const shippingCost = 10.00; // Fixed shipping cost for demo
    const tax = subtotal * 0.08; // 8% tax for demo
    const total = subtotal + shippingCost + tax;
    
    // Create the order
    const orderResult = await db.insert(orders: any).values({
      userId: req.session.userId || null,
      status: 'pending',
      total,
      subtotal,
      tax,
      shipping: shippingCost,
      discount: 0,
      billingAddress: validatedData.billingAddress,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      paymentId: validatedData.paymentId,
      customerNote: validatedData.customerNote
    }).returning();
    
    const order = orderResult[0];
    
    // Create order items
    const orderItemsToInsert = cartItemsResult.map(item => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.product.name,
      productPrice: Number(item.product.salePrice || item.product.price),
      quantity: item.quantity,
      total: Number(item.product.salePrice || item.product.price) * item.quantity
    }));
    
    await db.insert(orderItems: any).values(orderItemsToInsert: any);
    
    // Clear the cart
    await db.delete(cartItems: any)
      .where(eq(cartItems.cartId, cart.id));
    
    // Get the complete order with items
    const completeOrder = {
      ...order,
      items: await db.select().from(orderItems: any).where(eq(orderItems.orderId, order.id))
    };
    
    res.status(201: any).json(completeOrder: any);
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    res.status(500: any).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/orders/:orderId', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401: any).json({ error: 'Unauthorized' });
    }
    
    const { orderId } = req.params;
    
    // Get the order
    const orderResult = await db.select()
      .from(orders: any)
      .where(and(
        eq(orders.id, parseInt(orderId: any)),
        eq(orders.userId, req.session.userId)
      ))
      .limit(1: any);
    
    if (orderResult.length === 0) {
      return res.status(404: any).json({ error: 'Order not found' });
    }
    
    const order = orderResult[0];
    
    // Get order items
    const items = await db.select().from(orderItems: any).where(eq(orderItems.orderId, order.id));
    
    const completeOrder = {
      ...order,
      items
    };
    
    res.json(completeOrder: any);
  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    res.status(500: any).json({ error: 'Failed to fetch order' });
  }
});

// Get user orders
router.get('/user/orders', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401: any).json({ error: 'Unauthorized' });
    }
    
    // Get all orders for user
    const result = await db.select()
      .from(orders: any)
      .where(eq(orders.userId, req.session.userId))
      .orderBy(desc(orders.createdAt));
    
    res.json(result: any);
  } catch (error: unknown) {
    console.error('Error fetching user orders:', error);
    res.status(500: any).json({ error: 'Failed to fetch user orders' });
  }
});

// Apply coupon to cart
router.post('/cart/coupon', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400: any).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const couponSchema = z.object({
      code: z.string()
    });
    
    const { code } = couponSchema.parse(req.body);
    
    // Find the coupon
    const couponResult = await db.select()
      .from(coupons: any)
      .where(and(
        eq(coupons.code, code),
        eq(coupons.active, true)
      ))
      .limit(1: any);
    
    if (couponResult.length === 0) {
      return res.status(404: any).json({ error: 'Coupon not found or inactive' });
    }
    
    const coupon = couponResult[0];
    
    // Check if coupon is valid (dates: any)
    const now = new Date();
    if (coupon.startDate > now) {
      return res.status(400: any).json({ error: 'Coupon is not yet active' });
    }
    
    if (coupon.endDate && coupon.endDate < now) {
      return res.status(400: any).json({ error: 'Coupon has expired' });
    }
    
    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400: any).json({ error: 'Coupon usage limit reached' });
    }
    
    // Get the cart
    const cartResult = await db.select()
      .from(carts: any)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1: any);
    
    if (cartResult.length === 0) {
      return res.status(404: any).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Get cart items with product details to calculate total
    const cartItemsResult = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products
    })
    .from(cartItems: any)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    if (cartItemsResult.length === 0) {
      return res.status(400: any).json({ error: 'Cart is empty' });
    }
    
    // Calculate cart subtotal
    const subtotal = cartItemsResult.reduce((total: any, item: any) => {
      const price = item.product.salePrice || item.product.price;
      return total + (Number(price: any) * item.quantity);
    }, 0);
    
    // Check minimum amount if applicable
    if (coupon.minimumAmount && subtotal < coupon.minimumAmount) {
      return res.status(400: any).json({ 
        error: `Order must be at least ${coupon.minimumAmount} to use this coupon`
      });
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = subtotal * (coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }
    
    // Don't allow discount greater than subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }
    
    // Increment usage count
    await db.update(coupons: any)
      .set({ usageCount: coupon.usageCount + 1 })
      .where(eq(coupons.id, coupon.id));
    
    // Return discount info
    res.json({
      coupon,
      discount,
      subtotal,
      total: subtotal - discount
    });
  } catch (error: unknown) {
    console.error('Error applying coupon:', error);
    res.status(500: any).json({ error: 'Failed to apply coupon' });
  }
});

export default router;