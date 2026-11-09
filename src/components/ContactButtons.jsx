import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function ContactButtons() {
  const { t } = useTranslation();
  const { telegramSettings } = useAppContext();

  const whatsappNumber = telegramSettings?.whatsapp;
  const telegramUsername = telegramSettings?.telegramUsername;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 90
    }}>
      {whatsappNumber && (
        <a 
          href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#25D366',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          title={t('whatsapp')}
        >
          <MessageCircle size={32} />
        </a>
      )}
      
      {telegramUsername && (
        <a 
          href={`https://t.me/${telegramUsername.replace('@', '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#0088cc',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 136, 204, 0.4)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          title={t('telegram')}
        >
          <Send size={30} />
        </a>
      )}
    </div>
  );
}

export default ContactButtons;
