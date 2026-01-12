import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollToTop from './components/ScrollToTop';
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import AboutSection from "./components/home/AboutSection.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Login from "./pages/admin/Login.jsx";
import Categories from "./pages/admin/Categories.jsx";
import Products from "./pages/admin/Products.jsx";
import CartSidebar from "./components/CartSidebar.jsx";

const AppContent = () => {
    const location = useLocation();
    // La logique pour cacher la navbar fonctionne maintenant car on est DANS le Router
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen bg-cream bg-pattern-dots font-body text-dark">
            {!isAdminPage && <Navbar />}
            <main className="flex-grow w-full">
                <ScrollToTop />
                <CartSidebar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/about" element={<AboutSection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/categories" element={<Categories />} />
                    <Route path="/admin/products" element={<Products />} />

                </Routes>
            </main>

            {!isAdminPage && <Footer />}
        </div>
    );
};

function App() {
  return (
      <BrowserRouter>
          <AppContent />
      </BrowserRouter>
  );
}

export default App
