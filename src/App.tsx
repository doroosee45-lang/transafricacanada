import FinancialLedger from './components/Finance/FinancialLedger';
import ShippingPricing from './pages/Settings/ShippingPricing';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './components/Context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer       from './components/Marketplace/CartDrawer';
import ProtectedRoute   from './components/Context/Protectedroute';
import PublicRoute      from './components/Context/PublicRoute';
import Layout           from './components/Layout/Layout';

// Public Pages
import Home             from './pages/Home/Home';
import Login            from './pages/Auth/Login';
import Register         from './pages/Auth/Register';
import ForgotPassword   from './pages/Auth/ForgotPassword';
import ResetPassword    from './pages/Auth/ResetPassword';
import Contact          from './pages/Contact/Contact';
import Tarifs           from './pages/Home/Tarifs';
import Solutions        from './pages/Home/Solutions';
import Caracteristiques from './pages/Home/Caracteristiques';
import Demo             from './pages/Home/Demo';
import About            from './pages/About/About';

// Dashboards
import Dashboard        from './pages/Dashboard/Dashboard';
import DashboardClient  from './pages/Dashboard/DashboardClient';

// Clients
import ClientsList      from './pages/Clients/ClientsList';
import ClientDetail     from './pages/Clients/ClientDetail';

// Packages
import PackagesList     from './pages/Packages/PackagesList';
import PackageDetail    from './pages/Packages/PackageDetail';
import AddPackage       from './pages/Packages/AddPackage';
import PackageTracking  from './pages/Packages/PackageTracking';

// Agencies
import AgenciesList     from './pages/Agencies/AgenciesList';
import AgencyDetail     from './pages/Agencies/AgencyDetail';
import AddAgency        from './pages/Agencies/AddAgency';

// Employees
import EmployeesList    from './pages/Employees/EmployeesList';
import EmployeeDetail   from './pages/Employees/EmployeeDetail';
import AddEmployee      from './pages/Employees/AddEmployee';

// Payments
import PaymentsList     from './pages/Payments/PaymentsList';
import PaymentDetail    from './pages/Payments/PaymentDetail';
import AddPayment       from './pages/Payments/AddPayment';
import InvoiceView      from './pages/Payments/InvoiceView';

// Marketplace
import MarketplaceHub   from './pages/Marketplace/MarketplaceHub';
import MySales          from './pages/Marketplace/MySales';
import KilosMarketplace from './pages/Marketplace/KilosMarketplace';
import SellKilos        from './pages/Marketplace/SellKilos';
import BuyKilos         from './pages/Marketplace/BuyKilos';
import MyKilosSold      from './pages/Marketplace/MyKilosSold';
import MyKilosBought    from './pages/Marketplace/MyKilosBought';

// Admin
import UsersClients     from './pages/Admin/UsersClients';
import Messages         from './pages/Admin/Messages';

// Other
import Analytics        from './pages/Analytics/Analytics';
import Profile          from './pages/Profile/Profile';
import Settings         from './pages/Settings/Settings';
import Notifications    from './pages/Notifications/Notifications';
import Reports          from './pages/Reports/Reports';
import Help             from './pages/Help/Help';

import ChatButton from './components/Chat/ChatButton';

/* ─── Composant wrapper avec chat ───────────────────────────────── */
const AppWithChat = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return (
    <>
      {children}
      {/* Le chat est disponible sur toutes les pages, même non connecté */}
      <ChatButton userId={user?.id} />
    </>
  );
};

/* ─── Dashboard Router ──────────────────────────────────────────── */
const DashboardRouter = () => {
  const { user } = useAuth();
  const isAdmin = !!user?.role && ['admin', 'superadmin', 'manager', 'agent'].includes(user.role);
  return isAdmin ? <Dashboard /> : <DashboardClient />;
};

/* ─── App ───────────────────────────────────────────────────────── */
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
        <ToastContainer position="top-right" autoClose={4000} theme="dark" />
        <CartDrawer />
        <AppWithChat>
          <Routes>
            {/* ══════════════════════════════════════════ */}
            {/* ROUTES PUBLIQUES                          */}
            {/* ══════════════════════════════════════════ */}
            <Route path="/" element={<Home />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="/tarifs"           element={<Tarifs />} />
            <Route path="/solutions"        element={<Solutions />} />
            <Route path="/caracteristiques" element={<Caracteristiques />} />
            <Route path="/demo"             element={<Demo />} />
            <Route path="/about"            element={<About />} />
            {/* Suivi public : lien partagé aux clients (WhatsApp, bordereau). API publique en lecture seule. */}
            <Route path="/tracking"                 element={<PackageTracking publicMode />} />
            <Route path="/tracking/:trackingNumber" element={<PackageTracking publicMode />} />

            {/* Login & Register — redirige si déjà connecté */}
            <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            {/* Mot de passe oublié : demande (déconnecté) ; lien reçu par e-mail (ouvrable même connecté) */}
            <Route path="/forgot-password"        element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:token"  element={<ResetPassword />} />

            {/* ══════════════════════════════════════════ */}
            {/* ROUTES PROTÉGÉES                          */}
            {/* ══════════════════════════════════════════ */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard adapté au rôle */}
              <Route index element={<DashboardRouter />} />

              {/* Clients — admin seulement */}
              <Route path="clients"        element={<ProtectedRoute roles={['admin','superadmin','manager']}><ClientsList /></ProtectedRoute>} />
              <Route path="clients/add"    element={<ProtectedRoute roles={['admin','superadmin','manager']}><ClientsList /></ProtectedRoute>} />
              <Route path="clients/:id"    element={<ProtectedRoute roles={['admin','superadmin','manager']}><ClientDetail /></ProtectedRoute>} />

              {/* Packages */}
              <Route path="packages"              element={<PackagesList />} />
              <Route path="packages/add"          element={<AddPackage />} />
              <Route path="packages/tracking"     element={<PackageTracking />} />
              <Route path="packages/:id"          element={<PackageDetail />} />
              <Route path="packages/:id/tracking" element={<PackageTracking />} />

              {/* Clients & Users — admin seulement */}
              <Route path="users-clients" element={<ProtectedRoute roles={['admin','superadmin']}><UsersClients /></ProtectedRoute>} />
              {/* Messages de contact — administrateurs */}
              <Route path="messages" element={<ProtectedRoute roles={['admin','superadmin']}><Messages /></ProtectedRoute>} />

              {/* Agencies — admin seulement */}
              <Route path="agencies"     element={<ProtectedRoute roles={['admin','superadmin','manager']}><AgenciesList /></ProtectedRoute>} />
              <Route path="agencies/add" element={<ProtectedRoute roles={['admin','superadmin']}><AddAgency /></ProtectedRoute>} />
              <Route path="agencies/:id" element={<ProtectedRoute roles={['admin','superadmin','manager']}><AgencyDetail /></ProtectedRoute>} />

              {/* Employees — admin seulement */}
              <Route path="employees"          element={<ProtectedRoute roles={['admin','superadmin','manager']}><EmployeesList /></ProtectedRoute>} />
              <Route path="employees/add"      element={<ProtectedRoute roles={['admin','superadmin']}><AddEmployee /></ProtectedRoute>} />
              <Route path="employees/:id"      element={<ProtectedRoute roles={['admin','superadmin','manager']}><EmployeeDetail /></ProtectedRoute>} />
              <Route path="employees/:id/edit" element={<ProtectedRoute roles={['admin','superadmin']}><AddEmployee /></ProtectedRoute>} />

              {/* Payments */}
              <Route path="payments"             element={<><FinancialLedger /><PaymentsList /></>} />
              <Route path="payments/add"         element={<AddPayment />} />
              <Route path="payments/:id"         element={<PaymentDetail />} />
              <Route path="payments/:id/invoice" element={<InvoiceView />} />

              {/* Marketplace */}
              <Route path="marketplace"                 element={<MarketplaceHub />} />
              <Route path="marketplace/my-sales"        element={<MySales />} />
              <Route path="marketplace/kilos"           element={<KilosMarketplace />} />
              <Route path="marketplace/kilos/sell"      element={<SellKilos />} />
              <Route path="marketplace/kilos/:id"       element={<BuyKilos />} />
              <Route path="marketplace/my-kilos-sold"   element={<MyKilosSold />} />
              <Route path="marketplace/my-kilos-bought" element={<MyKilosBought />} />

              {/* Autres */}
              <Route path="analytics"     element={<ProtectedRoute roles={['admin','superadmin','manager']}><><FinancialLedger /><Analytics /></></ProtectedRoute>} />
              <Route path="profile"       element={<Profile />} />
              <Route path="shipping-pricing" element={<ProtectedRoute roles={['admin','superadmin']}><ShippingPricing /></ProtectedRoute>} />
              <Route path="settings"      element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="reports"       element={<ProtectedRoute roles={['admin','superadmin','manager']}><><FinancialLedger /><Reports /></></ProtectedRoute>} />
              <Route path="help"          element={<Help />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppWithChat>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;