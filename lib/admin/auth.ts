/**
 * Admin auth facade — delegates to RBAC v1 (Phase 3 PR-17).
 * Import from here in routes/actions for backward compatibility.
 */
export {
  AdminAccessError,
  getProfileRole,
  isAdminRole,
  isStaffRole,
  PROFILE_ROLES,
  requireAdmin,
  requirePermission,
  requireStaff,
  roleHasPermission,
  STAFF_ROLES,
  type AdminPermission,
  type ProfileRole,
  type StaffRole,
  type StaffSession,
} from './rbac'