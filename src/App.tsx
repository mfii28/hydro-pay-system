import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Rates from './pages/Rates';
import Bills from './pages/Bills';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/rates"
          element={
            <PrivateRoute>
              <Rates />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/bills"
          element={
            <PrivateRoute>
              <Bills />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;