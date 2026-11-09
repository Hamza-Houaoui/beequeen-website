import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Play, Download, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getDirectMediaUrl, isGoogleDriveUrl, getGoogleDriveIframeUrl, getDownloadUrl, isYouTubeUrl, getYouTubeIframeUrl, isTelegramUrl, getTelegramIframeUrl } from '../utils/media';

function ProductModal({ product, onClose, userType }) {
  const { t } = useTranslation();
  const { addToCart, telegramSettings } = useAppContext();
  
  // Setup identical logic to ProductCard for state
  const isWholesale = userType === 'wholesale';
  const packSize = isWholesale ? product.sizes.join('-') : null;
  const outColors = isWholesale ? (product.outOfStockColorsWholesale || product.outOfStockColors || []) : (product.outOfStockColorsRetail || product.outOfStockColors || []);
  const availableColors = product.colors.filter(c => !outColors.includes(c));
  
  const [selectedSize, setSelectedSize] = useState(isWholesale ? packSize : product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || product.colors[0]);
  const [activeMedia, setActiveMedia] = useState('image'); // 'image' or 'video'

  const price = isWholesale ? product.wholesalePrice : product.retailPrice;
  const isOutOfStock = product.stock <= 0;
  const isPreOrder = product.isPreOrder;
  const isDiscount = product.isDiscount;

  const currentImage = product.images && product.images[selectedColor] 
    ? product.images[selectedColor] 
    : product.defaultImage;

  // Support legacy products that just have 'video' string, or new 'videos' object per color
  const currentVideo = (product.videos && product.videos[selectedColor]) 
    ? product.videos[selectedColor] 
    : product.video;

  // Gather all videos to show as thumbnails for AVAILABLE colors only
  const allVideos = availableColors.map(c => product.videos && product.videos[c]).filter(Boolean);
  if (product.video && !allVideos.includes(product.video)) {
    allVideos.push(product.video);
  }
  const uniqueVideos = [...new Set(allVideos)];

  // Gather all images to show as thumbnails for AVAILABLE colors only
  const allImages = availableColors.map(c => product.images && product.images[c]).filter(Boolean);
  if (allImages.length === 0 && product.defaultImage) {
    allImages.push(product.defaultImage);
  }
  // Deduplicate
  const uniqueImages = [...new Set(allImages)];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '900px', maxHeight: '90vh',
        backgroundColor: 'var(--surface-color)',
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        overflowY: 'auto', overflowX: 'hidden', position: 'relative'
      }}>
        
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', 
          background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px', 
          color: 'white', zIndex: 10, cursor: 'pointer' 
        }}>
          <X size={24} />
        </button>

        {/* Left Side: Media */}
        <div style={{ flex: '1 1 400px', background: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            {activeMedia === 'video' && currentVideo ? (
              isYouTubeUrl(currentVideo) ? (
                <iframe 
                  src={getYouTubeIframeUrl(currentVideo)} 
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} 
                  allow="autoplay; fullscreen"
                ></iframe>
              ) : isTelegramUrl(currentVideo) ? (
                <iframe 
                  src={getTelegramIframeUrl(currentVideo)} 
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} 
                  allow="autoplay; fullscreen"
                ></iframe>
              ) : isGoogleDriveUrl(currentVideo) ? (
                <iframe 
                  src={getGoogleDriveIframeUrl(currentVideo)} 
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} 
                  allow="autoplay; fullscreen"
                ></iframe>
              ) : (
                <video src={getDirectMediaUrl(currentVideo)} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              )
            ) : (
              <img src={getDirectMediaUrl(currentImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            
            {/* Download Button overlay */}
            <a 
              href={getDownloadUrl(activeMedia === 'video' ? currentVideo : currentImage)}
              download={activeMedia === 'video' ? `${product.name}-video.mp4` : `${product.name}-image.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute', bottom: '15px', right: '15px',
                background: 'rgba(212, 175, 55, 0.8)', color: 'black',
                padding: '12px', borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                textDecoration: 'none', zIndex: 20, transition: '0.2s'
              }}
              title={t('download') || 'Download Media'}
            >
              <Download size={24} />
            </a>
            
            {/* Badges */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
               <div style={{ 
                background: isPreOrder ? 'rgba(0,0,255,0.8)' : (isOutOfStock ? 'rgba(255,0,0,0.8)' : 'rgba(0,128,0,0.8)'),
                color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
              }}>
                {isPreOrder ? t('pre_order') : (isOutOfStock ? t('out_of_stock') : t('in_stock'))}
              </div>
              {isDiscount && (
                <div style={{ 
                  background: 'rgba(255,165,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                }}>
                  Discount
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: 'rgba(255,255,255,0.05)' }}>
            {uniqueVideos.map((vid, idx) => {
              const matchedColor = Object.keys(product.videos || {}).find(k => product.videos[k] === vid);
              return (
                <div 
                  key={`vid-${idx}`}
                  onClick={() => {
                    setActiveMedia('video');
                    if (matchedColor && availableColors.includes(matchedColor)) {
                      setSelectedColor(matchedColor);
                    }
                  }}
                  style={{ 
                    width: '60px', height: '60px', flexShrink: 0, 
                    border: (activeMedia === 'video' && currentVideo === vid) ? '2px solid var(--accent-color)' : '2px solid transparent',
                    borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    background: '#222', cursor: 'pointer', transition: '0.2s', position: 'relative'
                  }}>
                  <Play size={20} color="white" />
                  <span style={{ fontSize: '9px', color: '#ccc', marginTop: '2px', maxWidth: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {matchedColor || 'Video'}
                  </span>
                </div>
              );
            })}
            {uniqueImages.map((img, idx) => (
              <img 
                key={`img-${idx}`} 
                src={getDirectMediaUrl(img)} 
                alt="thumb" 
                onClick={() => {
                  setActiveMedia('image');
                  const matchedColor = Object.keys(product.images || {}).find(k => product.images[k] === img);
                  if(matchedColor && availableColors.includes(matchedColor)) {
                    setSelectedColor(matchedColor);
                  }
                }}
                style={{ 
                  width: '60px', height: '60px', objectFit: 'cover', flexShrink: 0,
                  border: (activeMedia === 'image' && currentImage === img) ? '2px solid var(--accent-color)' : '2px solid transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: '0.2s'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div style={{ flex: '1 1 400px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '90vh' }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{product.name}</h2>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>${price.toFixed(2)}</span>
          </div>

          {product.description && (
            <div style={{ opacity: 0.8, lineHeight: '1.6', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              {product.description}
            </div>
          )}

          <div>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{t('size')}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {isWholesale ? (
                 <button 
                  style={{
                    padding: '8px 15px', background: 'var(--accent-color)', color: '#000',
                    border: '1px solid var(--accent-color)', borderRadius: '6px', fontWeight: 'bold'
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
                        padding: '8px 15px',
                        background: selectedSize === size ? 'var(--accent-color)' : 'transparent',
                        color: selectedSize === size ? '#000' : 'inherit',
                        border: '1px solid var(--accent-color)', borderRadius: '6px',
                        fontWeight: selectedSize === size ? 'bold' : 'normal',
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
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{t('colors')}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.colors.map(color => {
                const isColorOut = outColors.includes(color);
                return (
                  <button 
                    key={color}
                    onClick={() => {
                      if (!isColorOut) {
                        setSelectedColor(color);
                        setActiveMedia('image');
                      }
                    }}
                    disabled={isColorOut}
                    style={{
                      padding: '8px 15px',
                      background: selectedColor === color ? 'var(--text-color)' : 'transparent',
                      color: selectedColor === color ? 'var(--bg-color)' : 'inherit',
                      border: '1px solid var(--text-color)', borderRadius: '6px',
                      fontWeight: selectedColor === color ? 'bold' : 'normal',
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
                onClose();
              }
            }}
            style={{ 
              marginTop: 'auto', width: '100%', padding: '15px', 
              fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', 
              background: (!isPreOrder && isOutOfStock) ? 'rgba(37, 211, 102, 0.2)' : 'var(--accent-color)',
              color: (!isPreOrder && isOutOfStock) ? '#25D366' : '#000',
              border: (!isPreOrder && isOutOfStock) ? '1px solid #25D366' : 'none',
              cursor: 'pointer', borderRadius: '8px'
            }}>
            {isPreOrder ? t('pre_order') : (isOutOfStock ? t('ask_whatsapp', { defaultValue: 'Out of Stock, Need Help?' }) : t('add_to_cart'))}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
