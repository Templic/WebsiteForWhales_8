/**
 * AdminPage.tsx - Updated to use ModernAdminDashboard
 * 
 * Redirects to the modern cosmic-themed admin dashboard
 * following TemplicTune deprecation process
 */
import { ModernAdminDashboard } from "@/components/admin/ModernAdminDashboard";

export default function AdminPage() {
  return <ModernAdminDashboard />;
}