'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import PrintCalculator from '../components/PrintCalculator';
import AcademicStudio from '../components/AcademicStudio'; 
import Store from '../components/Store'; 
import Checkout from '../components/Checkout';
import OrderSuccess from '../components/OrderSuccess'; 
import TrackOrder from '../components/TrackOrder'; 
import RotatingText from '../components/RotatingText'; 
import NammaMitraAnim from '../components/NammaMitraAnim'; 
import ProjectMitraAnim from '../components/ProjectMitraAnim'; 

import { ShoppingCart, Home as HomeIcon, Package, GraduationCap, ChevronRight, Zap, PenTool, Mail, Phone, Instagram, Linkedin, Heart, ArrowLeft, Store as StoreIcon, Cpu, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  
  // --- Actions ---
  const handleAddToCart = (item) => { 
    setCart([...cart, item]); 
    alert("Item added to cart!"); 
  };
  
  const handleBuyNow = (item) => { 
    setCart([...cart, item]); 
    setCurrentView('checkout'); 
    window.scrollTo(0, 0); 
  };

  const handleRemoveFromCart = (itemId) => { 
    setCart(cart.filter(item => item.id !== itemId)); 
  };

  const handleOpenCart = () => { 
    setCurrentView('checkout'); 
    window.scrollTo(0, 0); 
  };

  const handleOrderSuccess = (data) => { 
    setOrderSuccessData(data); 
    setCart([]); 
    setCurrentView('order_success'); 
    window.scrollTo(0, 0); 
  };
  
  // --- Navigation ---
  const handleStartPrint = () => { setCurrentView('print_calculator'); window.scrollTo(0, 0); };
  const handleStartAcademic = () => { setCurrentView('academic_studio'); window.scrollTo(0, 0); };
  const handleOpenStore = () => { setCurrentView('store'); window.scrollTo(0, 0); }; 
  const handleOpenOrders = () => { setCurrentView('track_order'); window.scrollTo(0, 0); };
  const handleBackToHome = () => { setCurrentView('home'); window.scrollTo(0, 0); };
  
  // Page Handlers
  const handleOpenTerms = () => { setCurrentView('terms'); window.scrollTo(0, 0); };
  const handleOpenPrivacy = () => { setCurrentView('privacy'); window.scrollTo(0, 0); };
  const handleOpenRefund = () => { setCurrentView('refund'); window.scrollTo(0, 0); };
  // --- NEW: FAQ HANDLER ---
  const handleOpenFAQ = () => { setCurrentView('faq'); window.scrollTo(0, 0); };

  // Helper to render the correct component
  const renderContent = () => {
    switch(currentView) {
      case 'home':
        return (
          <>
            {/* TOP HEADER */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-slate-100 shadow-sm transition-all">
              <div className="flex flex-col items-start justify-center">
                
                {/* Header Animation */}
                <NammaMitraAnim /> 

                <div className="flex items-center gap-1.5 mt-1.5 pl-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase font-sans">BIT Campus</span>
                </div>
              </div>
              <button onClick={handleOpenCart} className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
                <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>
            </header>

            <div className="px-6 mt-8 max-w-lg mx-auto space-y-10 min-h-[60vh] pb-32">
              
              {/* HERO SECTION */}
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">One-Stop Solution For</p>
                  <div className="text-4xl font-bold text-blue-700 leading-[1.1] tracking-tight min-h-[50px] flex items-center">
                    <RotatingText
                      texts={['Printing', 'Projects', 'Binding', 'Reports']}
                      mainClassName="text-blue-700 overflow-hidden pb-2" 
                      staggerFrom="last"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-120%", opacity: 0 }}
                      staggerDuration={0.025}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={3000}
                      splitBy="characters" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleStartPrint}
                  className="group w-full bg-slate-900 text-white p-1 rounded-3xl active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
                >
                  <div className="bg-slate-900 rounded-[20px] px-6 py-6 flex items-center justify-between border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-blue-900 transition-colors duration-500"></div>
                    <div className="relative z-10 text-left">
                      <div className="bg-slate-800/80 w-fit p-2.5 rounded-xl mb-3 border border-slate-700">
                         <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                      <span className="block font-bold text-xl">Start Printing</span>
                      <span className="text-slate-400 text-sm font-medium">Upload PDF, Docx & Images</span>
                    </div>
                    <div className="relative z-10 bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </button>
              </div>

              {/* SERVICES SECTION */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between px-1">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campus Services</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      {/* Academic Studio */}
                      <div 
                          onClick={handleStartAcademic}
                          className="col-span-1 bg-indigo-50 border border-indigo-100 p-5 rounded-3xl cursor-pointer hover:bg-indigo-100/80 transition-all group relative overflow-hidden min-h-[160px] flex flex-col justify-between shadow-sm active:scale-[0.98]"
                      >
                          <div className="bg-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                              <GraduationCap className="w-5 h-5" />
                          </div>
                          <div className="relative z-10">
                              <h4 className="font-bold text-indigo-950 text-lg leading-tight mb-1">Academic<br/>Studio</h4>
                              <p className="text-indigo-700/70 text-xs font-medium">PPTs, Reports & Formatting</p>
                          </div>
                          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-200/50 rounded-full blur-xl"></div>
                      </div>

                      {/* Store */}
                      <div 
                          onClick={handleOpenStore} 
                          className="col-span-1 bg-orange-50 border border-orange-100 p-5 rounded-3xl cursor-pointer hover:bg-orange-100/80 transition-all group relative overflow-hidden min-h-[160px] flex flex-col justify-between shadow-sm active:scale-[0.98]"
                      >
                          <div className="bg-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-orange-500">
                              <StoreIcon className="w-5 h-5" />
                          </div>
                          <div className="relative z-10">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-orange-950 text-lg leading-tight mb-1">Campus<br/>Store</h4>
                              </div>
                              <p className="text-orange-700/70 text-xs font-medium">Stationery & Electronics</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* --- PROJECT MITRA BANNER --- */}
              <div className="animate-fade-in-up cursor-default" style={{ animationDelay: '0.15s' }}>
                  <div className="relative w-full bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-1 rounded-3xl shadow-lg overflow-hidden group">
                      
                      {/* Animated Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Inner Content */}
                      <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-[20px] p-5 flex items-center justify-between border border-white/10">
                          <div className="flex items-center gap-4">
                              <div className="bg-violet-500/20 p-3 rounded-2xl border border-violet-500/30 text-violet-300">
                                  <Cpu className="w-6 h-6" />
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      {/* ANIMATED TEXT COMPONENT */}
                                      <ProjectMitraAnim />
                                      <span className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">SOON</span>
                                  </div>
                                  <p className="text-slate-400 text-xs font-medium">Flagship Service. Something Big is Coming.</p>
                              </div>
                          </div>
                          <div className="text-violet-400 opacity-50 group-hover:opacity-100 transition-opacity">
                              <Sparkles className="w-5 h-5" />
                          </div>
                      </div>
                  </div>
              </div>

              {/* UTILITY SECTION */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Actions</h3>
                  </div>
                  <button 
                      onClick={handleOpenOrders}
                      className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-200"
                  >
                      <div className="flex items-center gap-4">
                          <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Package className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                              <h3 className="font-bold text-slate-800">Track Order</h3>
                              <p className="text-xs text-slate-500 font-medium">Check status via Order ID</p>
                          </div>
                      </div>
                      <div className="pr-2">
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                  </button>
              </div>

            </div>

            {/* FOOTER & NAV */}
            <footer className="bg-slate-900 text-white rounded-t-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-[100px] pointer-events-none"></div>

                <div className="px-8 pt-12 pb-28 space-y-12 relative z-10">
                    <div className="space-y-4">
                          <h2 className="font-creative text-3xl font-bold flex items-center gap-1">
                            NAMMA
                            <span className="text-blue-400">MITRA</span>
                          </h2>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                              The student-run campus service. Upload files, book binding slots, and skip the queue. Making campus life easier, one print at a time.
                          </p>
                    </div>

                    <div className="flex justify-between items-start gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-white">Contact Us</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="mailto:judahsamuel1234@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-blue-300 transition-colors text-sm">
                                        <Mail className="w-4 h-4" /> judahsamuel1234
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+918310527016" className="flex items-center gap-2 text-slate-400 hover:text-blue-300 transition-colors text-sm">
                                        <Phone className="w-4 h-4" /> +91 83105 27016
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4 text-right">
                            <h3 className="font-bold text-lg text-white">Legal</h3>
                            <ul className="space-y-3 flex flex-col items-end">
                                <li>
                                    <button onClick={handleOpenTerms} className="text-slate-400 hover:text-blue-300 transition-colors text-sm">Terms of Service</button>
                                </li>
                                <li>
                                    <button onClick={handleOpenPrivacy} className="text-slate-400 hover:text-blue-300 transition-colors text-sm">Privacy Policy</button>
                                </li>
                                <li>
                                    <button onClick={handleOpenRefund} className="text-slate-400 hover:text-blue-300 transition-colors text-sm">Refund Policy</button>
                                </li>
                                {/* --- NEW FAQ LINK --- */}
                                <li>
                                    <button onClick={handleOpenFAQ} className="text-slate-400 hover:text-blue-300 transition-colors text-sm">FAQ</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col gap-6">
                        <div className="space-y-4">
                             <h3 className="font-bold text-lg text-white">Follow Us</h3>
                             <div className="flex gap-4">
                                <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-blue-600 transition-colors text-white"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-blue-700 transition-colors text-white"><Linkedin className="w-5 h-5" /></a>
                             </div>
                        </div>
                        <div className="text-center text-slate-500 text-xs font-medium space-y-2">
                            <p className="text-slate-400 italic opacity-80 text-sm">"By the Students, For the Students, Of the Students"</p>
                            <p>&copy; 2026 Namma Mitra. All rights reserved.</p>
                            <p className="flex items-center justify-center gap-1">Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by JAV</p>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/60 py-3 px-8 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <NavIcon icon={HomeIcon} label="Home" active={true} onClick={handleBackToHome} />
              <NavIcon icon={Package} label="Orders" active={false} onClick={handleOpenOrders} />
              <NavIcon icon={ShoppingCart} label="Cart" active={false} onClick={handleOpenCart} badge={cart.length} />
            </div>
          </>
        );
      case 'print_calculator':
        return <PrintCalculator onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onBack={handleBackToHome} />;
      case 'academic_studio':
        return <AcademicStudio onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onBack={handleBackToHome} />;
      case 'store': 
        return <Store onAddToCart={handleAddToCart} onOpenCart={handleOpenCart} onBack={handleBackToHome} />;
      case 'checkout':
        return <Checkout cart={cart} onBack={handleBackToHome} onRemoveItem={handleRemoveFromCart} onSuccess={handleOrderSuccess} />;
      case 'order_success':
        return orderSuccessData ? <OrderSuccess onBackHome={handleBackToHome} orderData={orderSuccessData} /> : null;
      case 'track_order':
        return <TrackOrder onBack={handleBackToHome} />;
      case 'terms': return <TermsOfService onBack={handleBackToHome} />;
      case 'privacy': return <PrivacyPolicy onBack={handleBackToHome} />;
      case 'refund': return <RefundPolicy onBack={handleBackToHome} />;
      case 'faq': return <FAQ onBack={handleBackToHome} />;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[80px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[80px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentView} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="relative z-10 min-h-screen">
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

// --- LEGAL COMPONENTS ---

const FAQ = ({ onBack }) => {
    return (
        <div className="min-h-screen pb-10">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-slate-700" /></button>
                <h2 className="font-bold text-lg text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="p-6 max-w-2xl mx-auto space-y-8 text-slate-600">
                
                {/* Services */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">🛒 Services & Products</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">What services does Namma Mitra offer?</h4>
                            <p className="text-sm leading-relaxed text-slate-500">
                                We offer three main services:
                                <br/>1. <b>Campus Store:</b> Buy stationery, lab records, and notebooks.
                                <br/>2. <b>Printing:</b> Upload documents for print (PDF/Word).
                                <br/>3. <b>Academic Studio:</b> Get help with PPT design, project reports, and formatting.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Can I request an item that isn't listed?</h4>
                            <p className="text-sm leading-relaxed text-slate-500">
                                Yes! Go to the Campus Store, scroll to the "Others / Request" item, and submit your request. We will check availability and notify you via WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">🚚 Delivery & Orders</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">How long does delivery take?</h4>
                            <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-500">
                                <li><b>Standard Delivery:</b> 30-45 mins (Store Open).</li>
                                <li><b>Priority Delivery:</b> 10-15 mins (Store Open).</li>
                                <li><b>Academic Orders:</b> 24-48 hours (Digital Delivery).</li>
                            </ul>
                            <p className="text-xs mt-2 text-slate-400 italic">Note: If the store is closed (5 PM - 8 AM), delivery will be the next day at 8 AM.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Where do you deliver?</h4>
                            <p className="text-sm leading-relaxed text-slate-500">
                                We deliver anywhere within the BIT Campus. You must specify your exact location (e.g., Main Block, Lab 3) at checkout.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payments */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">💳 Payments & Support</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Is there a delivery fee?</h4>
                            <p className="text-sm leading-relaxed text-slate-500">
                                Yes. Standard delivery is ₹19.00 and Priority is ₹39.00. Academic digital services have free delivery.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Can I cancel my order?</h4>
                            <p className="text-sm leading-relaxed text-slate-500">
                                Orders cannot be cancelled once work has begun or the item is out for delivery. Please review your order carefully before paying.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const RefundPolicy = ({ onBack }) => {
    return (
        <div className="min-h-screen pb-10">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-slate-700" /></button>
                <h2 className="font-bold text-lg text-slate-900">Refund Policy</h2>
            </div>
            <div className="p-6 max-w-2xl mx-auto space-y-8 text-slate-600">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-6">
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">1. General Policy</h3>
                        <p className="text-sm leading-relaxed">We strive to provide quality stationery products and reliable academic services. Please read this policy carefully before placing an order, as all purchases are subject to the terms below.</p>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">2. Stationery Products</h3>
                        <div className="space-y-4 pl-2">
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">Eligible for Refund or Replacement if:</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>The product is damaged during delivery</li><li>The wrong product was delivered</li><li>The product has manufacturing defects</li></ul></div>
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">Conditions:</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>You must report the issue within 48 hours of delivery</li><li>The product must be unused and in original packaging</li></ul></div>
                        </div>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">3. Academic & Digital Services</h3>
                        <p className="text-sm italic mb-2">Academic services include PPT making, notes preparation, assignment formatting, and other educational support services.</p>
                        <div className="space-y-4 pl-2">
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">Refund Policy for Services:</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>No refund once work has started</li><li>If the service has not yet started, partial or full refund may be considered</li><li>Completed and delivered digital services are non-refundable</li></ul></div>
                        </div>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">4. Delayed Delivery</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1"><li>Delays caused by incorrect user information are not eligible for refunds</li><li>In case of significant delays from our side, refunds or credits may be considered at our discretion.</li></ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

const TermsOfService = ({ onBack }) => {
    return (
        <div className="min-h-screen pb-10">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-slate-700" /></button>
                <h2 className="font-bold text-lg text-slate-900">Terms of Service</h2>
            </div>
            <div className="p-6 max-w-2xl mx-auto space-y-8 text-slate-600">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-6">
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
                        <p className="text-sm leading-relaxed">By accessing this website, creating an account, or placing an order, you confirm that you have read, understood, and agreed to these Terms of Service. If you do not agree, please do not use our platform.</p>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">2. Services Offered</h3>
                        <p className="text-sm mb-2">We provide:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1"><li>Sale of stationery and academic-related products</li><li>Educational support services such as PPT creation, notes preparation, assignment formatting, and related academic assistance</li></ul>
                        <p className="text-sm mt-2 italic text-slate-500">All services are intended to support learning and not to promote academic dishonesty.</p>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">3. User Responsibilities</h3>
                        <p className="text-sm mb-2">You agree to:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1"><li>Provide accurate and complete information</li><li>Use the platform only for lawful and ethical purposes</li><li>Not misuse academic services for plagiarism, cheating, or violating institutional rules</li></ul>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">4. Orders and Payments</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1"><li>All prices are displayed clearly and may change without prior notice</li><li>Payments must be completed before order processing</li><li>Orders once placed cannot be cancelled after work has started (for services)</li></ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

const PrivacyPolicy = ({ onBack }) => {
    return (
        <div className="min-h-screen pb-10">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-slate-700" /></button>
                <h2 className="font-bold text-lg text-slate-900">Privacy Policy</h2>
            </div>
            <div className="p-6 max-w-2xl mx-auto space-y-8 text-slate-600">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm space-y-6">
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2 text-lg">1. Information We Collect</h3>
                        <p className="text-sm leading-relaxed mb-4">We may collect the following information:</p>
                        <div className="space-y-4 pl-2">
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">a) Personal Information</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>Name</li><li>Email address</li><li>Phone number</li><li>Billing and delivery address</li></ul></div>
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">b) Account & Order Information</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>Order history (products and services)</li><li>Uploaded files for academic services (PPT topics, notes, documents, etc.)</li></ul></div>
                            <div><h4 className="font-bold text-slate-800 text-sm mb-1">c) Technical Information</h4><ul className="list-disc pl-5 text-sm space-y-1"><li>IP address</li><li>Browser type</li><li>Device information</li><li>Website usage data (cookies and analytics)</li></ul></div>
                        </div>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2 text-lg">2. How We Use Information</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1"><li>To process and deliver your orders</li><li>To improve our services and website</li><li>To communicate with you regarding your orders</li></ul>
                    </section>
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2 text-lg">3. Data Security</h3>
                        <p className="text-sm">We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

function NavIcon({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} className="relative p-2 flex flex-col items-center gap-1 group">
      <div className={`transition-all duration-300 ${active ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
         <Icon className={`w-6 h-6 ${active ? 'text-slate-900 fill-slate-900' : 'text-slate-400'}`} />
      </div>
      {active && <div className="w-1 h-1 bg-slate-900 rounded-full"></div>}
      {badge > 0 && (
         <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border border-white">
            {badge}
         </span>
      )}
    </button>
  );
}