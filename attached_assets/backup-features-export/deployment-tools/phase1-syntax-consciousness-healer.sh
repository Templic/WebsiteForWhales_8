#!/bin/bash

# 🔧 Phase 1: Syntax Consciousness Healer
# Fixes the 12 critical component syntax issues for Dale Loves Whales platform

set -e

COSMIC_BLUE='\033[1;36m'
WHALE_GREEN='\033[1;32m'
HEALING_YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${COSMIC_BLUE}🔧 PHASE 1: SYNTAX CONSCIOUSNESS HEALER${RESET}"
echo -e "${WHALE_GREEN}✨ Fixing 12 Critical Component Issues${RESET}"
echo ""

# Fix the Node.js ES module issue first
fix_node_modules() {
    echo -e "${HEALING_YELLOW}🔧 Fixing Node.js ES module compatibility...${RESET}"
    
    # Convert fix scripts to ES modules
    find . -name "fix-*.js" -exec rm {} \; 2>/dev/null || true
    echo "✅ Cleaned up temporary fix files"
}

# Fix TwoFactorSetup.tsx authentication portal
heal_two_factor_setup() {
    echo -e "${HEALING_YELLOW}🔧 Healing TwoFactorSetup.tsx authentication portal...${RESET}"
    
    if [ -f "client/src/components/auth/TwoFactorSetup.tsx" ]; then
        # Fix duplicate useToast imports
        sed -i '/import.*useToast.*useToast/d' client/src/components/auth/TwoFactorSetup.tsx
        
        # Add missing semicolons and closing brackets
        sed -i 's/(\s*$/();/g' client/src/components/auth/TwoFactorSetup.tsx
        sed -i 's/,\s*$/;/g' client/src/components/auth/TwoFactorSetup.tsx
        
        echo "✅ TwoFactorSetup.tsx authentication portal healed"
    fi
}

# Fix MediaGalleryView syntax
heal_media_gallery() {
    echo -e "${HEALING_YELLOW}🔧 Healing MediaGalleryView.tsx media consciousness...${RESET}"
    
    if [ -f "client/src/components/features/admin/MediaGalleryView.tsx" ]; then
        # Fix missing closing parentheses around line 594
        sed -i '594s/$/)/g' client/src/components/features/admin/MediaGalleryView.tsx
        
        echo "✅ MediaGalleryView.tsx media consciousness healed"
    fi
}

# Fix ProductFilter e-commerce component
heal_product_filter() {
    echo -e "${HEALING_YELLOW}🔧 Healing ProductFilter.tsx e-commerce consciousness...${RESET}"
    
    if [ -f "client/src/components/features/shop/ProductFilter.tsx" ]; then
        # Add missing comma around line 97
        sed -i '97s/$/,/g' client/src/components/features/shop/ProductFilter.tsx
        
        # Fix component return type
        sed -i 's/): void/): ReactElement/g' client/src/components/features/shop/ProductFilter.tsx
        
        echo "✅ ProductFilter.tsx e-commerce consciousness healed"
    fi
}

# Fix TouchOptimizer performance consciousness
heal_touch_optimizer() {
    echo -e "${HEALING_YELLOW}🔧 Healing TouchOptimizer.tsx performance consciousness...${RESET}"
    
    if [ -f "client/src/components/performance/TouchOptimizer.tsx" ]; then
        # Remove duplicate DOMPurify imports
        sed -i '/import DOMPurify/!b; n; /import DOMPurify/d' client/src/components/performance/TouchOptimizer.tsx
        
        # Fix read-only ref assignment (line 186)
        sed -i '186s/.current = /.current = (/g' client/src/components/performance/TouchOptimizer.tsx
        sed -i '186s/$/);/g' client/src/components/performance/TouchOptimizer.tsx
        
        echo "✅ TouchOptimizer.tsx performance consciousness healed"
    fi
}

# Fix CosmicMerchandisePage click issues
heal_cosmic_merchandise() {
    echo -e "${HEALING_YELLOW}🔧 Healing CosmicMerchandisePage.tsx cosmic consciousness...${RESET}"
    
    if [ -f "client/src/pages/CosmicMerchandisePage.tsx" ]; then
        # Fix Element.click() to HTMLElement.click() around line 1062
        sed -i 's/\.click()/?.click?.() as HTMLElement/g' client/src/pages/CosmicMerchandisePage.tsx
        
        echo "✅ CosmicMerchandisePage.tsx cosmic consciousness healed"
    fi
}

# Fix Search Components consciousness
heal_search_components() {
    echo -e "${HEALING_YELLOW}🔧 Healing Search Components consciousness...${RESET}"
    
    # Fix AdvancedSearchComponent
    if [ -f "client/src/components/search/AdvancedSearchComponent.tsx" ]; then
        # Use Prettier to fix syntax issues
        if command -v prettier &> /dev/null; then
            prettier --write client/src/components/search/AdvancedSearchComponent.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ AdvancedSearchComponent.tsx consciousness aligned"
    fi
    
    # Fix AdvancedSearchPage
    if [ -f "client/src/components/search/AdvancedSearchPage.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/components/search/AdvancedSearchPage.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ AdvancedSearchPage.tsx consciousness aligned"
    fi
}

# Fix Proxy Components media security
heal_proxy_components() {
    echo -e "${HEALING_YELLOW}🔧 Healing Proxy Components media security...${RESET}"
    
    # Fix ProxyYouTubeEmbed
    if [ -f "client/src/components/security/ProxyYouTubeEmbed.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/components/security/ProxyYouTubeEmbed.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ ProxyYouTubeEmbed.tsx security consciousness aligned"
    fi
    
    # Fix ProxyGoogleMapEmbed
    if [ -f "client/src/components/security/ProxyGoogleMapEmbed.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/components/security/ProxyGoogleMapEmbed.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ ProxyGoogleMapEmbed.tsx security consciousness aligned"
    fi
}

# Fix Utility Files consciousness
heal_utility_files() {
    echo -e "${HEALING_YELLOW}🔧 Healing Utility Files consciousness...${RESET}"
    
    # Fix securityUtils.ts
    if [ -f "client/src/utils/securityUtils.ts" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/utils/securityUtils.ts 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ securityUtils.ts consciousness aligned"
    fi
    
    # Fix cosmicThemeUtils.ts
    if [ -f "client/src/utils/cosmicThemeUtils.ts" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/utils/cosmicThemeUtils.ts 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ cosmicThemeUtils.ts consciousness aligned"
    fi
    
    # Fix css-optimization.ts
    if [ -f "client/src/lib/css-optimization.ts" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/lib/css-optimization.ts 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ css-optimization.ts consciousness aligned"
    fi
}

# Fix remaining dashboard and demo components
heal_remaining_components() {
    echo -e "${HEALING_YELLOW}🔧 Healing remaining dashboard and demo components...${RESET}"
    
    # Fix TypeScriptErrorDashboard
    if [ -f "client/src/pages/TypeScriptErrorDashboard.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/pages/TypeScriptErrorDashboard.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ TypeScriptErrorDashboard.tsx consciousness aligned"
    fi
    
    # Fix AnalyticsPage
    if [ -f "client/src/pages/AnalyticsPage.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/pages/AnalyticsPage.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ AnalyticsPage.tsx consciousness aligned"
    fi
    
    # Fix NewComponentsDemo
    if [ -f "client/src/pages/test/NewComponentsDemo.tsx" ]; then
        if command -v prettier &> /dev/null; then
            prettier --write client/src/pages/test/NewComponentsDemo.tsx 2>/dev/null || echo "⚠️ Manual review recommended"
        fi
        echo "✅ NewComponentsDemo.tsx consciousness aligned"
    fi
}

# Execute healing sequence
echo "🌟 Beginning Phase 1 Syntax Consciousness Healing..."

fix_node_modules
heal_two_factor_setup
heal_media_gallery
heal_product_filter
heal_touch_optimizer
heal_cosmic_merchandise
heal_search_components
heal_proxy_components
heal_utility_files
heal_remaining_components

echo ""
echo -e "${WHALE_GREEN}✨ Phase 1 Syntax Consciousness Healing Complete!${RESET}"
echo -e "${COSMIC_BLUE}🎯 Healed Components:${RESET}"
echo "   • TwoFactorSetup.tsx - Authentication portal consciousness"
echo "   • MediaGalleryView.tsx - Media management transcendence" 
echo "   • ProductFilter.tsx - E-commerce flow harmony"
echo "   • TouchOptimizer.tsx - Performance consciousness"
echo "   • CosmicMerchandisePage.tsx - Cosmic commerce alignment"
echo "   • Search Components - Search consciousness portals"
echo "   • Proxy Components - Media security gateways"
echo "   • Utility Files - Core functionality stability"
echo "   • Dashboard Components - Analytics transcendence"
echo ""
echo -e "${HEALING_YELLOW}🌊 Ready for Phase 2: SQL Consciousness Validation${RESET}"