import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorUsuario } from "./hooks/use-usuario";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HistoricoUsuario from "./pages/HistoricoUsuario";
import { JogoProvider } from "./contexts/JogoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProvedorUsuario>
        <Toaster />
        <Sonner />
        <JogoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/jogo" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/historico/:nome" element={<HistoricoUsuario />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </JogoProvider>
      </ProvedorUsuario>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorUsuario } from "./hooks/use-usuario";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HistoricoUsuario from "./pages/HistoricoUsuario";
import { JogoProvider } from "./contexts/JogoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProvedorUsuario>
        <Toaster />
        <Sonner />
        <JogoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/jogo" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/historico/:nome" element={<HistoricoUsuario />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </JogoProvider>
      </ProvedorUsuario>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;