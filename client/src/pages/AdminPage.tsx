/**
 * AdminPage.tsx - Updated to use StableAdminDashboard
 * 
 * Uses stable implementation with proper error handling
 * and null checking for undefined data
 */
import { StableAdminDashboard } from "@/components/admin/StableAdminDashboard";

export default function AdminPage() {
  return <StableAdminDashboard />;
}