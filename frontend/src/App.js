import { useEffect, useState } from 'react';
import './App.css';

import { isAuthenticated, logout, getCurrentUser, getMe, saveToken } from './api/auth';
import { addToCart, getCartCount }                        from './api/cart';
import { useDarkMode }   from './hooks/useDarkMode';
import TopNavBar         from './components/TopNavBar';
import Footer            from './components/Footer';
import LoginPage         from './pages/Login';
import SignUpPage        from './pages/SignUp';
import GoogleVerifyPage  from './pages/GoogleVerify';
import HomePage          from './pages/Home';
import ProductsPage      from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import PointsPage        from './pages/Points';
import CartPage          from './pages/Cart';
import ProfilePage       from './pages/Profile';
import EditProfilePage   from './pages/EditProfile';
import AdminApp          from './pages/admin/AdminApp';

// The admin dashboard lives behind the "#admin" URL hash (e.g.
// http://localhost:3000/#admin)
const isAdminRoute = () => window.location.hash.replace(/^#\/?/, '') === 'admin';

const consumeGoogleRedirect = () => {
  if (window.location.pathname !== '/auth/google/success') return null;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const otp = params.get('otp');
  const email = params.get('email');

  window.history.replaceState({}, '', '/');

  if (token) {
    saveToken(token);
    return { type: 'session' };
  }
 
  if (otp === 'required' && email) {
    return { type: 'otp', email };
  }
  return null;
};

const App = () => {
  const [googleRedirect] = useState(consumeGoogleRedirect);
  const [page, setPage] = useState(() => {
    if (googleRedirect?.type === 'session' || isAuthenticated()) return 'home';
    if (googleRedirect?.type === 'otp') return 'google-verify';
    return 'login';
  });
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loginNotice, setLoginNotice] = useState('');
  const [user, setUser] = useState(() => getCurrentUser());
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const [adminRoute, setAdminRoute] = useState(() => isAdminRoute());
  useEffect(() => {
    const onHashChange = () => setAdminRoute(isAdminRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const refreshCartCount = () => {
    getCartCount().then(setCartCount).catch(() => {});
  };

  const handleAddToCart = (voucherId) =>
    addToCart(voucherId).then((result) => {
      refreshCartCount();
      return result;
    });

  useEffect(() => {
    if (isAuthenticated()) {
      getMe().then(setUser).catch(() => {});
      refreshCartCount();
    }
  }, []);

  // Navigate to a top-level page
  const handleNavigate = (target) => {
    setPage(target);
    setSelectedVoucherId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // "Explore" on any voucher card → detail page
  const handleExplore = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear the saved session and return to the Login screen.
  const handleLogout = () => {
    logout();
    setUser(null);
    setSelectedVoucherId(null);
    setCartCount(0);
    setLoginNotice('');
    setPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back from detail → products list (or home if that's where they came from)
  const handleBack = () => {
    setPage('products');
    setSelectedVoucherId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePage =
    page === 'home'
      ? 'home'
      : page === 'points'
      ? 'points'
      : page === 'cart'
      ? 'cart' 
      : page === 'profile' || page === 'edit-profile'
      ? 'profile'
      : 'products'; 

  // Admin dashboard is a standalone experience (own auth + chrome). Render it
  // whenever the URL is "#admin"
  if (adminRoute) {
    return <AdminApp />;
  }

  if (page === 'login') {
    return (
      <div className="app-shell">
        <LoginPage
          notice={loginNotice}
          onSuccess={() => {
            setUser(getCurrentUser());
            handleNavigate('home');
          }}
          onCreateAccount={() => {
            setLoginNotice('');
            setPage('signup');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (page === 'signup') {
    return (
      <div className="app-shell">
        <SignUpPage
          onSuccess={() => {
            setLoginNotice('Account created successfully. Please sign in.');
            setPage('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSignIn={() => {
            setLoginNotice('');
            setPage('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (page === 'google-verify') {
    return (
      <div className="app-shell">
        <GoogleVerifyPage
          email={googleRedirect?.email}
          onSuccess={() => {
            setUser(getCurrentUser());
            handleNavigate('home');
          }}
          onCancel={() => {
            setLoginNotice('');
            setPage('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNavBar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        user={user}
        onViewCart={() => handleNavigate('cart')}
        cartCount={cartCount}
      />

      {page === 'home' && (
        <HomePage onExplore={handleExplore} onViewAll={() => handleNavigate('products')} />
      )}

      {page === 'products' && (
        <ProductsPage onSelectProduct={handleExplore} />
      )}

      {page === 'product-detail' && (
        <ProductDetailPage
          voucherId={selectedVoucherId}
          onBack={handleBack}
          onAddToCart={handleAddToCart}
          onRedeemed={() => getMe().then(setUser).catch(() => {})}
        />
      )}

      {page === 'cart' && (
        <CartPage
          onContinueShopping={() => handleNavigate('products')}
          onCartChange={setCartCount}
        />
      )}

      {page === 'points' && (
        <PointsPage onRedeem={() => handleNavigate('products')} />
      )}

      {page === 'profile' && (
        <ProfilePage user={user} onNavigate={handleNavigate} />
      )}

      {page === 'edit-profile' && (
        <EditProfilePage
          user={user}
          onSaved={(updated) => {
            setUser(updated);
            handleNavigate('profile');
          }}
          onCancel={() => handleNavigate('profile')}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;