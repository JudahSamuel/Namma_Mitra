'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Presentation, FileText, ArrowRight, ShoppingCart, UserPlus, Trash2, Users, UserCheck, ArrowLeft, Star, Sparkles } from 'lucide-react';

const AcademicStudio = ({ onAddToCart, onBuyNow, onBack }) => {
  const [activeTab, setActiveTab] = useState('ppt'); 
  
  // Inputs - Basic Info
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10); 
  
  // Inputs - Academic Details
  const [guideName, setGuideName] = useState('');
  const [guideDesignation, setGuideDesignation] = useState('');
  const [hodName, setHodName] = useState('');

  // Team Members State
  const [members, setMembers] = useState([{ id: 1, name: '', usn: '' }]);

  // Pricing
  const PRICE_PPT_SLIDE = 10.00;   // <--- UPDATED to ₹7 per slide
  const PRICE_REPORT_FLAT = 375.00;

  // Calculate Cost
  const totalCost = activeTab === 'ppt' ? (count * PRICE_PPT_SLIDE) : PRICE_REPORT_FLAT;

  // --- IMAGE ASSETS ---
  const PPT_TEMPLATES = [
    "/templates/ppt1.png", 
    "/templates/ppt2.png",
    "/templates/ppt3.png",
    "/templates/ppt4.png",
    "/templates/ppt5.png"
  ];

  const REPORT_TEMPLATES = [
    "/templates/report1.png",
    "/templates/report2.png"
  ];

  const currentTemplates = activeTab === 'ppt' ? PPT_TEMPLATES : REPORT_TEMPLATES;

  // --- AUTO SCROLL LOGIC ---
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const slideWidth = scrollContainer.clientWidth;
    const maxScroll = scrollContainer.scrollWidth - slideWidth;

    const interval = setInterval(() => {
      if (scrollContainer) {
        if (scrollAmount >= maxScroll - 10) { 
           scrollAmount = 0;
           scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scrollAmount += slideWidth;
           scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [activeTab]); 

  // Logic
  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', usn: '' }]);
  };

  const removeMember = (id) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const createItem = () => {
    return {
      id: Date.now(),
      name: activeTab === 'ppt' ? `PPT: ${topic}` : `Report: ${topic}`,
      type: 'Academic Service', 
      serviceType: activeTab, 
      topic: topic,
      count: activeTab === 'ppt' ? count : 0,
      guideName: guideName,
      guideDesignation: guideDesignation,
      hodName: hodName,
      teamMembers: members, 
      price: Number(totalCost), 
      baseCost: totalCost, 
      totalCost: totalCost,
      file: null 
    };
  };

  const validate = () => {
    if (!topic.trim()) { alert("Please enter a topic."); return false; }
    if (!guideName.trim()) { alert("Please enter Guide Name."); return false; }
    if (!hodName.trim()) { alert("Please enter HOD Name."); return false; }
    
    for (let m of members) {
        if (!m.name.trim() || !m.usn.trim()) {
            alert("Please fill in Name and USN for all team members.");
            return false;
        }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    onAddToCart(createItem());
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    onBuyNow(createItem());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-48 font-sans text-slate-900 relative">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 pt-4 pb-4">
        <div className="flex items-center gap-3 mb-2">
            <button 
                onClick={onBack} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-extrabold text-indigo-600">Academic Studio</h1>
        </div>
        <p className="text-slate-500 text-sm pl-1">Professional content, formatted to perfection.</p>
      </div>

      {/* Content Wrapper */}
      <div className="max-w-md mx-auto p-5 space-y-6 animate-fade-in">

        {/* Service Selector Tabs */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button 
            onClick={() => setActiveTab('ppt')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'ppt' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Presentation className="w-4 h-4" /> PPT Maker
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'report' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <FileText className="w-4 h-4" /> Report Writer
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 space-y-6 animate-slide-up">
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
               {activeTab === 'ppt' ? <Presentation className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
               <h2 className="font-bold text-lg text-slate-800">
                 {activeTab === 'ppt' ? 'Customize Presentation' : 'Customize Report'}
               </h2>
               <p className="text-xs text-slate-400">Professional formatting included</p>
            </div>
          </div>

          {/* 1. BASIC INFO */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Topic / Title</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., IoT Based Smart Home"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-shadow"
            />
          </div>

          {/* Count (PPT ONLY) */}
          {activeTab === 'ppt' && (
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Number of Slides
                </label>
                <div className="flex items-center gap-4">
                <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={count} 
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xl font-black text-indigo-600 min-w-[30px] text-right">{count}</span>
                </div>
            </div>
          )}

          {/* 2. ACADEMIC DETAILS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
             <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                <UserCheck className="w-4 h-4 text-indigo-600" /> Academic Details
             </label>
             
             <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      placeholder="Guide Name" 
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:outline-indigo-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Designation" 
                      value={guideDesignation}
                      onChange={(e) => setGuideDesignation(e.target.value)}
                      className="w-full sm:w-1/2 p-2 text-sm border border-slate-300 rounded-lg focus:outline-indigo-500"
                    />
                </div>
                <input 
                  type="text" 
                  placeholder="HOD Name" 
                  value={hodName}
                  onChange={(e) => setHodName(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:outline-indigo-500"
                />
             </div>
          </div>

          {/* 3. TEAM DETAILS */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center mb-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                    <Users className="w-4 h-4 text-indigo-600" /> Team Details
                </label>
                <button 
                    onClick={addMember} 
                    className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded-md font-bold flex items-center gap-1 hover:bg-indigo-50 transition"
                >
                    <UserPlus className="w-3 h-3" /> Add Member
                </button>
            </div>
            
            <div className="space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="flex flex-col sm:flex-row gap-2 animate-fade-in bg-white p-2 rounded-lg border border-indigo-100">
                        <input 
                            type="text" 
                            placeholder="Student Name"
                            value={member.name}
                            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                            className="w-full sm:flex-[2] p-2 text-sm border border-slate-200 rounded-lg focus:outline-indigo-500"
                        />
                        <div className="flex gap-2 w-full sm:flex-1">
                            <input 
                                type="text" 
                                placeholder="USN"
                                value={member.usn}
                                onChange={(e) => updateMember(member.id, 'usn', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-indigo-500 uppercase"
                            />
                            {members.length > 1 && (
                                <button 
                                    onClick={() => removeMember(member.id)}
                                    className="p-2 text-red-400 hover:text-red-600 bg-red-50 border border-red-100 rounded-lg flex-shrink-0 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* 4. ROLLING GALLERY (AUTO-SCROLL + MANUAL) */}
          <div className="space-y-3 pt-4 border-t border-dashed border-indigo-200">
            <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" /> 
                    {activeTab === 'ppt' ? 'Slides Preview' : 'Report Format'}
                </label>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold animate-pulse">Auto-playing</span>
            </div>
            
            {/* Scroll Container */}
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl border-2 border-indigo-100 shadow-inner bg-slate-50"
                style={{ scrollBehavior: 'smooth' }}
            >
                {currentTemplates.map((src, index) => (
                    <div 
                        key={index} 
                        className={`flex-shrink-0 snap-center w-full relative flex items-center justify-center bg-white ${
                            activeTab === 'ppt' ? 'aspect-video' : 'aspect-[1/1.414]' // Landscape vs Portrait
                        }`}
                    >
                        <img 
                            src={src} 
                            alt={`Template ${index + 1}`} 
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="text-center p-4"><p class="text-xs font-bold text-slate-400">Preview ${index + 1}</p></div>`;
                            }}
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {index + 1} / {currentTemplates.length}
                        </div>
                    </div>
                ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer Actions - LOCKED TO BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-md mx-auto space-y-3">
          
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Cost</span>
            <div className="flex items-baseline gap-2">
               <p className="text-2xl font-black text-slate-800 tracking-tight">₹{totalCost.toFixed(0)}</p>
               <span className="text-xs text-slate-500">
                 {activeTab === 'ppt' ? `(@ ₹${PRICE_PPT_SLIDE}/slide)` : '(Flat Fee)'}
               </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm shadow-sm border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 flex items-center justify-center gap-2 transition-transform"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>

            <button 
              onClick={handleBuyNow}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2 transition-transform"
            >
              Order Service <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcademicStudio;