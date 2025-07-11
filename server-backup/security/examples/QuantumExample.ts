/**
 * Quantum-Resistant Cryptography Example
 * 
 * This example demonstrates how to use the quantum-resistant cryptography
 * components in a real-world application.
 */

import express from 'express';
import { 
  createQuantumMiddleware, 
  generateKeyPair, 
  encrypt, 
  decrypt,
  sign,
  verify,
  hash,
  createSecureToken,
  verifySecureToken
} from '../advanced/quantum';

// Create an Express app
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Apply quantum middleware to all routes
app.use(createQuantumMiddleware({
  verifySignature: 'optional',
  signResponses: 'all',
  algorithm: 'kyber',
  strength: 'high'
}));

// Basic route with quantum protection
app.get('/api/public', (req: any, res: any) => {
  res.json({
    message: 'This is a public endpoint with quantum protection',
    timestamp: new Date().toISOString()
  });
});

// Route demonstrating key generation
app.get('/api/keys/generate', async (req: any, res: any) => {
  try {
    // Generate a quantum-resistant key pair
    const keyPair = await generateKeyPair({
      algorithm: 'kyber',
      strength: 'high'
    });
    
    res.json({
      message: 'Quantum-resistant key pair generated successfully',
      publicKey: keyPair.publicKey,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to generate key pair',
      message: error.message
    });
  }
});

// Route demonstrating encryption
app.post('/api/encrypt', async (req: any, res: any) => {
  try {
    const { data, publicKey } = req.body;
    
    if (!data || !publicKey) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'Both data and publicKey are required'
      });
    }
    
    // Encrypt the data
    const encryptedData = await encrypt(data, publicKey, {
      algorithm: 'kyber',
      strength: 'high'
    });
    
    res.json({
      message: 'Data encrypted successfully',
      encryptedData,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to encrypt data',
      message: error.message
    });
  }
});

// Route demonstrating decryption
app.post('/api/decrypt', async (req: any, res: any) => {
  try {
    const { encryptedData, privateKey } = req.body;
    
    if (!encryptedData || !privateKey) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'Both encryptedData and privateKey are required'
      });
    }
    
    // Decrypt the data
    const decryptedData = await decrypt(encryptedData, privateKey, {
      algorithm: 'kyber',
      strength: 'high'
    });
    
    res.json({
      message: 'Data decrypted successfully',
      decryptedData: decryptedData.toString(),
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to decrypt data',
      message: error.message
    });
  }
});

// Route demonstrating signing
app.post('/api/sign', async (req: any, res: any) => {
  try {
    const { data, privateKey } = req.body;
    
    if (!data || !privateKey) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'Both data and privateKey are required'
      });
    }
    
    // Sign the data
    const signatureResult = await sign(data, privateKey, {
      algorithm: 'dilithium',
      strength: 'high'
    });
    
    res.json({
      message: 'Data signed successfully',
      signature: signatureResult.signature,
      publicKey: signatureResult.publicKey,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to sign data',
      message: error.message
    });
  }
});

// Route demonstrating verification
app.post('/api/verify', async (req: any, res: any) => {
  try {
    const { data, signature, publicKey } = req.body;
    
    if (!data || !signature || !publicKey) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'data, signature, and publicKey are all required'
      });
    }
    
    // Verify the signature
    const verificationResult = await verify(data, signature, publicKey, {
      algorithm: 'dilithium',
      strength: 'high'
    });
    
    res.json({
      message: 'Signature verification completed',
      valid: verificationResult.valid,
      reason: verificationResult.reason,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to verify signature',
      message: error.message
    });
  }
});

// Route demonstrating hashing
app.post('/api/hash', async (req: any, res: any) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'data is required'
      });
    }
    
    // Hash the data
    const hashedData = await hash(data, {
      strength: 'high'
    });
    
    res.json({
      message: 'Data hashed successfully',
      hash: hashedData,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to hash data',
      message: error.message
    });
  }
});

// Route demonstrating token creation
app.post('/api/tokens/create', async (req: any, res: any) => {
  try {
    const { payload } = req.body;
    
    if (!payload) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'payload is required'
      });
    }
    
    // Generate a key pair for token signing
    const keyPair = await generateKeyPair({
      algorithm: 'dilithium',
      strength: 'high'
    });
    
    // Create a secure token
    const token = await createSecureToken(payload, keyPair.privateKey, {
      expiresIn: 3600000, // 1 hour
      algorithm: 'dilithium',
      strength: 'high'
    });
    
    res.json({
      message: 'Secure token created successfully',
      token,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to create token',
      message: error.message
    });
  }
});

// Route demonstrating token verification
app.post('/api/tokens/verify', async (req: any, res: any) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400: any).json({
        error: 'Missing required fields',
        message: 'token is required'
      });
    }
    
    // Verify the secure token
    const verificationResult = await verifySecureToken(token, {
      checkExpiration: true,
      algorithm: 'dilithium',
      strength: 'high'
    });
    
    res.json({
      message: 'Token verification completed',
      valid: verificationResult.valid,
      expired: verificationResult.expired,
      reason: verificationResult.reason,
      payload: verificationResult.payload,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    res.status(500: any).json({
      error: 'Failed to verify token',
      message: error.message
    });
  }
});

// Start the server
if (require.main === module) {
  const port = 3003;
  app.listen(port, () => {
    console.log(`Quantum cryptography example running on port ${port}`);
    console.log(`Try these endpoints:`);
    console.log(`- GET http://localhost:${port}/api/public`);
    console.log(`- GET http://localhost:${port}/api/keys/generate`);
    console.log(`- POST http://localhost:${port}/api/encrypt`);
    console.log(`- POST http://localhost:${port}/api/decrypt`);
    console.log(`- POST http://localhost:${port}/api/sign`);
    console.log(`- POST http://localhost:${port}/api/verify`);
    console.log(`- POST http://localhost:${port}/api/hash`);
    console.log(`- POST http://localhost:${port}/api/tokens/create`);
    console.log(`- POST http://localhost:${port}/api/tokens/verify`);
  });
}

// Export the app for testing
export default app;