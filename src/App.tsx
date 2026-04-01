import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ProjectContextPage from "@/pages/ProjectContextPage";
import MassingSelectionPage from "@/pages/MassingSelectionPage";
import StudioPage from "@/pages/StudioPage";
import DashboardPage from "@/pages/DashboardPage";
import SolarDashboard from "@/pages/SolarDashboard";
import EnergyDashboard from "@/pages/EnergyDashboard";
import MapPage from "@/pages/MapPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - no sidebar */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Project routes */}
              <Route path="/project/:id" element={<AppLayout />}>
                <Route path="context" element={<ProjectContextPage />} />
                <Route path="massing" element={<MassingSelectionPage />} />
                <Route path="studio" element={<StudioPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="solar" element={<SolarDashboard />} />
                <Route path="energy" element={<EnergyDashboard />} />
                <Route path="map" element={<MapPage />} />
                <Route path="daylight" element={<PlaceholderPage title="Daylight Analysis" subtitle="Daylight factor, SDi, UDi metrics" />} />
                <Route path="wind" element={<PlaceholderPage title="Wind & Weather" subtitle="Micro-climate and wind analysis" />} />
                <Route path="uhi" element={<PlaceholderPage title="Urban Heat Island" subtitle="UHI metrics and reduction strategies" />} />
                <Route path="hydrology" element={<PlaceholderPage title="Hydrology" subtitle="Rainwater harvesting and water balance" />} />
                <Route path="sustainability" element={<PlaceholderPage title="Sustainability" subtitle="LEED, WELL, and material lifecycle analysis" />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
