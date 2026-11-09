import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import ContactButtons from './components/ContactButtons';
import AdminDashboard from './components/AdminDashboard';

function StoreFront() {
  const { t } = useTranslation();
  const { isCartAnimating } = useAppContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlayingLogo, setIsPlayingLogo] = useState(true);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (isCartAnimating) {
      setIsPlayingLogo(true);
    }
  }, [isCartAnimating]);

  return (
    <>
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div style={{ 
          textAlign: 'center', 
          margin: '0 auto -40px', /* Pulls the products up */
          maxWidth: '900px', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 0,
          minHeight: '250px'
        }}>
          <video 
            ref={videoRef}
            src="/logo_anime.mp4" 
            autoPlay 
            muted 
            playsInline
            onEnded={() => setIsPlayingLogo(false)}
            style={{ 
              width: '100%', 
              maxWidth: '600px',
              pointerEvents: 'none',
              position: 'absolute',
              opacity: isPlayingLogo ? 1 : 0,
              transition: 'opacity 0.8s ease',
              zIndex: 1
            }} 
          />
          <img 
            src="/beequeen.png" 
            alt="Beequeen Logo" 
            style={{ 
              width: '100%', 
              maxWidth: '300px', 
              objectFit: 'contain',
              opacity: isPlayingLogo ? 0 : 1,
              transition: 'opacity 0.8s ease',
              position: 'relative',
              zIndex: 2
            }} 
          />
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <ProductList />
        </div>
      </main>

      <ContactButtons />

      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
