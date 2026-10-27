# Implementation Plan: Frontend-to-Backend Integration

## Context
The goal is to integrate the completed `ucp-react` frontend with the new `backend` API by replacing all mock/local data services with real API calls. The UI/UX, styling, and component structure must remain untouched.

## Approach
1. **Admin Services:** Replace `localCrud.js` and `localDb.js` usage with `axios` services that communicate with the `/api/v1` backend endpoints.
2. **Public Pages:** Replace `DUMMY_` datasets and hardcoded data in `Societies`, `EMagazine`, `Projects`, `NoticeBoard`, `Home`, and `About` pages with fetch requests to backend endpoints.
3. **Authentication:** Update `AdminAuthContext.jsx` to use real API authentication instead of local mock auth.

## Critical Files
- `ucp-react/src/admin/services/index.js`
- `ucp-react/src/admin/context/AdminAuthContext.jsx`
- `ucp-react/src/pages/EMagazine/EMagazine.jsx`
- `ucp-react/src/pages/Societies/Societies.jsx`
- `ucp-react/src/pages/Projects/Projects.jsx`
- `ucp-react/src/pages/NoticeBoard/NoticeBoard.jsx`
- `ucp-react/src/pages/Home/Home.jsx`
- `ucp-react/src/pages/About/About.jsx`

## Verification
- Run backend and frontend simultaneously.
- Verify data loading in public pages against MongoDB collections.
- Verify admin CRUD operations against backend endpoints.
- Ensure all media (Cloudinary) renders correctly.
