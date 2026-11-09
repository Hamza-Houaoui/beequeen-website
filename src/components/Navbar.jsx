import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Moon, Sun, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function Navbar({ onOpenCart }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, cart, userType, setUserType, isCartAnimating, isRetailEnabled } = useAppContext();
  
  const [isLanguageAnimating, setIsLanguageAnimating] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLanguageAnimating(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const getFlag = (lang) => {
    switch (lang) {
      case 'en': return '🇬🇧';
      case 'fr': return '🇫🇷';
      case 'tr': return '🇹🇷';
      case 'es': return '🇪🇸';
      case 'pt': return '🇵🇹';
      case 'ha': 
      case 'yo': 
      case 'ig': 
      case 'pcm': return '🇳🇬';
      default: return '🌍';
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 100,
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
    }} className="glass-panel">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src="/Q.png" alt="Beequeen Logo" className="logo-glow" style={{ height: '40px' }} />
        
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '4px' }}>
          {isRetailEnabled && (
            <button 
              onClick={() => setUserType('retail')}
              style={{ 
                padding: '6px 12px', 
                background: userType === 'retail' ? 'var(--accent-color)' : 'transparent',
                color: userType === 'retail' ? '#000' : 'inherit',
                borderRadius: '6px'
              }}>
              {t('retail')}
            </button>
          )}
          <button 
            onClick={() => setUserType('wholesale')}
            style={{ 
              padding: '6px 12px', 
              background: userType === 'wholesale' ? 'var(--accent-color)' : 'transparent',
              color: userType === 'wholesale' ? '#000' : 'inherit',
              borderRadius: '6px'
            }}>
            {t('wholesale')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div 
          className={isLanguageAnimating ? "cart-animating" : ""} 
          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px', borderRadius: '6px' }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{getFlag(i18n.language)}</span>
          <select 
            onChange={changeLanguage} 
            value={i18n.language}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--text-color)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'uppercase'
            }}
          >
            <option value="en" style={{color: '#000'}}>EN</option>
            <option value="fr" style={{color: '#000'}}>FR</option>
            <option value="tr" style={{color: '#000'}}>TR</option>
            <option value="es" style={{color: '#000'}}>ES</option>
            <option value="pt" style={{color: '#000'}}>PT</option>
            <option value="ha" style={{color: '#000'}}>HA</option>
            <option value="yo" style={{color: '#000'}}>YO</option>
            <option value="ig" style={{color: '#000'}}>IG</option>
            <option value="pcm" style={{color: '#000'}}>PCM</option>
          </select>
        </div>

        <button onClick={toggleTheme} style={{ background: 'transparent', color: 'inherit', padding: '8px' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={onOpenCart}
            className={cart.length > 0 || isCartAnimating ? "cart-animating" : ""}
            style={{ 
              position: 'relative', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '5px',
              borderRadius: '50%',
              transition: '0.3s'
            }}
          >
            <ShoppingCart size={24} style={{ color: 'var(--text-color)' }} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--accent-color)',
                color: 'black',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </button>
          {isCartAnimating && (
            <div className="cart-tooltip">
              👇 Click here to order!
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
