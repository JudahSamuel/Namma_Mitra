'use client';
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Image as ImageIcon, Loader2, AlertCircle, Layers, Book, ArrowRight, ShoppingCart, ArrowLeft, Copy, Minus, Plus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const PrintCalculator = ({ onAddToCart, onBuyNow, onBack }) => {
  // --- State ---
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0); 
  const [printType, setPrintType] = useState('bw'); 
  const [printSide, setPrintSide] = useState('single'); 
  const [binding, setBinding] = useState(false); 
  const [numCopies, setNumCopies] = useState(1);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- Pricing Configuration ---
  const RATES = {
    bw: { single: 2.00, double: 1.50 },
    color: { single: 10.00, double: 8.00 },
    binding: 25 
  };

  // --- Logic: Reset Print Side if Pages <= 1 ---
  useEffect(() => {
    if (pageCount <= 1) {
      setPrintSide('single');
    }
  }, [pageCount]);

  // --- Logic: Calculate Total Cost ---
  const getRatePerPage = () => {
    if (printType === 'bw') {
      return printSide === 'double' ? RATES.bw.double : RATES.bw.single;
    } else {
      return printSide === 'double' ? RATES.color.double : RATES.color.single;
    }
  };

  const ratePerPage = getRatePerPage();
  
  // Cost for ONE complete set (Prints + Binding)
  const singleSetCost = (pageCount * ratePerPage) + (binding ? RATES.binding : 0);
  
  // Total Cost = Single Set Cost * Number of Copies
  const totalCost = singleSetCost * numCopies;

  // --- File Handling ---
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) processFile(uploadedFile);
  };

  const processFile = async (uploadedFile) => {
    setIsScanning(true);
    setErrorMsg(null);
    setFile(uploadedFile);
    setPageCount(0);
    setNumCopies(1); // Reset copies on new file

    try {
      if (uploadedFile.type.startsWith('image/')) {
        setPageCount(1);
        setIsScanning(false);
        return;
      }

      if (uploadedFile.type === 'application/pdf') {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        
        if (count > 0) {
          setPageCount(count);
        } else {
          throw new Error("Empty PDF detected");
        }
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Scan Failed:", error);
      setErrorMsg("File unreadable. Please upload a valid PDF.");
      setFile(null);
    } finally {
      setIsScanning(false);
    }
  };

  // Helper to create the item object safely
  const createItemObject = () => {
    return {
      id: Date.now(),
      name: file ? file.name : "Print Job",
      type: 'Print',
      // Ensure Price is a number for Razorpay
      price: Number(totalCost.toFixed(2)) || 0, 
      details: `${printType.toUpperCase()} | ${printSide} | ${binding ? 'Binding' : 'No Binding'}`,
      
      // --- CRITICAL FIX: PASSING THE FILE OBJECT ---
      file: file, 
      // --------------------------------------------
      
      pageCount,
      numCopies
    };
  };

  const handleAddToCartClick = () => {
    if (!validate()) return;
    onAddToCart(createItemObject());
  };

  const handleBuyNowClick = () => {
    if (!validate()) return;
    onBuyNow(createItemObject());
  };

  const validate = () => {
    if (!file) { alert("Please upload a file first."); return false; }
    if (pageCount === 0) { alert("Scanning file..."); return false; }
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-48 font-sans text-slate-900 relative">
      
      {/* Header */}
      <div className="bg-white px-6 pt-4 pb-4 shadow-sm sticky top-0 z-40 flex items-center gap-3">
        <button 
            onClick={onBack} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
            <h1 className="text-xl font-extrabold text-blue-600">Print Station</h1>
            <p className="text-slate-500 text-xs mt-0.5">Configure your document.</p>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="max-w-md mx-auto p-5 space-y-6 animate-fade-in">
        
        {/* Upload Box */}
        <div className={`relative group transition-all duration-300 transform ${isDragging ? 'scale-105' : 'hover:scale-[1.02]'}`}>
          <label 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${
              errorMsg ? 'border-red-400 bg-red-50' : 
              file ? 'border-blue-400 bg-blue-50' : 'border-blue-300 bg-white hover:bg-blue-50'
            }`}
          >
            <div className="flex flex-col items-center animate-fade-in p-4 text-center">
              {isScanning ? (
                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              ) : errorMsg ? (
                <>
                  <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                  <p className="text-sm font-bold text-red-600">{errorMsg}</p>
                </>
              ) : file ? (
                <>
                  <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                    {file.type.startsWith('image/') ? <ImageIcon className="text-purple-600 w-8 h-8" /> : <FileText className="text-red-500 w-8 h-8" />}
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate w-64">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Tap to change file</p>
                </>
              ) : (
                <>
                  <div className="bg-blue-100 p-4 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-600 w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Tap to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, PNG, or JPG</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept=".pdf, image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
          </label>
        </div>

        {/* Print Options */}
        {file && !errorMsg && (
          <div className="animate-slide-up space-y-5">
            
            {/* Page Count (NON-EDITABLE) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pages</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-800">{pageCount}</span>
                    <span className="text-sm text-slate-500 font-medium">Pages</span>
                </div>
              </div>
              <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" /> DETECTED
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 space-y-5">
              {/* Color Mode */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Color Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setPrintType('bw')} className={`p-4 rounded-xl border-2 font-bold transition-all ${printType === 'bw' ? 'border-slate-800 bg-slate-800 text-white scale-[1.02]' : 'border-slate-200 text-slate-500'}`}>
                    B&W <span className="block text-xs font-normal opacity-80">₹{RATES.bw.single}/pg</span>
                  </button>
                  <button onClick={() => setPrintType('color')} className={`p-4 rounded-xl border-2 font-bold transition-all ${printType === 'color' ? 'border-violet-600 bg-violet-600 text-white scale-[1.02]' : 'border-slate-200 text-slate-500'}`}>
                    Color <span className="block text-xs font-normal opacity-80">₹{RATES.color.single}/pg</span>
                  </button>
                </div>
              </div>

              {/* Print Sides */}
              {pageCount > 1 && (
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Print Sides</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setPrintSide('single')} className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center ${printSide === 'single' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 text-slate-500'}`}>
                        <FileText className="w-5 h-5 mb-1" />
                        <span>Single Sided</span>
                      </button>
                      <button onClick={() => setPrintSide('double')} className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center ${printSide === 'double' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'border-slate-200 text-slate-500'}`}>
                        <Layers className="w-5 h-5 mb-1" />
                        <span>Front & Back</span>
                      </button>
                    </div>
                </div>
              )}

              {/* COPIES SECTION */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Number of Copies</label>
                <div className="flex items-center justify-between p-2 border-2 border-slate-200 rounded-xl bg-slate-50">
                    <span className="font-bold text-sm text-slate-700 ml-2 flex items-center gap-2">
                        <Copy className="w-4 h-4 text-slate-500" /> Copies needed
                    </span>
                    <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                        <button 
                            onClick={() => setNumCopies(Math.max(1, numCopies - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg min-w-[20px] text-center">{numCopies}</span>
                        <button 
                            onClick={() => setNumCopies(numCopies + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              </div>

              {/* Soft Binding */}
              <div onClick={() => setBinding(!binding)} className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${binding ? 'border-orange-400 bg-orange-50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${binding ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white text-slate-300'}`}>
                    <Book className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-medium ${binding ? 'text-orange-900' : 'text-slate-600'}`}>Soft Binding</span>
                    <span className="text-xs text-slate-400">Perfect for reports</span>
                  </div>
                </div>
                <span className={`font-bold ${binding ? 'text-orange-600' : 'text-slate-400'}`}>+₹{RATES.binding}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions - LOCKED TO BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Price Summary */}
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Cost</span>
            <div className="flex items-baseline gap-2">
               <p className="text-2xl font-black text-slate-800 tracking-tight">₹{totalCost.toFixed(2)}</p>
               <span className="text-xs text-slate-500">
                 {numCopies > 1 ? `(${numCopies} sets)` : `(@ ₹${ratePerPage}/pg)`}
               </span>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCartClick} 
              disabled={pageCount === 0 || isScanning} 
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-sm border-2 transition-all flex items-center justify-center gap-2 ${
                pageCount === 0 
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>

            <button 
              onClick={handleBuyNowClick} 
              disabled={pageCount === 0 || isScanning} 
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                pageCount === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
              }`}
            >
              Proceed <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrintCalculator;