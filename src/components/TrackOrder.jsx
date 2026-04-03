'use client';
import React, { useState } from 'react';
import { ArrowLeft, Search, Package, CheckCircle, Clock, Truck, RefreshCw, AlertCircle, XCircle } from 'lucide-react';

const TrackOrder = ({ onBack }) => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // New state for button icon

  // --- ENSURE THIS URL IS CORRECT ---
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxUS5VtmFdpgOheTM2Ghozl_JCE0c5nNVoHamJRnaQ0lHLytvwlTe835VEtR6O2sw/exec'; 

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    // setOrderData(null); // Optional: Keep previous data while loading refresh
    
    try {
      const response = await fetch(`${GOOGLE_SHEET_URL}?orderId=${orderId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setOrderData(data.data);
        setHasSearched(true); // Switch button to Refresh icon
      } else {
        setError('Order not found. Please check your Order ID.');
        setOrderData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- VISUAL LOGIC ---
  const statusLower = orderData?.status?.toLowerCase() || '';
  const isCancelled = statusLower.includes('cancel');

  const getStatusStep = (s) => {
    if (s.includes('deliver') || s.includes('complete')) return 4;
    if (s.includes('ready') || s.includes('out')) return 3;
    if (s.includes('process') || s.includes('print')) return 2;
    return 1; // Default: Placed
  };

  const currentStep = getStatusStep(statusLower);

  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-extrabold text-slate-900">Track Order</h1>
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-8">
        
        {/* Search Input */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <div className="pl-4 pr-2 text-slate-400">
                <Package className="w-5 h-5" />
            </div>
            <input 
                type="text" 
                placeholder="Enter Order ID (e.g. 633080)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent p-3 outline-none text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-300 uppercase tracking-widest"
            />
            <button 
                onClick={handleTrack}
                disabled={loading || !orderId}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 min-w-[50px] flex justify-center shadow-lg shadow-blue-200"
            >
                {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                ) : hasSearched ? (
                    <RefreshCw className="w-5 h-5" /> // Refresh Icon after search
                ) : (
                    <Search className="w-5 h-5" /> // Search Icon initially
                )}
            </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 animate-slide-up">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        )}

        {/* Order Status Card */}
        {orderData && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up">
                
                {/* Status Header (Red if Cancelled) */}
                <div className={`p-6 text-white text-center relative overflow-hidden transition-colors duration-500 ${isCancelled ? 'bg-red-600' : 'bg-slate-900'}`}>
                    <div className={`absolute top-0 left-0 w-full h-full blur-3xl opacity-30 ${isCancelled ? 'bg-orange-500' : 'bg-blue-600'}`}></div>
                    <div className="relative z-10">
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCancelled ? 'text-red-100' : 'text-blue-200'}`}>Current Status</p>
                        <h2 className="text-3xl font-black">{orderData.status || "Processing"}</h2>
                        <p className={`text-xs mt-2 font-mono ${isCancelled ? 'text-red-200' : 'text-slate-400'}`}>ID: {orderData.order_id}</p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="p-8">
                    <div className="relative space-y-8 pl-4 border-l-2 border-slate-100 ml-3">
                        
                        {/* 1. Order Placed (Always Visible) */}
                        <TimelineItem active={true} icon={Package} title="Order Placed" desc="We have received your order." color={isCancelled ? 'red' : 'blue'} />

                        {isCancelled ? (
                            // --- CANCELLED TIMELINE FLOW ---
                            <TimelineItem active={true} icon={XCircle} title="Order Cancelled" desc="This order has been cancelled." isLast color="red" />
                        ) : (
                            // --- NORMAL TIMELINE FLOW ---
                            <>
                                <TimelineItem active={currentStep >= 2} icon={Clock} title="Processing" desc="Your document is being processed." />
                                <TimelineItem active={currentStep >= 3} icon={CheckCircle} title="Ready" desc="Your order is ready for pickup/delivery." />
                                <TimelineItem active={currentStep >= 4} icon={Truck} title="Delivered" desc="Handed over to you." isLast />
                            </>
                        )}

                    </div>
                </div>

                {/* Details Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 text-xs font-bold uppercase">Amount Paid</span>
                        <span className="text-slate-900 text-xl font-black">
                           {String(orderData.amount).includes('$') ? orderData.amount : `₹${orderData.amount}`}
                        </span>
                    </div>
                    {orderData.details && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                            <span className="font-bold text-slate-800 block mb-1">Details:</span>
                            {orderData.details}
                        </div>
                    )}
                </div>

            </div>
        )}

      </div>
    </div>
  );
};

// Reusable Timeline Item Component
const TimelineItem = ({ active, icon: Icon, title, desc, isLast, color = 'blue' }) => {
    // Dynamic color classes based on prop
    const activeBg = color === 'red' ? 'bg-red-600 shadow-red-200 border-red-600' : 'bg-blue-600 shadow-blue-200 border-blue-600';
    const activeText = color === 'red' ? 'text-red-700' : 'text-slate-900';

    return (
        <div className={`relative pl-8 ${isLast ? '' : ''}`}>
            <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 ${
                active ? `${activeBg} text-white shadow-lg` : 'bg-slate-50 border-white text-slate-300 ring-2 ring-slate-100'
            }`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className={`transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <h3 className={`font-bold text-sm ${active ? activeText : 'text-slate-500'}`}>{title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
        </div>
    );
};

export default TrackOrder;