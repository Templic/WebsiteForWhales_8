/**
 * ShopPage Component 
 * Main entry point for the shop section of the application
 * Handles product display, filtering, and layout management
 */

import React, { useState, useEffect } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilter } from "@/components/shop/ProductFilter";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { useRoute } from "wouter";
import { CosmicBackground } from "@/components/features/cosmic/CosmicBackground";
import EnhancedShoppingExperience from "@/components/shop/EnhancedShoppingExperience";
import CosmicCollectibles from "@/components/shop/CosmicCollectibles";
import ProductComparison from "@/components/shop/ProductComparison";
import EnhancedShoppingVenn from "@/components/shop/EnhancedShoppingVenn";
import SacredGeometry from "@/components/ui/sacred-geometry";
import "@/components/shop/shop-animations.css";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Star,
  Filter,
  Grid3X3,
  ListFilter,
  ChevronDown,
  ShoppingCart,
  Search,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ComingSoonNotice } from "@/components/common/ComingSoonNotice";

// Import types from the centralized types
import { Product, CartItem } from '@/types/shop';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "prod-1",
    name: "Celestial Crystal Sound Bowl",
    description: "Hand-crafted crystal bowl tuned to 432Hz frequency for deep healing vibrations. Each bowl is cleansed and charged under the full moon.",
    price: 129.99,
    image: "/images/merchandise/crystal-singing-bowl.svg",
    rating: 4.8,
    inStock: true,
    categories: ["Healing Tools", "Sound Therapy", "Premium"],
    featured: true,
    attributes: {
      material: "Crystal Quartz",
      frequency: "432Hz",
      diameter: "8 inches"
    }
  },
  {
    id: "prod-2",
    name: "Cosmic Energy Pendant",
    description: "Handcrafted pendant containing specialized crystals that resonate with cosmic frequencies. Designed to balance your energy field and enhance intuition.",
    price: 45.99,
    image: "/images/merchandise/cosmic-pendant.svg",
    rating: 4.6,
    inStock: true,
    categories: ["Jewelry", "Energy Tools"],
    new: true,
    attributes: {
      material: "Sterling Silver with Labradorite",
      length: "18 inches",
      cleansing: "Moonlight charged"
    }
  },
  {
    id: "prod-3",
    name: "Cosmic Frequency Digital Album",
    description: "A collection of 12 tracks specifically designed to activate different energy centers. Features binaural beats and isochronic tones layered with ambient sounds.",
    price: 18.99,
    image: "/images/merchandise/cosmic-album.svg",
    rating: 4.9,
    inStock: true,
    categories: ["Digital", "Music", "Featured"],
    discountPercent: 15,
    attributes: {
      format: "Digital Download (FLAC + MP3)",
      length: "74 minutes",
      tracks: "12"
    }
  },
  {
    id: "prod-4",
    name: "Meditation Cushion Set",
    description: "Ergonomically designed meditation cushion set with cosmic pattern. Created for proper alignment during extended meditation sessions.",
    price: 89.99,
    image: "/images/merchandise/meditation-cushion.svg",
    rating: 4.7,
    inStock: true,
    categories: ["Meditation", "Home"],
    attributes: {
      material: "Organic Cotton",
      filling: "Buckwheat hulls",
      dimensions: "16\" diameter, 6\" height"
    }
  },
  {
    id: "prod-5",
    name: "Sacred Geometry Wall Art",
    description: "Hand-painted sacred geometry artwork design to enhance the energetic field of your space. Available in multiple geometric patterns.",
    price: 149.99,
    image: "/images/merchandise/sacred-geometry.svg",
    rating: 4.9,
    inStock: false,
    categories: ["Art", "Home", "Premium"],
    featured: true,
    attributes: {
      material: "Canvas and non-toxic paint",
      size: "24\" x 24\"",
      pattern: "Metatron's Cube"
    }
  },
  {
    id: "prod-6",
    name: "Cosmic Journey Journal",
    description: "Beautifully designed journal with prompts to document your spiritual journey, dreams, and cosmic insights. Includes moon phase tracking.",
    price: 24.99,
    image: "/images/merchandise/cosmic-journal.svg",
    rating: 4.5,
    inStock: true,
    categories: ["Books", "Self-Development"],
    new: true,
    discountPercent: 10,
    attributes: {
      pages: "200 with gilt edges",
      material: "Vegan leather cover",
      extras: "Ribbon bookmark, elastic closure"
    }
  }
];

// We're now using the CartItem interface from the centralized types

// Interface for product filtering options
interface FilterState {
  category: string[];
  priceRange: [number, number];
  sortBy: string;
}

const ShopPage: React.FC = () => {
  const [, params] = useRoute('/shop/:category?');
  const { toast } = useToast();
  // Always use the sample products for demonstration
  const [products] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  // Use cart context
  const { items: cart, addToCart: addItemToCart, removeFromCart, getCartTotal, getItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [userPoints, setUserPoints] = useState(1200); // Sample loyalty points for the user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 1000],
    sortBy: "newest"
  });

  // Extract all categories from products
  const allCategories = Array.from(
    new Set(products.flatMap((product) => product.categories))
  );

  // Apply filters and sorting  (This needs to be updated to use the new filters state)
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.categories.some((category) => category.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((category) => filters.category.includes(category))
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (a.new === b.new ? 0 : a.new ? -1 : 1));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters]);

  // The filtered products are managed by the useEffect hook above

  // Add animation to the cart button when adding items
  const animateCartButton = () => {
    const cartButton = document.querySelector('.cart-floating-button');
    if (cartButton) {
      cartButton.classList.add('cart-bump');
      setTimeout(() => {
        cartButton.classList.remove('cart-bump');
      }, 300);
    }
  };

  // When adding to cart, animate and add points 
  const handleAddProduct = (product: Product) => {
    // Add to cart using our context
    addItemToCart(product);

    // Add animation to the cart button
    animateCartButton();

    // Add points for each item added to cart (in a real app this would happen on purchase)
    setUserPoints((prev) => prev + Math.round(product.price));
  };

  // Get the cart total
  const cartTotal = getCartTotal();

  // Handle viewing a product
  const handleProductView = (productId: string) => {
    console.log(`Viewing product: ${productId}`);
    // In a real app, this would navigate to a product detail page
  };

  // Handler for filter updates
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Animation effect for elements
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.cosmic-slide-up, .cosmic-scale, .cosmic-fade-in');
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('in');
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen relative bg-[#121b35] text-[#f1f0ee]">
      <ComingSoonNotice 
        pageName="Cosmic Shop"
        features={[
          "Sacred Geometry Merchandise",
          "Sound Healing Instruments",
          "Digital Music Downloads",
          "Meditation Accessories",
          "Crystal Collections",
          "Collaborative Shopping Experience",
          "Secure Payment Processing",
          "Order Tracking & Management"
        ]}
        estimatedCompletion="Q2 2025"
        additionalInfo={
          <div className="mt-6 p-4 bg-[#00ebd6]/10 rounded-lg border border-[#00ebd6]/30">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-semibold text-[#00ebd6]">Currently Available:</span>
            </p>
            <p className="text-sm text-gray-300">
              Dale currently operates an Etsy shop where you can find whale-inspired merchandise and cosmic consciousness items. 
            </p>
            <a 
              href="https://www.etsy.com/shop/DaleLovesWhales" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-[#00ebd6]/20 hover:bg-[#00ebd6]/30 border border-[#00ebd6]/50 rounded-lg text-[#00ebd6] text-sm font-medium transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,235,214,0.4)]"
            >
              Visit Dale's Etsy Shop →
            </a>
          </div>
        }
      />
      {/* Adjusted background with higher brightness */}
      <CosmicBackground opacity={0.35} color="indigo" nebulaEffect={true} />

      {/* Improved lighting overlay for better visibility */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-indigo-900/5 via-blue-900/5 to-violet-900/5 pointer-events-none"></div>

      {/* Sacred geometry elements in page margins with better visibility */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left margin sacred geometry - one at top, one at bottom */}
        <div className="absolute top-40 left-5 opacity-30 hidden md:block">
          <SacredGeometry variant="merkaba" size={120} animated={true} />
        </div>
        <div className="absolute bottom-40 left-5 opacity-30 hidden md:block">
          <SacredGeometry variant="dodecahedron" size={120} animated={false} />
        </div>

        {/* Right margin sacred geometry - one at top, one at bottom */}
        <div className="absolute top-40 right-5 opacity-30 hidden md:block">
          <SacredGeometry variant="icosahedron" size={120} animated={false} />
        </div>
        <div className="absolute bottom-40 right-5 opacity-30 hidden md:block">
          <SacredGeometry variant="flower-of-life" size={120} animated={false} />
        </div>

        {/* Additional ambient lighting elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/10 filter blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading products</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-sm text-red-600 dark:text-red-400"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <ShopHeader 
            onSearch={(query) => {
              setSearchQuery(query);
              // Additional search logic if needed
            }}
            onVoiceSearch={(transcript) => {
              setSearchQuery(transcript);
              // Additional voice search logic if needed
            }}
            cartItemCount={cart.length}
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            allCategories={allCategories} 
            categoryFilter={filters.category} 
            setCategoryFilter={(cat: string[]) => handleFilterChange({ category: cat })}
            priceRange={filters.priceRange}
            setPriceRange={(range: [number, number]) => handleFilterChange({ priceRange: range })}
            sortOrder={filters.sortBy}
            setSortOrder={(sort: string) => handleFilterChange({ sortBy: sort })}
            viewType={viewType}
            setViewType={setViewType}
          />

          {/* Enhanced Shopping Components - Order adjusted per request */}
          <div className="mt-4">
            <EnhancedShoppingVenn />
          </div>

          <div className="mt-16">
            <EnhancedShoppingExperience />
          </div>
        </div>

        {/* Floating Shopping Cart */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg cart-floating-button cosmic-hover-glow"
              size="icon"
              variant="default"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs animate-bounce-small">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Your Cosmic Cart</SheetTitle>
              <SheetDescription>
                Review your selected items and proceed to checkout
              </SheetDescription>
            </SheetHeader>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full -mt-16">
                <div className="my-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-medium">Your cart is empty</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  Add some items to your cart to see them here.
                </p>
              </div>
            ) : (
              <div className="mt-8">
                <div className="space-y-4 max-h-[60vh] overflow-auto pb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex border-b border-border pb-4">
                      <div
                        className="w-16 h-16 rounded-md bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${item.product.image})` }}
                      ></div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                          <button
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </div>
                          <div className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mb-6">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Continue Shopping
                    </Button>
                    <Button className="flex-1">
                      Checkout
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Tag className="h-3 w-3" />
                    <span>You'll earn {Math.round(cartTotal)} loyalty points with this purchase</span>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ShopPage;