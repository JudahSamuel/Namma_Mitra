'use client';
import React from 'react';
import { CheckCircle, Package, Truck, Home, ArrowRight, Copy, MapPin, Phone } from 'lucide-react';

// FIX: Renamed props to match what App.js sends (orderData, onBackHome)
const OrderSuccess = ({ orderData, onBackHome }) => {
  
  // Destructure safely. If data is missing, default to empty object to prevent crash.
  const { orderId, amount, user } = orderData || {};
  const { name, phone, location } = user || {};

  const handleCopyId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      alert("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-32 font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-12 pb-8 text-center animate-fade-in">
        {/* Background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-xl mb-6 relative group">
           <div className="absolute inset-0 rounded-full border-[6px] border-emerald-100 animate-[ping_2s_ease-in-out_infinite] opacity-50"></div>
           <CheckCircle className="w-20 h-20 text-emerald-500 animate-[bounce_1s_ease-in-out_1]" />
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-2">Order Placed!</h1>
        <p className="text-slate-600 text-lg">
            Thanks for ordering, <span className="font-bold text-slate-800">{name ? name.split(' ')[0] : 'Student'}</span>.
        </p>
      </div>

      <div className="max-w-md mx-auto px-5 space-y-6">
        
        {/* 2. ORDER ID & AMOUNT CARD */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-slide-up delay-100 relative">
           <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
           
           <div className="p-6 relative z-10">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">YOUR ORDER ID</p>
              
              <div onClick={handleCopyId} className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                 <h2 className="text-3xl font-mono font-black text-blue-600 tracking-wider group-hover:scale-105 transition-transform">
                    {orderId || 'PENDING'}
                 </h2>
                 <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 group-hover:text-blue-500">
                    <Copy className="w-3 h-3" /> Tap to copy
                 </p>
              </div>

              <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
                 <div>
                   <p className="text-xs text-slate-500 font-medium">Amount Paid</p>
                   <p className="text-sm text-slate-400">{new Date().toLocaleDateString()}</p>
                 </div>
                 <p className="text-3xl font-black text-slate-800">
                    ₹{amount ? Number(amount).toFixed(0) : '0'}
                 </p>
              </div>
           </div>
           
           <div className="absolute bottom-0 right-0 text-slate-100 opacity-20 transform translate-x-8 translate-y-8 -z-0">
              <Package className="w-40 h-40" />
           </div>
        </div>

        {/* 3. DELIVERY DETAILS CARD */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 animate-slide-up delay-200">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Delivery Details</h3>
           <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                   <MapPin className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-700">Delivering to</p>
                   <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{location || "Campus Location"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                   <Phone className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-700">Contact Number</p>
                   <p className="text-sm font-mono font-medium text-slate-600 mt-0.5">{phone || "+91 XXXXX XXXXX"}</p>
                </div>
              </div>
           </div>
        </div>

        {/* 4. TIMELINE */}
        <div className="bg-indigo-50/70 p-6 rounded-3xl border border-indigo-100 animate-slide-up delay-300">
           <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6">What Happens Next?</h3>
           <div className="relative pl-2 space-y-6">
              <div className="absolute left-6 top-2 bottom-10 w-0.5 bg-indigo-200"></div>

              <div className="relative flex items-center gap-4 z-10">
                 <div className="w-12 h-12 bg-white border-4 border-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                    <Package className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-bold text-indigo-900">Order Received</p>
                    <p className="text-xs text-indigo-600/80">We are preparing your files.</p>
                 </div>
              </div>
              <div className="relative flex items-center gap-4 z-10 opacity-70">
                 <div className="w-12 h-12 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                    <Truck className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-bold text-slate-700">Out for Delivery</p>
                    <p className="text-xs text-slate-500">Our executive will call you.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* 5. BOTTOM ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-50 animate-slide-up delay-500">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={onBackHome} 
            className="flex-1 py-3.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
             <Home className="w-5 h-5" /> Home
          </button>
          
          <button 
            onClick={() => {
               // Copy ID and go home (since we don't have direct nav to Track page from here in standard flow)
               if(orderId) navigator.clipboard.writeText(orderId);
               alert(`Order ID ${orderId} copied! Go to 'Track Order' to check status.`);
               onBackHome(); 
            }} 
            className="flex-[2] py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
             Track Order <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default OrderSuccess;