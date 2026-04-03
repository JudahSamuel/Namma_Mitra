'use client';
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, X, Check, ArrowLeft, Minus, Plus, Loader2, Clock, AlertCircle } from 'lucide-react';

const PRODUCTS = [
    // --- ACADEMIC BOOKS ---
    { 
      id: 'lab_record', 
      name: "BIT Lab Record", 
      basePrice: 50, 
      image: "📒", 
      type: 'book',
      hasPriceVariants: true, 
      hasStream: true,
      description: "Official Lab Record"
    },
    { 
      id: 'bit_notebook', 
      name: "BIT Notebook", 
      basePrice: 30, 
      image: "📓", 
      type: 'book',
      hasTypeVariants: true,
      variantOptions: ['Ruled', 'Unruled'],
      description: "Standard College Notebook"
    },
    { 
      id: 'pink_book', 
      name: "Pink Book", 
      basePrice: 10, 
      image: "📕", 
      type: 'book',
      hasStream: true,
      description: "For Assignments"
    },
    { 
      id: 'blue_book', 
      name: "Blue Book", 
      basePrice: 12, 
      image: "📘", 
      type: 'book',
      hasStream: true,
      description: "For Internals"
    },
    
    // --- STATIONERY ESSENTIALS ---
    { 
      id: 'pen', 
      name: "Ball Pen", 
      basePrice: 10, 
      image: "🖊️", 
      type: 'stationery',
      hasColorVariants: true,
      variantOptions: ['Blue', 'Black', 'Red'],
      description: "Smooth writing ball pen"
    },
    { id: 'data_sheet', name: "Data Sheets", basePrice: 2, image: "📄", type: 'stationery', description: "A4 Size (Per Sheet)" },
    { id: 'cello_tape', name: "Cellophane Tape", basePrice: 20, image: "🩹", type: 'stationery', description: "Transparent Tape" },
    { id: 'double_tape', name: "Double Side Tape", basePrice: 35, image: "🎞️", type: 'stationery', description: "Strong Adhesive" },
    { id: 'stapler', name: "Stapler", basePrice: 50, image: "📎", type: 'stationery', description: "Standard Size" },
    { id: 'stapler_pins', name: "Stapler Pins", basePrice: 10, image: "🔩", type: 'stationery', description: "Box of pins" },
    { id: 'fevicol', name: "Fevicol (Small)", basePrice: 10, image: "🧴", type: 'stationery', description: "Adhesive Glue" },

    // --- CUSTOM REQUEST ---
    { 
      id: 'others', 
      name: "Others / Request", 
      basePrice: 0, 
      image: "✨", 
      type: 'custom',
      isCustom: true,
      description: "Need something else?" 
    }
];

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxUS5VtmFdpgOheTM2Ghozl_JCE0c5nNVoHamJRnaQ0lHLytvwlTe835VEtR6O2sw/exec'; 

const Store = ({ onAddToCart, onOpenCart, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- INVENTORY STATE ---
  const [inventory, setInventory] = useState({}); 
  const [loadingInventory, setLoadingInventory] = useState(true);

  // --- MODAL STATE ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stream, setStream] = useState('vtu'); 
  const [variantPrice, setVariantPrice] = useState(null); 
  const [selectedVariant, setSelectedVariant] = useState(null); 
  
  // Request States
  const [customItemName, setCustomItemName] = useState('');
  const [requestPhone, setRequestPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // --- 1. FETCH INVENTORY ON LOAD ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${GOOGLE_SHEET_URL}?action=getInventory`);
        const json = await res.json();
        if (json.status === 'success') {
          setInventory(json.data);
        }
      } catch (err) {
        console.error("Inventory fetch failed", err);
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, []);

  // --- SUBMIT CUSTOM REQUEST ---
  const handleCustomRequest = async () => {
    if (!customItemName.trim()) { alert("Please specify the item name."); return; }
    if (!requestPhone.trim() || requestPhone.length < 10) { alert("Please enter a valid phone number."); return; }

    setIsRequesting(true);

    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: "logRequest",
                itemName: customItemName,
                quantity: quantity,
                phone: requestPhone
            })
        });
        setRequestSent(true);
    } catch (error) {
        alert("Failed to send request. Try again.");
    } finally {
        setIsRequesting(false);
    }
  };

  // --- ADD REGULAR ITEM TO CART ---
  const addToCart = () => {
    if (!selectedProduct) return;

    let finalPrice = selectedProduct.basePrice;
    if (selectedProduct.hasPriceVariants && variantPrice) {
        finalPrice = variantPrice;
    }

    let detailsArr = [];
    if (selectedProduct.hasStream) detailsArr.push(stream.toUpperCase());
    if (selectedProduct.hasPriceVariants) detailsArr.push(variantPrice === 70 ? '200 Pages' : '100 Pages');
    if (selectedProduct.hasColorVariants || selectedProduct.hasTypeVariants) {
        detailsArr.push(selectedVariant || (selectedProduct.variantOptions ? selectedProduct.variantOptions[0] : ''));
    }

    const item = {
        id: Date.now(),
        name: selectedProduct.name,
        type: 'Stationery',
        price: finalPrice,
        details: detailsArr.join(" | "),
        quantity: quantity 
    };

    onAddToCart(item);
    closeModal();
  };

  const openProductModal = (product) => {
    if (inventory[product.id] === false) return;

    setSelectedProduct(product);
    setQuantity(1);
    setStream('vtu');
    setVariantPrice(product.hasPriceVariants ? 50 : null);
    setSelectedVariant(product.variantOptions ? product.variantOptions[0] : null);
    setCustomItemName('');
    setRequestPhone('');
    setRequestSent(false); 
  };

  const closeModal = () => setSelectedProduct(null);

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-40 animate-fade-in relative">
      
      {/* --- INJECTED STYLES FOR LOADER --- */}
      <style>{`
        .loader {
          height: 30px;
          aspect-ratio: 2;
          display: grid;
          /* Added drop-shadow to make the white eyes visible on light backgrounds */
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
          background:
            radial-gradient(farthest-side,#000 15%,#0000 18%)0 0/50% 100%,
            radial-gradient(50% 100% at 50% 160%,#fff 95%,#0000) 0 0    /50% 50%,
            radial-gradient(50% 100% at 50% -60%,#fff 95%,#0000) 0 100%/50% 50%;
          background-repeat: repeat-x;
          animation: l2 1.5s infinite linear;
        }
        @keyframes l2 {
          0%,
          15% {background-position:0   0,0 0,0 100%}
          20%,
          40% {background-position:5px 0,0 0,0 100%}
          45%,
          55% {background-position:0   0,0 0,0 100%}
          60%,
          80%{background-position:-5px 0,0 0,0 100%}
          85%,
          100% {background-position:0   0,0 0,0 100%}
        }
      `}</style>

      {/* HEADER (View Cart Removed) */}
      <div className="bg-white px-6 pt-4 pb-4 shadow-sm sticky top-0 z-20 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold text-blue-600">The Student Shop</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Files, Pens & Essentials.</p>
                </div>
            </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search items..." className="w-full bg-slate-100 p-3 pl-10 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {loadingInventory ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
                {/* --- NEW LOADING ANIMATION --- */}
                <div className="loader mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-wider">Loading Inventory...</p>
            </div>
        ) : (
            filteredProducts.map((item) => {
                const isStock = inventory[item.id] !== false; 
                return (
                  <div 
                    key={item.id} 
                    className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all ${!isStock ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-md cursor-pointer group'}`}
                    onClick={() => isStock && openProductModal(item)}
                  >
                    <div>
                      <div className="text-4xl mb-3 text-center transform group-hover:scale-110 transition-transform duration-200">{item.image}</div>
                      <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm">{item.name}</h3>
                      <p className="text-slate-500 text-xs font-medium">{item.isCustom ? 'Request Item' : (item.hasPriceVariants ? 'From ₹50' : `₹${item.basePrice}`)}</p>
                    </div>
                    <div className="mt-4">
                        {isStock ? (
                            <button className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-lg text-xs hover:bg-blue-100 active:scale-95 transition-all">
                              {item.isCustom ? 'Request' : 'Add +'}
                            </button>
                        ) : (
                            <button disabled className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-lg text-xs cursor-not-allowed">
                              Out of Stock
                            </button>
                        )}
                    </div>
                  </div>
                );
            })
        )}
      </div>

      {/* --- FIXED BOTTOM CART BUTTON --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-md mx-auto">
          <button 
            onClick={onOpenCart} 
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            View Cart 
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- PRODUCT MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">{selectedProduct.image}</span>
                        <div><h2 className="font-bold text-lg text-slate-900 leading-tight">{selectedProduct.name}</h2><p className="text-xs text-slate-500">{selectedProduct.description}</p></div>
                    </div>
                    <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-5 h-5 text-slate-500"/></button>
                </div>

                {/* === SUCCESS MESSAGE (REQUEST SENT) === */}
                {requestSent ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 animate-scale-in">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Request Sent!</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Please wait <b>10-15 minutes</b>.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-left border border-blue-100 text-xs text-blue-800 leading-relaxed flex gap-3">
                            <Clock className="w-5 h-5 flex-shrink-0" />
                            We will check price & availability and contact you on the provided number.
                        </div>
                        <button onClick={closeModal} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-4">Okay, I'll Wait</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        
                        {/* 1. QUANTITY (All Items) */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Quantity</label>
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-600 active:scale-95"><Minus className="w-4 h-4"/></button>
                                <span className="font-black text-xl text-slate-800">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm active:scale-95"><Plus className="w-4 h-4"/></button>
                            </div>
                        </div>

                        {/* 2. REGULAR OPTIONS (Stream, Pages, Color) */}
                        {!selectedProduct.isCustom && (
                            <>
                                {selectedProduct.hasStream && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Stream</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setStream('vtu')} className={`py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${stream === 'vtu' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500'}`}>VTU</button>
                                            <button onClick={() => setStream('autonomous')} className={`py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${stream === 'autonomous' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500'}`}>Autonomous</button>
                                        </div>
                                    </div>
                                )}
                                {selectedProduct.hasPriceVariants && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Pages</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setVariantPrice(50)} className={`py-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center transition-all ${variantPrice === 50 ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 text-slate-500'}`}><span>100 Pages</span><span className="text-xs opacity-80">₹50</span></button>
                                            <button onClick={() => setVariantPrice(70)} className={`py-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center transition-all ${variantPrice === 70 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 text-slate-500'}`}><span>200 Pages</span><span className="text-xs opacity-80">₹70</span></button>
                                        </div>
                                    </div>
                                )}
                                {(selectedProduct.hasColorVariants || selectedProduct.hasTypeVariants) && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select {selectedProduct.hasColorVariants ? 'Color' : 'Type'}</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.variantOptions.map(opt => (
                                                <button key={opt} onClick={() => setSelectedVariant(opt)} className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${selectedVariant === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500'}`}>{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* 3. CUSTOM REQUEST FIELDS */}
                        {selectedProduct.isCustom && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Item Name</label>
                                    <input 
                                        type="text" 
                                        value={customItemName}
                                        onChange={(e) => setCustomItemName(e.target.value)}
                                        placeholder="e.g. Geometry Box, A3 Sheets..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500 text-slate-800 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={requestPhone}
                                        onChange={(e) => setRequestPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                                        placeholder="To notify you"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500 text-slate-800 font-medium"
                                    />
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2 items-start">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-[10px] text-yellow-700 leading-relaxed">
                                        This request will be sent to the Admin. Price will be confirmed upon availability.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ACTION BUTTON */}
                        <button 
                            onClick={selectedProduct.isCustom ? handleCustomRequest : addToCart}
                            disabled={isRequesting}
                            className={`w-full py-4 font-bold rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 ${
                                selectedProduct.isCustom ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                        >
                            {isRequesting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                            ) : (
                                <>
                                    <span>{selectedProduct.isCustom ? 'Submit Request' : 'Add to Cart'}</span>
                                    {!selectedProduct.isCustom && <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{(variantPrice || selectedProduct.basePrice) * quantity}</span>}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Store;