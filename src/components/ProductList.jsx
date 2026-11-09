import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { Play } from 'lucide-react';
import ProductModal from './ProductModal';
import { getDirectMediaUrl } from '../utils/media';

function ProductList() {
  const { t } = useTranslation();
  const { userType, addToCart, products } = useAppContext();
  const [selectedModalProduct, setSelectedModalProduct] = useState(null);

  // Filter products by targetMarket
  const filteredProducts = products.filter(product => {
    if (!product.targetMarket || product.targetMarket === 'both') return true;
    return product.targetMarket === userType;
  });

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '20px'
      }}>
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            index={index}
            product={product} 
            t={t} 
            userType={userType} 
            addToCart={addToCart} 
            onOpenModal={() => setSelectedModalProduct(product)}
          />
        ))}
      </div>
      
      {selectedModalProduct && (
        <ProductModal 
          product={selectedModalProduct} 
          onClose={() => setSelectedModalProduct(null)} 
          userType={userType} 
        />
      )}
    </>
  );
}

function ProductCard({ product, t, userType, addToCart, onOpenModal, index = 0 }) {
  const { telegramSettings } = useAppContext();
  // If wholesale, the pack is the entire sizes array joined together
  const isWholesale = userType === 'wholesale';
  const packSize = isWholesale ? product.sizes.join('-') : null;
  const outColors = isWholesale ? (product.outOfStockColorsWholesale || product.outOfStockColors || []) : (product.outOfStockColorsRetail || product.outOfStockColors || []);
  const availableColors = product.colors.filter(c => !outColors.includes(c));
  
  const [selectedSize, setSelectedSize] = useState(isWholesale ? packSize : product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || product.colors[0]);

  // Update selected size if userType changes
  React.useEffect(() => {
    setSelectedSize(isWholesale ? product.sizes.join('-') : product.sizes[0]);
  }, [isWholesale, product.sizes]);

  const price = isWholesale ? product.wholesalePrice : product.retailPrice;
  const isDiscount = product.isDiscount;
  const isOutOfStock = product.stock <= 0;
  const isPreOrder = product.isPreOrder;

  const currentImage = product.images && product.images[selectedColor] 
    ? product.images[selectedColor] 
    : product.defaultImage;

  return (
    <div className="glass-panel fade-in-up" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${index * 0.1}s` }}>
      <div 
        style={{ position: 'relative', height: '400px', cursor: 'pointer' }}
        onClick={onOpenModal}
      >
        <img src={getDirectMediaUrl(currentImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }} />
        {product.video && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '15px', color: 'white' }}>
            <Play size={30} />
          </div>
        )}
        <div style={{ 
          position: 'absolute', 
          top: '10px', left: '10px', 
          background: isPreOrder ? 'rgba(0,0,255,0.8)' : (isOutOfStock ? 'rgba(255,0,0,0.8)' : 'rgba(0,128,0,0.8)'),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {isPreOrder ? t('pre_order') : (isOutOfStock ? t('out_of_stock') : t('in_stock'))}
        </div>
        {isDiscount && (
          <div style={{ 
            position: 'absolute', 
            top: '40px', left: '10px', 
            background: 'rgba(255,165,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Discount
          </div>
        )}
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h3>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>${price.toFixed(2)}</span>
        </div>

        <div>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', opacity: 0.8 }}>{t('size')}</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {isWholesale ? (
               <button 
                style={{
                  padding: '5px 10px',
                  background: 'var(--accent-color)',
                  color: '#000',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                Pack: {packSize}
              </button>
            ) : (
              product.sizes.map(size => {
                const isSizeOut = (product.outOfStockSizes || []).includes(size);
                return (
                  <button 
                    key={size}
                    onClick={() => !isSizeOut && setSelectedSize(size)}
                    disabled={isSizeOut}
                    style={{
                      padding: '5px 10px',
                      background: selectedSize === size ? 'var(--accent-color)' : 'transparent',
                      color: selectedSize === size ? '#000' : 'inherit',
                      border: '1px solid var(--accent-color)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      opacity: isSizeOut ? 0.3 : 1,
                      textDecoration: isSizeOut ? 'line-through' : 'none',
                      cursor: isSizeOut ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {size}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', opacity: 0.8 }}>{t('colors')}</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {product.colors.map(color => {
              const isColorOut = outColors.includes(color);
              return (
                <button 
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isColorOut) setSelectedColor(color);
                  }}
                  disabled={isColorOut}
                  style={{
                    padding: '5px 10px',
                    background: selectedColor === color ? 'var(--text-color)' : 'transparent',
                    color: selectedColor === color ? 'var(--bg-color)' : 'inherit',
                    border: '1px solid var(--text-color)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    opacity: isColorOut ? 0.3 : 1,
                    textDecoration: isColorOut ? 'line-through' : 'none',
                    cursor: isColorOut ? 'not-allowed' : 'pointer'
                  }}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => {
            if (!isPreOrder && isOutOfStock) {
              if (!telegramSettings?.whatsapp) {
                alert("WhatsApp number is not configured in Admin Dashboard.");
                return;
              }
              const msg = t('whatsapp_out_of_stock_msg', { 
                defaultValue: `Hello, when will the model "${product.name}" be available again?`,
                model: product.name 
              });
              const encodedMessage = encodeURIComponent(msg);
              const whatsappUrl = `https://wa.me/${telegramSettings.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`;
              window.open(whatsappUrl, '_blank');
            } else {
              addToCart({ ...product, retailPrice: price, wholesalePrice: price, image: currentImage }, 1, selectedSize, selectedColor);
            }
          }}
          style={{ 
            marginTop: 'auto', width: '100%', padding: '12px', 
            fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', 
            background: (!isPreOrder && isOutOfStock) ? 'rgba(37, 211, 102, 0.2)' : 'transparent',
            color: (!isPreOrder && isOutOfStock) ? '#25D366' : 'inherit',
            border: (!isPreOrder && isOutOfStock) ? '1px solid #25D366' : '1px solid var(--text-color)',
            cursor: 'pointer', borderRadius: '6px'
          }}>
          {isPreOrder ? t('pre_order') : (isOutOfStock ? t('ask_whatsapp', { defaultValue: 'Out of Stock, Need Help?' }) : t('add_to_cart'))}
        </button>
      </div>
    </div>
  );
}

export default ProductList;
