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
} from '@shared/schema';
import { eq, and, or, like, desc, asc, between, gt, lt, isNull, isNotNull, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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

    let query = db.select().from(products);

    // Apply filters
    const filters = [];

    // Category filter
    if (category) {
      const categoryIds = Array.isArray(category) 
        ? category.map(c => parseInt(c as string)) 
        : [parseInt(category as string)];
      
      filters.push(inArray(products.categoryId, categoryIds));
    }

    // Search filter
    if (search) {
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
    } else if (minPrice) {
      filters.push(gt(products.price, parseFloat(minPrice as string)));
    } else if (maxPrice) {
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
    if (sortBy) {
      switch (sortBy) {
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
    query = query.limit(limitValue).offset(offsetValue);

    const result = await query;
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID or slug
router.get('/products/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    
    // Determine if ID or slug was provided
    const isId = !isNaN(parseInt(idOrSlug));
    
    const result = isId
      ? await db.select().from(products).where(eq(products.id, parseInt(idOrSlug))).limit(1)
      : await db.select().from(products).where(eq(products.slug, idOrSlug)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all product categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(productCategories);
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a single category by ID or slug
router.get('/categories/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    
    // Determine if ID or slug was provided
    const isId = !isNaN(parseInt(idOrSlug));
    
    const result = isId
      ? await db.select().from(productCategories).where(eq(productCategories.id, parseInt(idOrSlug))).limit(1)
      : await db.select().from(productCategories).where(eq(productCategories.slug, idOrSlug)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Get products by category
router.get('/categories/:categoryId/products', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit, offset } = req.query;
    
    let query = db.select()
      .from(products)
      .where(and(
        eq(products.categoryId, parseInt(categoryId)),
        eq(products.published, true)
      ));
    
    // Apply pagination
    const limitValue = limit ? parseInt(limit as string) : 20;
    const offsetValue = offset ? parseInt(offset as string) : 0;
    query = query.limit(limitValue).offset(offsetValue);
    
    const result = await query;
    res.json(result);
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
});

// Get Cart (create if doesn't exist)
router.get('/cart', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    // Find existing cart for this session
    let cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    let cart = cartResult[0];
    
    // If no cart exists, create a new one
    if (!cart) {
      // Create new cart
      const result = await db.insert(carts).values({
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
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    res.json({
      cart,
      items: cartItemsResult
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/cart/items', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const addToCartSchema = z.object({
      productId: z.number(),
      quantity: z.number().min(1)
    });
    
    const validatedData = addToCartSchema.parse(req.body);
    
    // Find existing cart for this session
    let cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    let cart = cartResult[0];
    
    // If no cart exists, create a new one
    if (!cart) {
      // Create new cart
      const result = await db.insert(carts).values({
        sessionId: req.session.id,
        userId: req.session.userId || null
      }).returning();
      
      cart = result[0];
    }
    
    // Check if product exists
    const productResult = await db.select()
      .from(products)
      .where(eq(products.id, validatedData.productId))
      .limit(1);
    
    if (productResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult[0];
    
    // Check if product is in stock
    if (product.inventory < validatedData.quantity) {
      return res.status(400).json({ error: 'Not enough inventory available' });
    }
    
    // Check if item is already in cart
    const existingItemResult = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, validatedData.productId)
      ))
      .limit(1);
    
    if (existingItemResult.length > 0) {
      // Update quantity of existing item
      const existingItem = existingItemResult[0];
      const newQuantity = existingItem.quantity + validatedData.quantity;
      
      // Check if new quantity exceeds inventory
      if (newQuantity > product.inventory) {
        return res.status(400).json({ error: 'Not enough inventory available' });
      }
      
      await db.update(cartItems)
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
      
      return res.json(updatedItem);
    }
    
    // Add new item to cart
    const result = await db.insert(cartItems).values({
      cartId: cart.id,
      productId: validatedData.productId,
      quantity: validatedData.quantity
    }).returning();
    
    const newItem = {
      ...result[0],
      product
    };
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item
router.patch('/cart/items/:itemId', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    const { itemId } = req.params;
    
    // Validate request body
    const updateCartItemSchema = z.object({
      quantity: z.number().min(1)
    });
    
    const { quantity } = updateCartItemSchema.parse(req.body);
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    if (cartResult.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Get the cart item
    const itemResult = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.id, parseInt(itemId)),
        eq(cartItems.cartId, cart.id)
      ))
      .limit(1);
    
    if (itemResult.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    const item = itemResult[0];
    
    // Check if product has enough inventory
    const productResult = await db.select()
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);
    
    if (productResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult[0];
    
    if (quantity > product.inventory) {
      return res.status(400).json({ error: 'Not enough inventory available' });
    }
    
    // Update the cart item
    await db.update(cartItems)
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
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/cart/items/:itemId', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    const { itemId } = req.params;
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    if (cartResult.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Delete the cart item
    await db.delete(cartItems)
      .where(and(
        eq(cartItems.id, parseInt(itemId)),
        eq(cartItems.cartId, cart.id)
      ));
    
    res.status(204).end();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/cart', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    // Get the cart for this session
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    if (cartResult.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const cart = cartResult[0];
    
    // Delete all cart items
    await db.delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));
    
    res.status(204).end();
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Create order (checkout)
router.post('/orders', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const createOrderSchema = z.object({
      billingAddress: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        address1: z.string().min(5),
        address2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(3),
        country: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional()
      }),
      shippingAddress: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        address1: z.string().min(5),
        address2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(3),
        country: z.string().min(2),
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
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    if (cartResult.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
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
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    if (cartItemsResult.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate order totals
    const subtotal = cartItemsResult.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + (Number(price) * item.quantity);
    }, 0);
    
    const shippingCost = 10.00; // Fixed shipping cost for demo
    const tax = subtotal * 0.08; // 8% tax for demo
    const total = subtotal + shippingCost + tax;
    
    // Create the order
    const orderResult = await db.insert(orders).values({
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
    
    await db.insert(orderItems).values(orderItemsToInsert);
    
    // Clear the cart
    await db.delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));
    
    // Get the complete order with items
    const completeOrder = {
      ...order,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
    };
    
    res.status(201).json(completeOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/orders/:orderId', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { orderId } = req.params;
    
    // Get the order
    const orderResult = await db.select()
      .from(orders)
      .where(and(
        eq(orders.id, parseInt(orderId)),
        eq(orders.userId, req.session.userId)
      ))
      .limit(1);
    
    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult[0];
    
    // Get order items
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    
    const completeOrder = {
      ...order,
      items
    };
    
    res.json(completeOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get user orders
router.get('/user/orders', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get all orders for user
    const result = await db.select()
      .from(orders)
      .where(eq(orders.userId, req.session.userId))
      .orderBy(desc(orders.createdAt));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Apply coupon to cart
router.post('/cart/coupon', async (req: Request, res: Response) => {
  try {
    if (!req.session.id) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    // Validate request body
    const couponSchema = z.object({
      code: z.string()
    });
    
    const { code } = couponSchema.parse(req.body);
    
    // Find the coupon
    const couponResult = await db.select()
      .from(coupons)
      .where(and(
        eq(coupons.code, code),
        eq(coupons.active, true)
      ))
      .limit(1);
    
    if (couponResult.length === 0) {
      return res.status(404).json({ error: 'Coupon not found or inactive' });
    }
    
    const coupon = couponResult[0];
    
    // Check if coupon is valid (dates)
    const now = new Date();
    if (coupon.startDate > now) {
      return res.status(400).json({ error: 'Coupon is not yet active' });
    }
    
    if (coupon.endDate && coupon.endDate < now) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    
    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    
    // Get the cart
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.sessionId, req.session.id))
      .limit(1);
    
    if (cartResult.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
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
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
    
    if (cartItemsResult.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate cart subtotal
    const subtotal = cartItemsResult.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + (Number(price) * item.quantity);
    }, 0);
    
    // Check minimum amount if applicable
    if (coupon.minimumAmount && subtotal < coupon.minimumAmount) {
      return res.status(400).json({ 
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
    await db.update(coupons)
      .set({ usageCount: coupon.usageCount + 1 })
      .where(eq(coupons.id, coupon.id));
    
    // Return discount info
    res.json({
      coupon,
      discount,
      subtotal,
      total: subtotal - discount
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

export default router;