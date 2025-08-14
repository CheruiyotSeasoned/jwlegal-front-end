import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import AdminRoles from "./pages/AdminRoles";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminDatabase from "./pages/AdminDatabase";
import AdminResearchSubmissions from "./pages/AdminResearchSubmissions";

// Lawyer pages
import LawyerCases from "./pages/LawyerCases";
import LawyerClients from "./pages/LawyerClients";
import LawyerResearch from "./pages/LawyerResearch";
import LawyerMessages from "./pages/LawyerMessages";
import LawyerCalendar from "./pages/LawyerCalendar";
import LawyerBilling from "./pages/LawyerBilling";

// Client pages
import ClientCases from "./pages/ClientCases";
import ClientSubmit from "./pages/ClientSubmit";
import ClientMessages from "./pages/ClientMessages";
import ClientAppointments from "./pages/ClientAppointments";
import ClientDocuments from "./pages/ClientDocuments";

// Judicial pages
import JudicialResearch from "./pages/JudicialResearch";
import JudicialPrecedents from "./pages/JudicialPrecedents";
import JudicialCalendar from "./pages/JudicialCalendar";
import Signup from "./pages/signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} /> 
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/database" element={<AdminDatabase />} />
            <Route path="/admin/research-submissions" element={<AdminResearchSubmissions />} />
            
            {/* User Dashboard */}
            <Route path="/user-dashboard" element={<UserDashboard />} />
            
            {/* Lawyer Routes */}
            <Route path="/lawyer/cases" element={<LawyerCases />} />
            <Route path="/lawyer/clients" element={<LawyerClients />} />
            <Route path="/lawyer/research" element={<LawyerResearch />} />
            <Route path="/lawyer/messages" element={<LawyerMessages />} />
            <Route path="/lawyer/calendar" element={<LawyerCalendar />} />
            <Route path="/lawyer/billing" element={<LawyerBilling />} />
            
            {/* Client Routes */}
            <Route path="/client/cases" element={<ClientCases />} />
            <Route path="/client/submit" element={<ClientSubmit />} />
            <Route path="/client/messages" element={<ClientMessages />} />
            <Route path="/client/appointments" element={<ClientAppointments />} />
            <Route path="/client/documents" element={<ClientDocuments />} />
            
            {/* Judicial Routes */}
            <Route path="/judicial/research" element={<JudicialResearch />} />
            <Route path="/judicial/precedents" element={<JudicialPrecedents />} />
            <Route path="/judicial/calendar" element={<JudicialCalendar />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;