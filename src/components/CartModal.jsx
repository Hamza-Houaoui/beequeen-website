import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Send, Download, MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getDirectMediaUrl } from '../utils/media';

function CartModal({ onClose }) {
  const { t } = useTranslation();
  const { cart, removeFromCart, userType, clearCart, telegramSettings } = useAppContext();
  const [isSending, setIsSending] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = userType === 'retail' ? item.retailPrice : item.wholesalePrice;
      return total + (price * item.quantity);
    }, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Beequeen - Proforma Invoice", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`User Type: ${userType.toUpperCase()}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    const tableColumn = ["Product", "Size", "Color", "Price", "Qty", "Total"];
    const tableRows = [];

    cart.forEach(item => {
      const price = userType === 'retail' ? item.retailPrice : item.wholesalePrice;
      const itemData = [
        item.name,
        item.selectedSize,
        item.selectedColor,
        `$${price}`,
        item.quantity,
        `$${price * item.quantity}`
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [212, 175, 55] }
    });

    const finalY = doc.lastAutoTable?.finalY || 50;
    doc.setFontSize(14);
    doc.text(`Total: $${calculateTotal()}`, 14, finalY + 15);

    doc.save("beequeen-invoice.pdf");
    // Return base64 for telegram sending
    return doc.output('datauristring');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSending(true);

    try {
      // 1. Generate PDF
      const pdfBase64 = generatePDF();

      // 2. Prepare Order Message for Telegram
      let message = `🛒 *New Order from Beequeen* (${userType})\n\n`;
      cart.forEach((item, index) => {
        const price = userType === 'retail' ? item.retailPrice : item.wholesalePrice;
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Size: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
        message += `   Qty: ${item.quantity} | Price: $${price}\n\n`;
      });
      message += `💰 *Total: $${calculateTotal()}*`;

      const botToken = telegramSettings?.token; 
      const chatId = telegramSettings?.chatId;

      if (botToken && chatId) {
        // Send message
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });

        // Send PDF document
        const pdfBlob = await (await fetch(pdfBase64)).blob();
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('document', pdfBlob, `Order_${Date.now()}.pdf`);

        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: formData
        });

        alert(t('order_sent') || "Order Sent Successfully!");
        clearCart();
        onClose();
      } else {
        console.log("Message that would be sent to Telegram:\n", message);
        alert("PDF Generated! (Telegram integration is pending Token & Chat ID in Admin Dashboard)");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending order.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'flex-end',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '400px',
        height: '100%',
        borderRadius: '16px 0 0 16px',
        display: 'flex', flexDirection: 'column',
        padding: '20px',
        background: 'rgba(10, 10, 10, 0.3)',
        backdropFilter: 'blur(35px)',
        WebkitBackdropFilter: 'blur(35px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.1), -10px 0 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{t('cart')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', padding: '5px' }}>
            <X size={24} style={{ color: 'var(--text-color)' }} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>{t('empty_cart')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map((item, index) => {
                const price = userType === 'retail' ? item.retailPrice : item.wholesalePrice;
                return (
                  <div key={index} style={{ 
                    display: 'flex', gap: '15px', padding: '10px', 
                    background: 'rgba(255,255,255,0.05)', borderRadius: '8px' 
                  }}>
                    <img src={getDirectMediaUrl(item.image || item.defaultImage)} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
                        {item.selectedSize} | {item.selectedColor} | Qty: {item.quantity}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: 'var(--accent-color)' }}>${price * item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} style={{ background: 'transparent', color: '#ff4444', padding: '5px', height: 'fit-content' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>{t('total')}:</span>
              <span className="text-gold">${calculateTotal()}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleCheckout} 
                disabled={isSending}
                style={{ width: '100%', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {isSending ? '...' : (
                  <>
                    <Download size={18} />
                    PDF
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  if (cart.length === 0) return;
                  if (!telegramSettings?.whatsapp) {
                    alert("WhatsApp number is not configured in Admin Dashboard.");
                    return;
                  }
                  
                  let message = `🛒 *New Order from Beequeen* (${userType})\n\n`;
                  cart.forEach((item, index) => {
                    const price = userType === 'retail' ? item.retailPrice : item.wholesalePrice;
                    message += `${index + 1}. *${item.name}*\n`;
                    message += `   Size: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
                    message += `   Qty: ${item.quantity} | Price: $${price}\n\n`;
                  });
                  message += `💰 *Total: $${calculateTotal()}*`;

                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${telegramSettings.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`;
                  
                  window.open(whatsappUrl, '_blank');
                  clearCart();
                  onClose();
                }}
                disabled={isSending}
                style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}
              >
                <MessageCircle size={22} color="#25D366" />
                Make Order from WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
