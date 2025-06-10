import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/consolidated-cosmic.css";
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
