/**
 * WhaleWatcherArt.tsx
 * 
 * Component displaying whale watcher art images with clear Etsy sale labels
 * for Dale Loves Whales platform
 */

import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';

interface WhaleArtItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  etsyUrl: string;
  price: string;
}

const whaleArtItems: WhaleArtItem[] = [
  {
    id: 'universal-connections',
    title: 'Universal Connections',
    description: 'Cosmic whale consciousness connection art',
    imageUrl: '/images/universal-connections-whale.jpg',
    etsyUrl: 'https://etsy.com/shop/daleloveswhales/universal-connections',
    price: '$24.99'
  },
  {
    id: 'orca-sunset',
    title: 'Orca Sunset Breach',
    description: 'Majestic orca whale breaching at sunset',
    imageUrl: '/images/orca-sunset-breach.jpg', 
    etsyUrl: 'https://etsy.com/shop/daleloveswhales/orca-sunset',
    price: '$29.99'
  },
  {
    id: 'golden-whale-pod',
    title: 'Golden Whale Pod',
    description: 'Dale Loves Whales signature underwater scene',
    imageUrl: '/images/golden-whale-pod.jpg',
    etsyUrl: 'https://etsy.com/shop/daleloveswhales/golden-pod',
    price: '$34.99'
  }
];

export function WhaleWatcherArt() {
  return (
    <div className="whale-watcher-art-gallery">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#00ebd6] mb-4">
          Whale Watcher Art Collection
        </h2>
        <p className="text-[#e8e6e3] text-lg">
          Beautiful whale art prints available exclusively on Etsy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whaleArtItems.map((item) => (
          <div 
            key={item.id}
            className="relative group bg-gradient-to-br from-[#0a1f3c] to-[#151d3b] rounded-xl overflow-hidden border border-[#00ebd6]/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Etsy Sale Banner */}
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <ShoppingBag className="h-4 w-4" />
                FOR SALE ON ETSY
              </div>
            </div>

            {/* Price Tag */}
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-[#00ebd6] text-[#0a1f3c] px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {item.price}
              </div>
            </div>

            {/* Image Placeholder with border */}
            <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2d4a] to-[#0f1b2e] border-4 border-[#00ebd6]/30 m-4 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🐋</div>
                <p className="text-[#00ebd6] font-medium">{item.title}</p>
                <p className="text-[#e8e6e3]/70 text-sm mt-1">{item.description}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-[#e8e6e3] mb-2">{item.title}</h3>
              <p className="text-[#e8e6e3]/80 mb-4">{item.description}</p>

              {/* Etsy Purchase Button */}
              <a
                href={item.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white text-center py-3 px-4 rounded-lg font-bold hover:from-[#e55a2b] hover:to-[#e8841a] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <ShoppingBag className="h-5 w-5" />
                Buy on Etsy {item.price}
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Whale Watcher Badge */}
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-2 text-[#00ebd6] text-sm">
                  <span className="text-lg">🐋</span>
                  Whale Watcher Certified Art
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visit Etsy Shop CTA */}
      <div className="text-center mt-12">
        <a
          href="https://etsy.com/shop/daleloveswhales"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-[#e55a2b] hover:to-[#e8841a] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ShoppingBag className="h-6 w-6" />
          Visit Our Complete Etsy Shop
          <ExternalLink className="h-5 w-5" />
        </a>
        <p className="text-[#e8e6e3]/70 mt-3">
          Discover more whale watcher art and cosmic consciousness designs
        </p>
      </div>
    </div>
  );
}

export default WhaleWatcherArt;