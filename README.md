# UCP Web Portal & Admin Panel - Fixes & Architecture Changelog

## 📌 Project Overview
This repository contains the full-stack web application for the **University of Central Punjab (UCP)** portal and protected Content Management System (CMS) Admin Dashboard.

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Multer + Cloudinary, Helmet, Express-Rate-Limit, CORS.
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Axios, React Router v7, React PDF.

---

## 🔍 Summary of Issues Faced & Root Causes

### 1. **Project Creation & Update 422 Validation Error (`POST /api/v1/projects`)**
- **Symptoms:** When creating or editing a project from the admin dashboard, the request failed with `422 (Unprocessable Entity)`: `Validation failed: Array(4)`.
- **Root Cause:** In `ucp-react/src/admin/pages/Projects.jsx`, `projectsService.createProject(null, imageFile)` and `updateProject(..., null, imageFile)` were passing `null` as the payload object instead of passing the form data payload. As a result, `title`, `description`, `category`, and `technologies` were missing in the FormData sent to the backend.
- **Secondary Root Cause:** The backend express-validator was expecting pure arrays for `technologies` and strict booleans for `featured`, which failed when FormData sent serialized strings (`"['React']"`, `"true"`).

### 2. **Admin Login 500 Internal Server Error (`POST /api/v1/auth/login`)**
- **Symptoms:** Attempting to log in as admin resulted in `500 Internal Server Error` with `AxiosError: Request failed with status code 500`.
- **Root Cause:** Vite ran the frontend on port `http://localhost:5174` (port `5173` was busy). The backend CORS middleware had a hardcoded whitelist only allowing `http://localhost:5173`. When an origin of `http://localhost:5174` arrived, CORS middleware threw `Error: NOT_ALLOWED_BY_CORS`, causing an unhandled 500 server crash.

### 3. **Magazines CMS Desynchronization**
- **Symptoms:** The Magazines admin page was using local mock storage (`magazinesService.get()`, `magazinesService.update()`) instead of communicating with the real database API.
- **Root Cause:** Frontend was not hooked to async backend endpoints (`/api/v1/magazines`), and the backend Mongoose model was missing metadata fields (`folder`, `status`, `downloads`, `pinned`, `hidden`).

### 4. **Rigid Update Validation Across CMS Modules**
- **Symptoms:** Editing existing entities (Societies, Campus Information, Announcements, About sections, Home sections) would fail validation if optional or non-modified fields were omitted in partial update (`PUT`) requests.
- **Root Cause:** `PUT` routes were reusing strict creation validators where all fields were mandatory (`.notEmpty()`) rather than optional (`.optional()`).

---

## 🛠️ Detailed List of Changes Made

### 1. **Authentication & CORS Layer**
- **[`backend/src/app.js`](backend/src/app.js):**
  - Updated the CORS middleware to dynamically allow any `localhost` and `127.0.0.1` port (`5173`, `5174`, `5175`, `3000`, etc.) in development mode.
- **[`backend/.env`](backend/.env):**
  - Expanded `CLIENT_URL` configuration to include multiple localhost development ports.

### 2. **Validation Middleware & Error Messages**
- **[`backend/src/middleware/validation.middleware.js`](backend/src/middleware/validation.middleware.js):**
  - Enhanced error response formatting to output the specific field-level validation message directly in `err.message` so frontend toast notifications display clear, actionable errors.

### 3. **Projects Module**
- **[`ucp-react/src/admin/pages/Projects.jsx`](ucp-react/src/admin/pages/Projects.jsx):**
  - Fixed `handleSubmit` to pass the complete `payload` and `imageFile` to `projectsService.createProject(payload, imageFile)` and `projectsService.updateProject(id, payload, imageFile)`.
- **[`backend/src/modules/projects/project.validator.js`](backend/src/modules/projects/project.validator.js):**
  - Added `sanitizeTechnologies` to safely parse JSON strings and comma-separated strings into arrays.
  - Added `sanitizeBoolean` to safely parse string booleans (`"true"` / `"false"`).
  - Created `projectUpdateValidator` with `.optional()` fields.
- **[`backend/src/modules/projects/project.routes.js`](backend/src/modules/projects/project.routes.js):**
  - Applied `projectUpdateValidator` to the `PUT /:id` route.

### 4. **Magazines Module**
- **[`backend/src/modules/magazines/magazine.model.js`](backend/src/modules/magazines/magazine.model.js):**
  - Added missing fields to the schema: `folder`, `status`, `downloads`, `pinned`, `hidden` with sensible defaults.
- **[`backend/src/modules/magazines/magazine.validator.js`](backend/src/modules/magazines/magazine.validator.js):**
  - Added `sanitizeTopics` and `sanitizeBoolean`.
  - Added `updateMagazineValidator` with optional fields for updates.
- **[`backend/src/modules/magazines/magazine.controller.js`](backend/src/modules/magazines/magazine.controller.js):**
  - Supported both direct URLs and uploaded file buffers for `coverImage` and `pdfUrl`.
- **[`ucp-react/src/admin/pages/Magazines.jsx`](ucp-react/src/admin/pages/Magazines.jsx):**
  - Replaced mock local storage with live asynchronous CRUD methods using `magazinesService` (`getAllMagazines`, `createMagazine`, `updateMagazine`, `deleteMagazine`).
- **[`ucp-react/src/pages/EMagazine/EMagazine.jsx`](ucp-react/src/pages/EMagazine/EMagazine.jsx):**
  - Safely extracted the magazines array from the backend response structure.

### 5. **Societies Module**
- **[`backend/src/modules/societies/society.model.js`](backend/src/modules/societies/society.model.js):**
  - Provided default values for non-mandatory fields (`tagline`, `mission`, `vision`, `logo`, `contact.email`) so newly created societies do not fail validation.
  - Supported both `team` and `teamMembers` field aliases.
- **[`backend/src/modules/societies/society.validator.js`](backend/src/modules/societies/society.validator.js):**
  - Added `sanitizeArray` for `objectives` and `activities`.
  - Added `societyUpdateValidator`.
- **[`backend/src/modules/societies/society.routes.js`](backend/src/modules/societies/society.routes.js):**
  - Connected `societyUpdateValidator` on `PUT /:id`.
- **[`backend/src/modules/societies/society.controller.js`](backend/src/modules/societies/society.controller.js):**
  - Synchronized incoming `team` and `teamMembers` payloads.

### 6. **Home & About Modules**
- **[`backend/src/modules/home/home.validator.js`](backend/src/modules/home/home.validator.js):**
  - Relaxed strict validators to `.optional()` on updates and parsed numeric fields (`studentsJoined`, `rating`, `students`, `faculty`, `programs`).
  - Added support for promotional video uploads and video URL updates.
- **[`backend/src/modules/about/about.validator.js`](backend/src/modules/about/about.validator.js):**
  - Added `timelineUpdateValidator`, `leaderUpdateValidator`, and `valueUpdateValidator`.
- **[`backend/src/modules/about/about.routes.js`](backend/src/modules/about/about.routes.js):**
  - Applied update validators to timeline, leaders, and values PUT routes.

### 7. **Campus, Contact & Announcements**
- **[`backend/src/modules/campus/campus.validator.js`](backend/src/modules/campus/campus.validator.js):**
  - Converted nested array validations to flexible arrays to support partial updates.
- **[`backend/src/modules/contact/contact.validator.js`](backend/src/modules/contact/contact.validator.js):**
  - Made `academicProgramValidator` accept both `name` and `programName`.
  - Allowed partial updates for contact information.
- **[`backend/src/modules/announcements/announcement.validator.js`](backend/src/modules/announcements/announcement.validator.js):**
  - Added `updateAnnouncementValidator` and `updateEventValidator` with numeric sanitizers for `day`.
- **[`backend/src/modules/announcements/announcement.routes.js`](backend/src/modules/announcements/announcement.routes.js):**
  - Applied update validators to notice and event PUT routes.
- **[`ucp-react/src/admin/pages/Dashboard.jsx`](ucp-react/src/admin/pages/Dashboard.jsx):**
  - Updated `safeArray` to extract statistics correctly from all backend collection endpoints.

---

## 🚀 How to Run the Application

### 1. **Start Backend Server**
```bash
cd backend
npm install
npm start
```
- Server starts on `http://localhost:5000`
- Connected to MongoDB Atlas cluster.

### 2. **Start Frontend Client**
```bash
cd ucp-react
npm install
npm run dev
```
- Vite runs on `http://localhost:5173` (or `http://localhost:5174`)

---

## 🔑 Admin Credentials
- **URL:** `http://localhost:5173/admin/login` (or current Vite port)
- **Email:** `admin@ucp.com`
- **Password:** `admin123`

---

## ✅ Verification & Testing Summary
- **Frontend Build:** `npm run build` completed with **0 errors**.
- **Login Endpoint:** Tested with `POST /api/v1/auth/login` across different origins (`5173`, `5174`) -> `200 OK` with valid JWT token.
- **Project CRUD:** Validated multipart/form-data upload with sanitized array data.
- **Database Synchronization:** All CMS modules are now fully integrated and dynamically persisted.
