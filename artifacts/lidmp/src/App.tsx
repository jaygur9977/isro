import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "./components/LoadingScreen";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Map2D from "./pages/Map2D";
import Simulator3D from "./pages/Simulator3D";
import IceDetection from "./pages/IceDetection";
import LandingSites from "./pages/LandingSites";
import RoverPath from "./pages/RoverPath";
import RiskAssessment from "./pages/RiskAssessment";
import AIOptimizer from "./pages/AIOptimizer";
import Reports from "./pages/Reports";
import type { LunarCrater } from "./data/sensorData";

const queryClient = new QueryClient();

type PageId = "dashboard"|"map2d"|"sim3d"|"ice"|"landing"|"rover"|"risk"|"ai"|"reports";

function PageContent({ page, crater }: { page: PageId; crater: LunarCrater }) {
  switch (page) {
    case "dashboard": return <Dashboard crater={crater} />;
    case "map2d":     return <Map2D crater={crater} />;
    case "sim3d":     return <Simulator3D />;
    case "ice":       return <IceDetection />;
    case "landing":   return <LandingSites />;
    case "rover":     return <RoverPath />;
    case "risk":      return <RiskAssessment />;
    case "ai":        return <AIOptimizer />;
    case "reports":   return <Reports />;
    default:          return <Dashboard crater={crater} />;
  }
}

function App() {
  const [crater, setCrater] = useState<LunarCrater | null>(null);
  const [page, setPage] = useState<PageId>("dashboard");

  if (!crater) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoadingScreen onReady={(c) => setCrater(c)} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          <Header crater={crater} />
          <div className="flex flex-1 min-h-0">
            <Sidebar active={page} onNav={(id) => setPage(id as PageId)} />
            <main className="flex-1 min-h-0 overflow-hidden bg-transparent">
              <PageContent page={page} crater={crater} />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
