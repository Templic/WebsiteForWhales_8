import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./main.css";
import "./components/cosmic/cosmic-animations.css";
import "./components/shop/shop-animations.css";
import "./styles/orientation.css";
import "./styles/mobile-styles.css";
import "./styles/responsive-demo.css";
import "./styles/geometric-text-container.css";
import "./styles/shape-contour-helpers.css";
import "./styles/browser-compatibility.css";
import { OrientationProvider } from "./contexts/OrientationContext";
import { ThemeProvider } from "./components/ui/ThemeProvider";

// Initialize browser compatibility system
import { browserCompatibility } from "./utils/browserCompatibility";
import { performanceMonitoring } from "./utils/performanceMonitoring";
import { animationOptimizer } from "./utils/animationOptimizer";
import deviceGeometryController from "./utils/deviceGeometryController";

// Initialize browser optimizations early
browserCompatibility.getBrowserInfo();
performanceMonitoring.startMonitoring();

// Fix fast spinning animations immediately
animationOptimizer.optimizeExistingAnimations();

// Initialize device-specific geometry controls for mobile fix
deviceGeometryController.logDeviceInfo();

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider>
      <OrientationProvider>
        <App />
      </OrientationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
