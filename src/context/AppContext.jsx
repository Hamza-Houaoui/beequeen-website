import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default Mock Products
const defaultProducts = [
  {
    id: 1,
    name: "Royal Gold Dress (Wholesale Only)",
    description: "A stunning royal gold dress made with premium fabric, perfect for special occasions. Features elegant embroidery and a comfortable fit.",
    retailPrice: 0,
    wholesalePrice: 100,
    isDiscount: true,
    isPreOrder: false,
    targetMarket: 'wholesale', // 'both', 'retail', 'wholesale'
    sizes: ["44", "46", "48", "50"],
    outOfStockSizes: [],
    colors: ["Black", "Gold", "White"],
    outOfStockColorsRetail: [],
    outOfStockColorsWholesale: [],
    stock: 50,
    images: {
      "Black": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
      "Gold": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80",
      "White": "https://images.unsplash.com/photo-1515347619362-672ce3468fb7?w=500&q=80"
    },
    defaultImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    video: null
  },
  {
    id: 2,
    name: "Queen Elegance Suit (Retail Only)",
    description: "Experience the ultimate elegance with our Queen Suit. Designed for the modern woman who values both style and professionalism.",
    retailPrice: 200,
    wholesalePrice: 0,
    isDiscount: false,
    isPreOrder: true,
    targetMarket: 'retail',
    sizes: ["50", "52", "54", "56"],
    outOfStockSizes: ["52"], // Example: 52 is out of stock
    colors: ["Navy", "Red"],
    outOfStockColorsRetail: ["Red"], // Example: Red is out of stock in retail
    outOfStockColorsWholesale: [], 
    stock: 0, 
    images: {
      "Navy": "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500&q=80",
      "Red": "https://images.unsplash.com/photo-1572804013309-8c98c10f8450?w=500&q=80"
    },
    defaultImage: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500&q=80"
  }
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [cart, setCart] = useState([]);
  const [userType, setUserType] = useState('wholesale'); // 'retail' or 'wholesale'
  const [telegramSettings, setTelegramSettings] = useState(() => {
    const saved = localStorage.getItem('beequeen_telegram');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { token: parsed.token || '', chatId: parsed.chatId || '', whatsapp: parsed.whatsapp || '' };
    }
    return { token: '', chatId: '', whatsapp: '' };
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('beequeen_products');
    if (saved) return JSON.parse(saved);
    return defaultProducts;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('beequeen_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('beequeen_telegram', JSON.stringify(telegramSettings));
  }, [telegramSettings]);

  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isRetailEnabled, setIsRetailEnabled] = useState(() => {
    const saved = localStorage.getItem('beequeen_retail_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('beequeen_retail_enabled', JSON.stringify(isRetailEnabled));
    // If retail is disabled and user is currently on retail, switch them to wholesale
    if (!isRetailEnabled && userType === 'retail') {
      setUserType('wholesale');
    }
  }, [isRetailEnabled, userType]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToCart = (product, quantity, selectedSize, selectedColor) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, selectedSize, selectedColor }];
    });
    
    // Trigger animation
    setIsCartAnimating(true);
    setTimeout(() => {
      setIsCartAnimating(false);
    }, 3000);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      cart, addToCart, removeFromCart, clearCart,
      userType, setUserType,
      products, setProducts,
      telegramSettings, setTelegramSettings,
      isCartAnimating,
      isRetailEnabled, setIsRetailEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
