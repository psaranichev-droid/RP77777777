import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Marketplaces } from './components/Marketplaces';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Lazy-loaded pages — code splitting для быстрой начальной загрузки
const HomePage = lazy(() => import('./pages/HomePage'));
const WholesalePage = lazy(() => import('./pages/WholesalePage'));
const ShowroomPage = lazy(() => import('./pages/ShowroomPage'));
const DesignerPaperPage = lazy(() => import('./pages/DesignerPaperPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CuttingPage = lazy(() => import('./pages/CuttingPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));

// Минимальный fallback без мерцания
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
  </div>
);

// Мгновенный скролл вверх при смене маршрута
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      {!isAdminPage && <Header />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
            <Route path="/showroom" element={<ShowroomPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/designer-paper" element={<DesignerPaperPage />} />
            <Route path="/cutting" element={<CuttingPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProductsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminCategoriesPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminOrdersPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminAnalyticsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && (
        <>
          <Marketplaces />
          <Footer />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
