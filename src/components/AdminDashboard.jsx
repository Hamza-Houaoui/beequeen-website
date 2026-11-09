import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Save, X } from 'lucide-react';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { products, setProducts, telegramSettings, setTelegramSettings, isRetailEnabled, setIsRetailEnabled } = useAppContext();

  // Temporary edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { // Admin password
      setIsAuthenticated(true);
    } else {
      alert("Wrong password!");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm(JSON.parse(JSON.stringify(product))); // Deep copy
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    setProducts(prev => prev.map(p => p.id === editForm.id ? editForm : p));
    setEditingId(null);
    setEditForm(null);
  };

  const deleteProduct = (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const addNewProduct = () => {
    const newProd = {
      id: Date.now(),
      name: "New Product",
      retailPrice: 0,
      wholesalePrice: 0,
      sizes: ["44", "46"],
      colors: ["Black"],
      stock: 10,
      images: {
        "Black": "https://via.placeholder.com/500"
      },
      defaultImage: "https://via.placeholder.com/500",
      video: null
    };
    setProducts(prev => [...prev, newProd]);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Enter password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--accent-color)', background: 'transparent', color: 'inherit' }}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={addNewProduct} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Plus size={20} /> Add Product</button>
      </div>

      <div className="glass-panel" style={{ padding: '25px', marginBottom: '40px', borderTop: '4px solid var(--accent-color)' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>⚙️ Integrations & Contact Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#aaa' }}>Telegram Bot Token</label>
            <input 
              value={telegramSettings.token} 
              onChange={(e) => setTelegramSettings({...telegramSettings, token: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
              placeholder="e.g. 123456789:ABCdef..."
            />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#aaa' }}>Telegram Chat ID</label>
            <input 
              value={telegramSettings.chatId} 
              onChange={(e) => setTelegramSettings({...telegramSettings, chatId: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
              placeholder="e.g. -100123456789"
            />
          </div>
          <div style={{ background: 'rgba(0,136,204,0.1)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,136,204,0.3)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#0088cc', fontWeight: 'bold' }}>Telegram Username (For Customer Chat)</label>
            <input 
              value={telegramSettings.telegramUsername || ''} 
              onChange={(e) => setTelegramSettings({...telegramSettings, telegramUsername: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
              placeholder="e.g. BeequeenSupport"
            />
          </div>
          <div style={{ background: 'rgba(37,211,102,0.1)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(37,211,102,0.3)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#25D366', fontWeight: 'bold' }}>WhatsApp Number</label>
            <input 
              value={telegramSettings.whatsapp || ''} 
              onChange={(e) => setTelegramSettings({...telegramSettings, whatsapp: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
              placeholder="Country code + number (e.g. 21622334455)"
            />
          </div>
        </div>
        <p style={{ margin: '15px 0 0 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>* Settings are automatically saved locally. Telegram will send order PDFs, WhatsApp will open a direct chat.</p>
      </div>

      <div className="glass-panel" style={{ padding: '25px', marginBottom: '40px', borderTop: '4px solid var(--accent-color)' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>🏪 Store Settings</h3>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: 'var(--text-color)' }}>Retail Mode</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa' }}>
              Turn off to temporarily hide the Retail button from the website (e.g. for inventory counting).
            </p>
          </div>
          
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '60px',
            height: '34px'
          }}>
            <input 
              type="checkbox" 
              checked={isRetailEnabled}
              onChange={(e) => setIsRetailEnabled(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: isRetailEnabled ? '#25D366' : '#ff4444',
              transition: '.4s', borderRadius: '34px',
              display: 'flex', alignItems: 'center', padding: '0 5px',
              justifyContent: isRetailEnabled ? 'flex-start' : 'flex-end',
              color: 'white', fontWeight: 'bold', fontSize: '0.7rem'
            }}>
              <span style={{
                position: 'absolute', height: '26px', width: '26px',
                left: isRetailEnabled ? '30px' : '4px',
                bottom: '4px', backgroundColor: 'white',
                transition: '.4s', borderRadius: '50%'
              }}></span>
              {isRetailEnabled ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {products.map(product => {
          if (editingId === product.id) {
            // Edit Mode
            return (
              <div key={product.id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px', border: '1px solid var(--accent-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: 'var(--accent-color)' }}>✏️ Editing Product</h2>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={cancelEdit} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '5px' }}><X size={18} /> Cancel</button>
                    <button onClick={saveEdit} style={{ background: '#25D366', color: '#fff', padding: '8px 15px', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}><Save size={18} /> Save Changes</button>
                  </div>
                </div>

                {/* 1. Basic Information */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#aaa' }}>1. Basic Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Product Name</label>
                      <input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Retail Price ($)</label>
                      <input 
                        type="number"
                        value={editForm.retailPrice} 
                        onChange={(e) => setEditForm({...editForm, retailPrice: Number(e.target.value)})}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Wholesale Price ($)</label>
                      <input 
                        type="number"
                        value={editForm.wholesalePrice} 
                        onChange={(e) => setEditForm({...editForm, wholesalePrice: Number(e.target.value)})}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Total Stock</label>
                      <input 
                        type="number"
                        value={editForm.stock} 
                        onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Target Market</label>
                      <select 
                        value={editForm.targetMarket || 'both'} 
                        onChange={(e) => setEditForm({...editForm, targetMarket: e.target.value})}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      >
                        <option value="both" style={{ color: 'black' }}>Both</option>
                        <option value="retail" style={{ color: 'black' }}>Retail Only</option>
                        <option value="wholesale" style={{ color: 'black' }}>Wholesale Only</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '30px', marginTop: '20px', padding: '15px', background: 'rgba(212,175,55,0.05)', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={editForm.isDiscount || false} 
                        onChange={(e) => setEditForm({...editForm, isDiscount: e.target.checked})}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span style={{ fontWeight: 'bold' }}>Active Discount Tag</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={editForm.isPreOrder || false} 
                        onChange={(e) => setEditForm({...editForm, isPreOrder: e.target.checked})}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span style={{ fontWeight: 'bold' }}>Pre-order Mode</span>
                    </label>
                  </div>
                </div>

                {/* 2. Details & Sizes */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#aaa' }}>2. Details & Sizes</h4>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Description</label>
                    <textarea 
                      value={editForm.description || ''} 
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      style={{ width: '100%', height: '100px', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px' }}
                      placeholder="Enter a compelling product description..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Sizes (comma separated)</label>
                    <input 
                      value={editForm.sizes.join(', ')} 
                      onChange={(e) => setEditForm({...editForm, sizes: e.target.value.split(',').map(s=>s.trim())})}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '6px', marginBottom: '15px' }}
                      placeholder="e.g. 44, 46, 48, 50"
                    />
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--accent-color)' }}>Toggle Retail Size Availability:</p>
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {editForm.sizes.filter(Boolean).map(size => {
                          const isAvailable = !(editForm.outOfStockSizes || []).includes(size);
                          return (
                            <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: isAvailable ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255, 68, 68, 0.2)', padding: '5px 10px', borderRadius: '4px', border: `1px solid ${isAvailable ? '#25D366' : '#ff4444'}` }}>
                              <input 
                                type="checkbox" 
                                checked={isAvailable}
                                onChange={(e) => {
                                  const newOut = new Set(editForm.outOfStockSizes || []);
                                  if (e.target.checked) newOut.delete(size);
                                  else newOut.add(size);
                                  setEditForm({...editForm, outOfStockSizes: Array.from(newOut)});
                                }}
                                style={{ display: 'none' }}
                              />
                              <span style={{ textDecoration: isAvailable ? 'none' : 'line-through' }}>{size}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Media & Colors */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#aaa' }}>3. Media & Colors <span style={{fontSize: '0.8rem', color: 'var(--accent-color)'}}>(Paste Google Drive Links 🔗)</span></h4>
                    <button 
                      onClick={() => {
                        const newColor = prompt("Enter new color name:");
                        if (newColor && !editForm.images[newColor]) {
                          setEditForm({
                            ...editForm,
                            colors: [...editForm.colors, newColor],
                            images: { ...editForm.images, [newColor]: "" }
                          });
                        }
                      }}
                      style={{ padding: '6px 12px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Plus size={16} /> Add Color
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {editForm.colors.map(color => {
                      const isAvailableRetail = !(editForm.outOfStockColorsRetail || editForm.outOfStockColors || []).includes(color);
                      const isAvailableWholesale = !(editForm.outOfStockColorsWholesale || editForm.outOfStockColors || []).includes(color);
                      return (
                        <div key={color} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
                          <div style={{ width: '120px', fontSize: '1.1rem', fontWeight: 'bold' }}>{color}</div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input 
                                type="checkbox" 
                                checked={isAvailableRetail}
                                onChange={(e) => {
                                  const newOut = new Set(editForm.outOfStockColorsRetail || editForm.outOfStockColors || []);
                                  if (e.target.checked) newOut.delete(color);
                                  else newOut.add(color);
                                  setEditForm({...editForm, outOfStockColorsRetail: Array.from(newOut)});
                                }}
                              />
                              Available (Retail)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input 
                                type="checkbox" 
                                checked={isAvailableWholesale}
                                onChange={(e) => {
                                  const newOut = new Set(editForm.outOfStockColorsWholesale || editForm.outOfStockColors || []);
                                  if (e.target.checked) newOut.delete(color);
                                  else newOut.add(color);
                                  setEditForm({...editForm, outOfStockColorsWholesale: Array.from(newOut)});
                                }}
                              />
                              Available (Wholesale)
                            </label>
                          </div>

                          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7, width: '60px' }}>🖼️ Image URL</span>
                              <input 
                                placeholder="Paste Google Drive Link here..."
                                value={editForm.images[color] && editForm.images[color].startsWith('data:') ? 'Local Image Selected' : (editForm.images[color] || '')}
                                onChange={(e) => {
                                  const newImages = { ...editForm.images, [color]: e.target.value };
                                  setEditForm({ ...editForm, images: newImages, defaultImage: Object.values(newImages)[0] });
                                }}
                                style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '4px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7, width: '60px' }}>Or Local</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newImages = { ...editForm.images, [color]: reader.result };
                                      setEditForm({ ...editForm, images: newImages, defaultImage: Object.values(newImages)[0] });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ flex: 1, fontSize: '0.8rem' }}
                              />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '5px 0' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7, width: '60px' }}>🎥 Video URL</span>
                              <input 
                                placeholder="YouTube / Telegram / Drive..."
                                value={(editForm.videos && editForm.videos[color]) ? (editForm.videos[color].startsWith('data:') ? 'Local Video Selected' : editForm.videos[color]) : ''}
                                onChange={(e) => {
                                  const newVideos = { ...(editForm.videos || {}), [color]: e.target.value };
                                  setEditForm({ ...editForm, videos: newVideos });
                                }}
                                style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #444', borderRadius: '4px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7, width: '60px' }}>Or Local</span>
                              <input 
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if(file.size > 2 * 1024 * 1024) {
                                       alert("Video is too large for local storage. Please keep it under 2MB or use a URL.");
                                       return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newVideos = { ...(editForm.videos || {}), [color]: reader.result };
                                      setEditForm({ ...editForm, videos: newVideos });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ flex: 1, fontSize: '0.8rem' }}
                              />
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              if(window.confirm("Remove color?")) {
                                const newColors = editForm.colors.filter(c => c !== color);
                                const newImages = { ...editForm.images };
                                delete newImages[color];
                                const newVideos = { ...(editForm.videos || {}) };
                                delete newVideos[color];
                                setEditForm({ ...editForm, colors: newColors, images: newImages, videos: newVideos, defaultImage: Object.values(newImages)[0] || "" });
                              }
                            }}
                            style={{ background: 'transparent', border: '1px solid #ff4444', padding: '8px', color: '#ff4444', borderRadius: '6px' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          }

          // View Mode
          return (
            <div key={product.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src={product.defaultImage} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', opacity: 0.8 }}>
                    <span>Retail: ${product.retailPrice}</span>
                    <span>Wholesale: ${product.wholesalePrice}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>
                    <span>Sizes: {product.sizes.join(', ')}</span>
                    <span>Colors: {product.colors.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => startEdit(product)} style={{ padding: '8px 15px' }}>Edit</button>
                <button onClick={() => deleteProduct(product.id)} style={{ padding: '8px', background: '#ff4444', color: 'white' }}><Trash2 size={20} /></button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
         <a href="/" style={{ color: 'var(--accent-color)' }}>← Back to Store</a>
      </div>
    </div>
  );
}

export default AdminDashboard;
