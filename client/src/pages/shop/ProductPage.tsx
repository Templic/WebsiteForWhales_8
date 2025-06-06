/**
 * ProductPage.tsx
 * 
 * Migrated as part of the repository reorganization.
 */
import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Heart, Loader2, Share2, ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/utils';
import CosmicHeading from '@/components/ui/cosmic-heading';
import { CosmicButton } from '@/components/features/cosmic/cosmic-button';
import CosmicBadge from '@/components/features/cosmic/cosmic-badge';
import CosmicCard from '@/components/features/cosmic/cosmic-card';
import { CosmicBackground } from '@/components/features/cosmic/CosmicBackground';
import SacredGeometry from '@/components/ui/sacred-geometry';
import ProductGrid from '@/components/shop/ProductGrid';

export default function ProductPage() {
  const [, params] = useRoute<{ slug: string }>('/shop/product/:slug');
  const slug = params?.slug;
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch product details
  const { 
    data: product, 
    isLoading: productLoading, 
    isError: productError 
  } = useQuery({
    queryKey: ['/api/shop/products', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await apiRequest<Product>(`/api/shop/products/${slug}`);
      return response;
    },
    enabled: !!slug,
  });

  // Fetch related products
  const { 
    data: relatedProducts,
    isLoading: relatedLoading
  } = useQuery({
    queryKey: ['/api/shop/products', product?.categoryId, 'related'],
    queryFn: async () => {
      if (!product) return [];
      const response = await apiRequest<Product[]>(
        `/api/shop/categories/${product.categoryId}/products?limit=4`
      );
      return response.filter(p => p.id !== product.id).slice(0, 4);
    },
    enabled: !!product,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      return apiRequest('/api/shop/cart/items', {
        method: 'POST',
        data: { productId, quantity }
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/cart'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  });

  // Update document title and scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (product) {
      document.title = `${product.name} - Dale Loves Whales Shop`;
    } else {
      document.title = "Product - Dale Loves Whales Shop";
    }
  }, [product]);

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const maxQuantity = product?.inventory || 10;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate({ productId: product.id, quantity });
    }
  };

  // Loading state
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CosmicHeading as="h1" size="2xl" weight="bold" className="mb-4">
          Product Not Found
        </CosmicHeading>
        <p className="mb-8 text-muted-foreground">
          The product you're looking for couldn't be found or doesn't exist.
        </p>
        <Link href="/shop">
          <CosmicButton variant="cosmic">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </CosmicButton>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.salePrice !== null && parseFloat(product.salePrice as string) < parseFloat(product.price as string);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.price as string) - parseFloat(product.salePrice as string)) / parseFloat(product.price as string)) * 100) 
    : 0;
  
  const isOutOfStock = product.inventory <= 0;
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [`/images/products/${product.id === 'prod-1' ? 'crystal-bowl.jpg' : 
        product.id === 'prod-2' ? 'energy-pendant.jpg' : 
        product.id === 'prod-3' ? 'cosmic-frequency-album.png' : 
        product.id === 'prod-4' ? 'meditation-cushion.jpg' : 
        product.id === 'prod-5' ? 'sacred-geometry.jpg' : 
        'cosmic-journal.jpg'}`];

  return (
    <div className="min-h-screen relative bg-[#050f28] text-[#e8e6e3]">
      <CosmicBackground opacity={0.35} color="cyan" nebulaEffect={true} />
      
      {/* Sacred geometry elements in page margins */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left margin sacred geometry - one at top, one at bottom */}
        <div className="absolute top-40 left-5 opacity-20 hidden md:block">
          <SacredGeometry variant="flower-of-life" size={120} animated={false} />
        </div>
        <div className="absolute bottom-40 left-5 opacity-20 hidden md:block">
          <SacredGeometry variant="metatron-cube" size={120} animated={false} />
        </div>
        
        {/* Right margin sacred geometry - one at top, one at bottom */}
        <div className="absolute top-40 right-5 opacity-20 hidden md:block">
          <SacredGeometry variant="vesica-piscis" size={120} animated={false} />
        </div>
        <div className="absolute bottom-40 right-5 opacity-20 hidden md:block">
          <SacredGeometry variant="star-tetrahedron" size={120} animated={false} />
        </div>
      </div>
    
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/shop">
                  <span className="inline-flex items-center text-sm font-medium text-cosmic-primary hover:opacity-80">
                    Shop
                  </span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href={`/shop/categories/${product.categoryId}`}>
                    <span className="text-sm font-medium text-cosmic-primary hover:opacity-80">
                      {product.category?.name || 'Category'}
                    </span>
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-muted-foreground truncate max-w-[150px] md:max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden border border-gray-800 clip-path-octagon">
              <img 
                src={productImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <CosmicBadge variant="destructive">
                    {discountPercentage}% OFF
                  </CosmicBadge>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden clip-path-octagon
                      ${activeImageIndex === index 
                        ? 'border-cosmic-primary cosmic-hover-glow' 
                        : 'border-gray-700 hover:border-gray-500'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.featured && (
                  <CosmicBadge variant="cosmic">Featured</CosmicBadge>
                )}
                {isOutOfStock ? (
                  <CosmicBadge variant="outline">Out of Stock</CosmicBadge>
                ) : (
                  <CosmicBadge variant="success">In Stock</CosmicBadge>
                )}
              </div>
              
              <CosmicHeading as="h1" size="2xl" weight="bold">
                {product.name}
              </CosmicHeading>
              
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill={star <= (product.rating || 5) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">(12 reviews)</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="mt-6">
              {hasDiscount ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-red-400 mr-3">
                    {formatCurrency(parseFloat(product.salePrice as string))}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(parseFloat(product.price as string))}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  {formatCurrency(parseFloat(product.price as string))}
                </span>
              )}
            </div>
            
            {/* Description */}
            <div>
              <p className="text-gray-300">
                {product.description}
              </p>
            </div>
            
            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="mt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-300">Quantity:</span>
                  <div className="flex items-center">
                    <CosmicButton 
                      variant="outline" 
                      size="sm"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 rounded-r-none cosmic-hover-glow"
                    >
                      -
                    </CosmicButton>
                    <div className="h-10 w-16 flex items-center justify-center border-y border-gray-700 font-medium">
                      {quantity}
                    </div>
                    <CosmicButton 
                      variant="outline" 
                      size="sm"
                      onClick={increaseQuantity}
                      disabled={quantity >= (product.inventory || 10)}
                      className="h-10 w-10 p-0 rounded-l-none cosmic-hover-glow"
                    >
                      +
                    </CosmicButton>
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.inventory} available
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <CosmicButton 
                    variant="cosmic" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || isOutOfStock}
                    className="flex-grow cosmic-hover-glow"
                  >
                    {addToCartMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    Add to Cart
                  </CosmicButton>
                  
                  <CosmicButton variant="outline" size="lg" className="cosmic-hover-glow">
                    <Heart className="h-4 w-4" />
                  </CosmicButton>
                  
                  <CosmicButton variant="outline" size="lg" className="cosmic-hover-glow">
                    <Share2 className="h-4 w-4" />
                  </CosmicButton>
                </div>
              </div>
            )}
            
            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <CosmicHeading as="h3" size="lg" weight="medium" className="mb-4">
                Product Details
              </CosmicHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SKU:</span>
                    <span>{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <Link href={`/shop/categories/${product.categoryId}`}>
                      <span className="text-cosmic-primary hover:underline">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span>{product.weight ? `${product.weight} lbs` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dimensions:</span>
                    <span>
                      {product.dimensions || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {(relatedProducts && relatedProducts.length > 0) && (
          <section className="mb-16">
            <CosmicHeading as="h2" size="xl" weight="bold" className="mb-6">
              Related Products
            </CosmicHeading>
            
            {relatedLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ProductGrid 
                products={relatedProducts}
                onQuickView={(product) => {
                  window.location.href = `/shop/product/${product.slug}`;
                }}
                onAddToCart={(productId) => {
                  addToCartMutation.mutate({ productId, quantity: 1 });
                }}
                showWishlist={false}
                variant="grid"
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}