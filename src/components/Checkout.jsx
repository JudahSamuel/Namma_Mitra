'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShieldCheck, ShoppingBag, Trash2, Presentation, FileText, Minus, Plus, RefreshCw, Zap, User, Phone, MapPin, Loader2, CreditCard, Sparkles, Hourglass, AlertTriangle } from 'lucide-react';
import Script from 'next/script';

const Checkout = ({ cart, onBack, onRemoveItem, onSuccess }) => {
  const [deliverySlot, setDeliverySlot] = useState('normal'); 
  const [note, setNote] = useState('');
  const [revisionCounts, setRevisionCounts] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [processedCartItems, setProcessedCartItems] = useState([]);
  const [isFilesReady, setIsFilesReady] = useState(false);

  // --- STORE STATUS STATE ---
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Determine Order Type
  const isAcademicOrder = cart.length > 0 && cart.every(item => item.type === 'Academic Service');
  
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxUS5VtmFdpgOheTM2Ghozl_JCE0c5nNVoHamJRnaQ0lHLytvwlTe835VEtR6O2sw/exec'; 

  // --- 1. CHECK STORE STATUS ON MOUNT ---
  useEffect(() => {
    const checkStore = async () => {
        try {
            const res = await fetch(`${GOOGLE_SHEET_URL}?action=getStoreStatus`);
            const json = await res.json();
            if(json.status === 'success') {
                setIsStoreOpen(json.isOpen);
                if (!json.isOpen) setDeliverySlot('normal'); 
            }
        } catch(e) { console.error("Store status check failed", e); } 
    };
    checkStore();
  }, []);

  const HANDLING_FEE = 2.00;
  const REVISION_COST = 69.00;
  
  const DELIVERY_RATES = isAcademicOrder 
    ? { normal: 0, priority: 69 } 
    : { normal: 19, priority: 39 }; 

  // --- DATE HELPER FOR CLOSED MESSAGE ---
  const getNextDayDeliveryText = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // --- CALCULATIONS ---
  const updateRevision = (itemId, change) => {
    const current = revisionCounts[itemId] || 2; 
    setRevisionCounts({ ...revisionCounts, [itemId]: Math.max(1, current + change) });
  };

  const getRevisionCost = (itemId) => {
    const count = revisionCounts[itemId] || 2;
    return Math.max(0, count - 2) * REVISION_COST;
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const cost = parseFloat(item.price || item.baseCost || item.totalCost) || 0;
    const qty = item.quantity || 1;
    return sum + (cost * qty);
  }, 0);
  
  const totalRevisionCost = cart
    .filter(item => item.type === 'Academic Service')
    .reduce((sum, item) => sum + getRevisionCost(item.id), 0);

  // --- LOGIC: DELIVERY CHARGE ---
  let currentDeliveryCharge = 0;
  
  if (isAcademicOrder) {
      currentDeliveryCharge = deliverySlot === 'priority' ? DELIVERY_RATES.priority : DELIVERY_RATES.normal;
  } else {
      // Physical Orders (Print/Stationery)
      if (!isStoreOpen) {
          currentDeliveryCharge = 19; // Forced Standard Rate when closed
      } else {
          currentDeliveryCharge = deliverySlot === 'priority' ? DELIVERY_RATES.priority : DELIVERY_RATES.normal;
      }
  }

  const grandTotal = cartSubtotal + totalRevisionCost + currentDeliveryCharge + HANDLING_FEE;

  // --- FILE PROCESSING ---
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = (error) => reject(error);
  });

  useEffect(() => {
    const prepareFiles = async () => {
      setIsFilesReady(false);
      const processed = await Promise.all(cart.map(async (item) => {
        let fileData = null;
        if (item.file && typeof item.file !== 'string') { try { fileData = await fileToBase64(item.file); } catch (err) { console.error(err); } }
        
        const qty = item.quantity || 1;
        const qtyString = qty > 1 ? ` (Qty: ${qty})` : '';
        const finalDetails = (item.details || '') + qtyString;

        return {
            name: item.name || 'Item', 
            quantity: qty, 
            type: item.type || 'Print', 
            serviceType: item.serviceType || 'N/A', 
            fileName: item.name || item.file?.name || 'N/A', 
            fileType: item.file?.type || 'N/A', 
            fileData: fileData, 
            details: finalDetails, 
            printDetails: item.details || item.description || {}, 
            topic: item.topic || '', 
            guideName: item.guideName || '', 
            guideDesignation: item.guideDesignation || '', 
            hodName: item.hodName || '', 
            teamMembers: item.teamMembers || [] 
        };
      }));
      setProcessedCartItems(processed); setIsFilesReady(true);
    };
    if (cart.length > 0) prepareFiles();
  }, [cart]);

  // --- SUBMISSION ---
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim() || phone.length < 10) newErrors.phone = "Valid phone number required";
    if (!isAcademicOrder && !location.trim()) newErrors.location = "Delivery location required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processOrderAndSubmit = async (paymentDetails) => {
    try {
        const shortOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        
        let deliveryMode = "Standard";
        if (isAcademicOrder) {
            deliveryMode = deliverySlot === 'priority' ? 'Prime 24hr' : 'Normal 48hr';
        } else {
            if (!isStoreOpen) {
                deliveryMode = "Next Day 8AM";
            } else {
                deliveryMode = deliverySlot === 'priority' ? 'Priority 10m' : 'Standard 45m';
            }
        }

        const orderData = {
            order_id: shortOrderId,
            razorpay_ref: paymentDetails.orderId,
            name: name,
            phone: phone,
            location: isAcademicOrder ? 'Digital Delivery' : location,
            note: note,
            delivery_mode: deliveryMode,
            amount: grandTotal,
            payment_id: paymentDetails.paymentId,
            items: processedCartItems
        };

        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(orderData)
        });

        onSuccess({ orderId: shortOrderId, amount: grandTotal, user: { name, phone, location: isAcademicOrder ? 'Digital' : location } });
    } catch (error) { onSuccess({ orderId: "ORD-GEN", amount: grandTotal, user: { name, phone, location: isAcademicOrder ? 'Digital' : location } }); } 
    finally { setIsProcessing(false); }
  };

  const handlePayment = async () => {
    if (!validateForm()) { const formElement = document.getElementById('student-details-form'); if(formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (!isFilesReady) { alert("Preparing data... Try again in 5s."); return; }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: grandTotal }) });
      if (!response.ok) throw new Error("Order creation failed");
      const orderData = await response.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: orderData.amount, currency: orderData.currency, name: "NAMMA MITRA", description: "Order Payment", order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature }) });
            const verifyData = await verifyRes.json();
            if (verifyData.success) await processOrderAndSubmit({ orderId: orderData.id, paymentId: response.razorpay_payment_id }); else { alert("Payment verification failed."); setIsProcessing(false); }
          } catch (e) { alert("Verification error."); setIsProcessing(false); }
        },
        prefill: { name: name, contact: phone, email: "student@bit.edu.in" }, theme: { color: "#2563eb" }, modal: { ondismiss: function() { setIsProcessing(false); } }
      };
      const rzp = new window.Razorpay(options); rzp.open();
    } catch (error) { alert("Could not start payment."); setIsProcessing(false); }
  };

  if (!cart || cart.length === 0) return (<div className="min-h-screen flex flex-col items-center justify-center p-10 text-center text-slate-500"><ShoppingBag className="w-12 h-12 mb-4 text-slate-300" /><p>Your cart is empty.</p><button onClick={onBack} className="mt-4 text-blue-600 font-bold hover:underline">Start Shopping</button></div>);

  return (
    <div className="min-h-screen bg-slate-50 pb-48 font-sans text-slate-900 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-40 flex items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 mr-3"><ArrowLeft className="w-6 h-6 text-slate-600" /></button>
        <h1 className="text-xl font-bold text-slate-800">Checkout ({cart.length} items)</h1>
      </div>

      <div className="w-full max-w-md mx-auto p-5 space-y-6 animate-fade-in">
        
        {/* User Details */}
        <div id="student-details-form" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
           <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800"><User className="w-5 h-5 text-blue-600" /> {isAcademicOrder ? 'Student Details' : 'Contact & Delivery'}</h2>
           <div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" className={`w-full p-3 mt-1 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} /></div>
           <div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="9876543210" className={`w-full p-3 mt-1 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} /></div>
           {!isAcademicOrder && (<div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Campus Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Main Block, 2nd Floor, Lab 3" className={`w-full p-3 mt-1 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} /></div>)}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-blue-600" /> Order Summary</h2>
          <div className="space-y-6">
            {cart.map((item) => {
              const currentRevisions = revisionCounts[item.id] || 2;
              const itemCostDisplay = parseFloat(item.price || item.baseCost || item.totalCost) || 0;
              const qty = item.quantity || 1;
              return (
                <div key={item.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg border flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase relative ${item.type === 'Academic Service' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                      {qty > 1 && <span className="absolute -top-2 -right-2 bg-slate-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px] shadow-sm ring-2 ring-white">{qty}x</span>}
                      {item.type === 'Academic Service' ? (item.serviceType === 'ppt' ? <Presentation className="w-6 h-6" /> : <FileText className="w-6 h-6" />) : (item.file?.type?.startsWith('image/') ? 'IMG' : (item.type === 'Stationery' ? 'STORE' : 'PDF'))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start"><h3 className="font-bold text-slate-800 truncate text-sm">{item.name || "Item"}</h3><span className="font-bold text-slate-800 text-sm whitespace-nowrap">₹{(itemCostDisplay * qty).toFixed(0)}</span></div>
                      <p className="text-xs text-slate-500 mt-1 truncate">{item.type === 'Academic Service' ? 'Custom Service' : (item.details || "Print")}</p>
                      <button onClick={() => onRemoveItem(item.id)} className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-2 hover:bg-red-50 px-2 py-1 rounded w-fit transition-colors"><Trash2 className="w-3 h-3" /> Remove</button>
                    </div>
                  </div>
                  {item.type === 'Academic Service' && <div className="mt-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100"><div className="flex justify-between items-center mb-2"><label className="flex items-center gap-1.5 text-xs font-bold text-indigo-800"><RefreshCw className="w-3.5 h-3.5" /> Revisions</label><span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">{currentRevisions <= 2 ? 'FREE' : `+₹${getRevisionCost(item.id)}`}</span></div><div className="flex items-center justify-between bg-white rounded-lg border border-indigo-100 p-1"><button onClick={() => updateRevision(item.id, -1)} className="p-1 hover:bg-indigo-50 rounded text-indigo-600"><Minus className="w-4 h-4" /></button><span className="text-sm font-bold text-slate-700">{currentRevisions} Rounds</span><button onClick={() => updateRevision(item.id, 1)} className="p-1 hover:bg-indigo-50 rounded text-indigo-600"><Plus className="w-4 h-4" /></button></div></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- DELIVERY SECTION (UPDATED VISUALS) --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            {isAcademicOrder ? <Hourglass className="w-5 h-5 text-indigo-600" /> : <Clock className="w-5 h-5 text-blue-600" />} 
            {isAcademicOrder ? 'Timeline' : 'Delivery'}
          </h2>
          
          {/* LOGIC: If Store is CLOSED AND it's NOT a digital academic order */}
          {!isStoreOpen && !isAcademicOrder ? (
              // CHANGED: Neutral Grey Visual Style
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                      <p className="font-bold text-slate-700 text-sm">Same Day Delivery Closed</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Same day delivery is applicable only from 8am to 5pm. 
                          Your package will be delivered by <b>{getNextDayDeliveryText()} at 8am</b> at the mentioned location.
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
                          <span className="text-xs font-medium text-slate-500">Standard Delivery Applied</span>
                          <span className="text-sm font-black text-slate-800">₹19.00</span>
                      </div>
                  </div>
              </div>
          ) : (
              // NORMAL DELIVERY OPTIONS
              <div className="space-y-3">
                <label className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${deliverySlot === 'normal' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}><div className="flex items-center gap-3"><input type="radio" name="delivery" className="accent-blue-600 w-4 h-4" checked={deliverySlot === 'normal'} onChange={() => setDeliverySlot('normal')} /><div><p className="font-bold text-sm text-slate-800">{isAcademicOrder ? 'Normal' : 'Standard'}</p><p className="text-xs text-slate-500">{isAcademicOrder ? '48 Hours' : '30-45 mins'}</p></div></div><span className="text-slate-800 font-bold text-sm">{DELIVERY_RATES.normal === 0 ? 'FREE' : `₹${DELIVERY_RATES.normal}`}</span></label>
                <label className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${deliverySlot === 'priority' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}><div className="flex items-center gap-3"><input type="radio" name="delivery" className="accent-blue-600 w-4 h-4" checked={deliverySlot === 'priority'} onChange={() => setDeliverySlot('priority')} /><div><p className="font-bold text-sm text-slate-800 flex items-center gap-1">{isAcademicOrder ? <Sparkles className="w-3 h-3 text-orange-500" /> : <Zap className="w-3 h-3 text-yellow-500" />} {isAcademicOrder ? 'Prime' : 'Priority'}</p><p className="text-xs text-slate-500">{isAcademicOrder ? '24 Hours' : '10-15 mins'}</p></div></div><span className="font-bold text-blue-800 text-sm">₹{DELIVERY_RATES.priority}</span></label>
              </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-100"><label className="text-xs font-bold text-slate-500 uppercase">Note to Store</label><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Special instructions..." className="w-full p-3 mt-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" /></div>
        </div>

        {/* Bill Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg mb-4">Bill Details</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Item Total (Base)</span><span>₹{cartSubtotal.toFixed(2)}</span></div>
            {totalRevisionCost > 0 && (<div className="flex justify-between text-indigo-700 font-medium"><span>Extra Revisions</span><span>+₹{totalRevisionCost.toFixed(2)}</span></div>)}
            <div className="flex justify-between">
                <span>{isAcademicOrder ? 'Timeline Fee' : (isStoreOpen ? 'Delivery' : 'Next Day Delivery')}</span>
                <span>{currentDeliveryCharge === 0 ? 'FREE' : `₹${currentDeliveryCharge.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between"><span>Handling</span><span>₹{HANDLING_FEE.toFixed(2)}</span></div>
            <div className="border-t border-slate-100 my-2 pt-3"><div className="flex justify-between font-black text-lg text-slate-900"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div></div>
          </div>
        </div>
        <div className="bg-slate-100 p-4 rounded-xl flex items-start gap-3"><ShieldCheck className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-slate-500 leading-relaxed">Orders cannot be cancelled once work has begun. Refunds provided for unexpected delays.</p></div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]"><div className="max-w-md mx-auto"><button onClick={handlePayment} disabled={isProcessing} className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${(name && phone.length >= 10 && (!isAcademicOrder ? location : true) && !isProcessing) ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : (<><span>₹{grandTotal.toFixed(0)}</span><span className="flex items-center gap-2">{ (name && phone.length >= 10 && (!isAcademicOrder ? location : true)) ? 'Pay Now' : 'Enter Details' } { (name && phone.length >= 10 && (!isAcademicOrder ? location : true)) ? <CreditCard className="w-5 h-5" /> : <Zap className="w-5 h-5" /> }</span></>)}</button></div></div>
    </div>
  );
};

export default Checkout;