

# NZBD Platform - Full Implementation Plan

## Important Note on Backend

Lovable cannot create or run a backend server. However, I will provide you the **terminal commands** to set up the backend folder yourself, and I will build the entire **frontend** with the correct architecture and UI.

---

## Backend Setup (Terminal Commands for You to Run)

You will create and set up the backend folder yourself. Here are the commands:

```text
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon typescript @types/express @types/node ts-node

# Create folder structure
mkdir -p src/{routes,controllers,models,middleware,config}

# Add to package.json scripts:
# "dev": "nodemon src/server.ts"
# "start": "ts-node src/server.ts"
```

**Backend should run on port 4000** with MongoDB connection. Key API routes to create:
- `POST /api/auth/register` and `POST /api/auth/login` (JWT auth)
- `GET/POST /api/projects` (CRUD for projects with site boundary, lat/lng, context data)
- `GET/POST /api/buildings` (Save/load 3D massing models)

---

## Frontend Changes (What I Will Build)

### 1. Landing Page (`/`) - Reference: Image 1
- Full-screen Leaflet map (light theme, not dark)
- "NashZero" logo top-left, "Sign In" button top-right
- Large centered search bar: "Locate your site and mark boundary..."
- No sidebar on this page
- User can search a location, then draw a polygon boundary on the map
- After marking boundary, "Create Project" button appears
- Clicking it saves the site and navigates to the project context page

### 2. Auth Pages (`/signin`, `/signup`)
- Simple sign-in/sign-up forms
- Connect to backend `/api/auth` endpoints via `VITE_API_URL`
- Store JWT token in localStorage
- Redirect to landing page after login

### 3. Project Context / Inference Page (`/project/:id/context`) - Reference: Image 2
- Dashboard showing project inference data after site analysis
- Top bar: Project name, comfort range, weather icons summary
- Cards grid: Weather (Nash Scale thermometers for Temperature, Humidity, Precipitation), Wind Flow, Nash Comfort Hours (segmented bar), Shadow preview, Wind Direction compass diagrams
- Each card has "More Info" link
- Button to navigate to "Nash Massing"

### 4. Nash Massing Selection Page (`/project/:id/massing`) - Reference: Image 3
- Header: "Nash Massing" with subtitle "Compare, evaluate and select optimal building forms"
- Two cards side by side:
  - **NASH Explore** - Auto Generated Massing - "Start Exploring" button
  - **Nash Studio** - User-Created Massing - "Start Modeling" button
- Nash Studio navigates to the enhanced 3D Modeler

### 5. Enhanced 3D Modeler (`/project/:id/studio`) - Reference: Images 4-9
Rebuild `ModelerPage` with NashZero-style UI:

- **Light blue sky background** (not dark theme)
- **Left toolbar** (vertical icon buttons):
  - Select (cursor), Layers, Copy, Floor splitter, Rotate/Move, Terrain, Undo, Settings, Delete, Draw/Edit, Light bulb (tips)
- **Right toolbar** (vertical icon buttons):
  - Sun/Shadow control, Search/inspect, Visibility toggle, Energy analysis, Collaboration, Properties panel
- **Setup Drawing Units dialog** (image 4): Modal on first entry with radio options (Meters, Feet, Centimeters, Millimeters) + warning note + Confirm button
- **Radiation Analysis panel** (image 5): Floating panel with Month slider + "Run Radiation Analysis" button
- **Shadow Control panel** (image 6): Floating panel with Month/Date/Time sliders + "Apply Shadow Settings" button
- **Landscape Type selector** (image 7): Popup with Roads & Pathways, Water Bodies & Ponds, Grass & Green Areas
- **Tree placement tool** (image 8): Panel with Tree Height, Crown Diameter inputs + Small/Medium/Large presets, click-to-place mode with ESC to exit
- **Shape drawing dialog** (image 9): Modal with Freeform, Rectangle, Circle, Organic shape options
- **"Analyse Massing" button** bottom-right
- **North arrow indicator** bottom-left

### 6. Updated Routing & Layout
- Landing page (`/`): No sidebar, full-screen map
- Auth pages (`/signin`, `/signup`): No sidebar
- Project pages (`/project/:id/*`): With sidebar
- Sidebar updated to show project-specific navigation

---

## Technical Details

### New Files to Create
- `src/pages/LandingPage.tsx` - Full-screen map with search
- `src/pages/SignInPage.tsx` - Auth form
- `src/pages/SignUpPage.tsx` - Auth form
- `src/pages/ProjectContextPage.tsx` - Inference dashboard (image 2)
- `src/pages/MassingSelectionPage.tsx` - Nash Explore vs Studio (image 3)
- `src/pages/StudioPage.tsx` - Enhanced 3D modeler (images 4-9)
- `src/components/studio/LeftToolbar.tsx` - Left icon toolbar
- `src/components/studio/RightToolbar.tsx` - Right icon toolbar
- `src/components/studio/SetupUnitsDialog.tsx` - Units selection modal
- `src/components/studio/RadiationPanel.tsx` - Radiation analysis panel
- `src/components/studio/ShadowControlPanel.tsx` - Shadow control panel
- `src/components/studio/LandscapeSelector.tsx` - Landscape type popup
- `src/components/studio/TreePlacementPanel.tsx` - Tree tool panel
- `src/components/studio/ShapeDrawDialog.tsx` - Shape chooser modal
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/contexts/ProjectContext.tsx` - Active project state
- `src/lib/api.ts` - Axios client pointing to `VITE_API_URL` (default `http://localhost:4000`)

### Files to Modify
- `src/App.tsx` - New route structure with public/protected routes
- `src/components/layout/AppSidebar.tsx` - Project-aware navigation
- `src/components/layout/AppLayout.tsx` - Conditional sidebar

### API Integration Pattern
- All API calls via axios instance with JWT interceptor
- React Query for data fetching/caching
- Graceful fallback to mock data when backend is unavailable

