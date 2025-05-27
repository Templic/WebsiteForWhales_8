# Authentication Display Syst

e

m how the authentication display system works in the main header component, including the distinction between dashboards and portals, and how users are directed to the appropriate interfaces based on their roles.

## Overview The authentication display system in the main header provides users with visual feedback about their authentication status and quick access to relevant features based on their role. The system now features: 1. A dropdown menu that appears when a user is logged in, showing their: - Username with first letter avatar - Role badge (user, admin, superadmin) - Quick access to relevant sections based on role 2. Clear navigation pathways to the appropriate dashboards or portals: - Regular users are directed to the User Portal - Admins are directed to the Admin Dashboard - Super Admins are directed to the SuperAdmin Dashboar

d

## Terminology Clarification To maintain consistency throughout the application: - **Dashboards**: Administrative interfaces for monitoring and management (used by admin s) - **Portals**: User-facing interfaces for account features and customization (used by regular user

s)

## User Experience by Role ### Regular User s - See "Logged in as [username] [user]" - Access to User Portal feature

s

- Profile settings
- Sign out option ### Administrator

s
- See "Logged in as [username] [admin]"
- Access to Admin Dashboard
- Access to Security Dashboard
- Profile settings
- Sign out option ### Super Administrator

s
- See "Logged in as [username] [superadmin]"
- Access to SuperAdmin Dashboard
- Access to Security Dashboard
- Profile settings
- Sign out option

## Implementation Details The authentication display is implemented in the `MainHeader.tsx` component, which: 1. Retrieves user information from the authentication contex t 2. Determines the appropriate display and navigation options based on the user's role 3. Renders the dropdown menu with user-specific actions 4. Handles logout functionalit

y

## Technical Notes - The system gracefully handles cases where authentication isn't availabl e - Type safety is implemented throughout to prevent runtime error

s

- The dropdown menu is designed to be accessible and mobile-responsive
- All authentication state is managed through the central authentication context

## Related Components - `MainHeader.tsx`: Contains the authentication display implementatio n - `SecurityContext.tsx`: Provides security context for admin feature

s

- `use-auth.tsx`: Provides authentication context and functions
- `AdminDashboardPage.tsx`: Admin interface for site management
- `UserPortalPage.tsx`: User interface for account management