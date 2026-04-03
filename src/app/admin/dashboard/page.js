'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Users, ShoppingBag, Search, RefreshCw, LogOut, Loader2, CheckCircle, Package, Archive, AlertCircle, Power, MessageCircle } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({}); 
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ income: 0, orders: 0, visitors: 0 });
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'requests'
  
  // --- STORE STATUS STATE ---
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [togglingStore, setTogglingStore] = useState(false);
  
  // Loading states for specific actions
  const [updatingOrderId, setUpdatingOrderId] = useState(null); 
  const [togglingItemId, setTogglingItemId] = useState(null);

  // --- CONFIGURATION ---
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxUS5VtmFdpgOheTM2Ghozl_JCE0c5nNVoHamJRnaQ0lHLytvwlTe835VEtR6O2sw/exec'; 

  // Products to manage
  const MANAGED_PRODUCTS = [
    { id: 'lab_record', name: "BIT Lab Record" },
    { id: 'bit_notebook', name: "BIT Notebook" },
    { id: 'pink_book', name: "Pink Book" },
    { id: 'blue_book', name: "Blue Book" },
    { id: 'pen', name: "Ball Pen" },
    { id: 'data_sheet', name: "Data Sheets" },
    { id: 'cello_tape', name: "Cellophane Tape" },
    { id: 'double_tape', name: "Double Side Tape" },
    { id: 'stapler', name: "Stapler" },
    { id: 'stapler_pins', name: "Stapler Pins" },
    { id: 'fevicol', name: "Fevicol (Small)" }
  ];

  // --- INITIALIZATION ---
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
        router.push('/admin');
        return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchInventory(), fetchStoreStatus(), fetchRequests()]);
    setLoading(false);
  };

  // --- API CALLS ---
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${GOOGLE_SHEET_URL}?action=getAllOrders`);
      const json = await res.json();
      if (json.status === 'success') {
        setOrders(json.data);
        calculateStats(json.data);
      }
    } catch (err) { console.error("Failed to fetch orders", err); }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${GOOGLE_SHEET_URL}?action=getInventory`);
      const json = await res.json();
      if (json.status === 'success') setInventory(json.data);
    } catch (err) { console.error("Failed to fetch inventory", err); }
  };

  const fetchStoreStatus = async () => {
    try {
      const res = await fetch(`${GOOGLE_SHEET_URL}?action=getStoreStatus`);
      const json = await res.json();
      if (json.status === 'success') setIsStoreOpen(json.isOpen);
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
        const res = await fetch(`${GOOGLE_SHEET_URL}?action=getRequests`);
        const json = await res.json();
        if (json.status === 'success') setRequests(json.data);
    } catch(err) { console.error(err); }
  };

  const calculateStats = (data) => {
    const totalIncome = data.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    setStats({
      income: totalIncome,
      orders: data.length,
      visitors: data.length * 3 + 12 
    });
  };

  // --- LIVE COUNTERS LOGIC ---
  const pendingOrdersCount = orders.filter(o => o.status === 'Placed').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;

  // --- HANDLERS ---

  // 1. Toggle Store Open/Closed
  const handleToggleStoreStatus = async () => {
    const newStatus = !isStoreOpen;
    setIsStoreOpen(newStatus); 
    setTogglingStore(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: "setStoreStatus", isOpen: newStatus })
      });
    } catch (err) {
      alert("Failed to update store status");
      setIsStoreOpen(!newStatus); 
    } finally {
      setTogglingStore(false);
    }
  };

  // 2. Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: "updateStatus",
                orderId: orderId,
                newStatus: newStatus
            })
        });
    } catch (error) {
        alert("Failed to update status.");
        fetchOrders(); 
    } finally {
        setTimeout(() => setUpdatingOrderId(null), 500);
    }
  };

  // 3. Toggle Inventory Stock
  const handleToggleStock = async (id, name, currentStatus) => {
    const newStatus = !currentStatus;
    setTogglingItemId(id);
    try {
        setInventory(prev => ({ ...prev, [id]: newStatus }));
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: "toggleStock",
                id: id,
                name: name,
                inStock: newStatus
            })
        });
    } catch (error) {
        alert("Failed to update inventory.");
        fetchInventory(); 
    } finally {
        setTogglingItemId(null);
    }
  };

  // 4. Mark Request as Contacted
  const handleMarkContacted = async (item, phone) => {
    const message = `Hello! Regarding your request for "${item}" on Namma Mitra. It is available/unavailable. The price is...`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');

    try {
        setRequests(prev => prev.map(r => (r.itemName === item && r.phone === phone) ? { ...r, status: "Contacted" } : r));
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "updateRequestStatus", itemName: item, phone: phone, newStatus: "Contacted" })
        });
    } catch(err) {}
  };

  // 5. Contact Student for Order
  const handleContactOrder = (order) => {
    const message = `Hello ${order.name}, this is regarding your order *${order.order_id}* on Namma Mitra. \n\nCurrent Status: *${order.status || 'Placed'}*.\nWe are contacting you regarding the delivery to *${order.location || 'your location'}*.`;
    window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    router.push('/admin');
  };

  const filteredOrders = orders.filter(order => 
    order.order_id.toLowerCase().includes(search.toLowerCase()) || 
    order.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Navbar */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg tracking-wide">Admin Panel</span>
        </div>

        {/* --- STORE STATUS TOGGLE --- */}
        <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isStoreOpen ? 'text-green-400' : 'text-red-400'}`}>
                {isStoreOpen ? 'Store Open' : 'Store Closed'}
            </span>
            <button 
                onClick={handleToggleStoreStatus}
                disabled={togglingStore}
                className={`w-10 h-5 rounded-full relative transition-colors ${isStoreOpen ? 'bg-green-500' : 'bg-red-500'}`}
            >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isStoreOpen ? 'left-6' : 'left-1'}`}></div>
            </button>
        </div>

        <button onClick={handleLogout} className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2">
            <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Revenue" value={`₹${stats.income.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
            <StatCard title="Total Orders" value={stats.orders} icon={ShoppingBag} color="bg-blue-500" />
            <StatCard title="Total Visitors" value={stats.visitors} icon={Users} color="bg-orange-500" />
        </div>

        {/* Tab Switcher with Badges */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-200">
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                Orders
                {pendingOrdersCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        {pendingOrdersCount}
                    </span>
                )}
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                Inventory
            </button>
            <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                Student Requests
                {pendingRequestsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        {pendingRequestsCount}
                    </span>
                )}
            </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Live Orders</h2>
                        <p className="text-xs text-slate-400">Update status to notify students instantly.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search ID or Name..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-blue-500 w-full md:w-64"
                            />
                        </div>
                        <button onClick={fetchAllData} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status (Live)</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-slate-400">No orders found.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.order_id} className={`hover:bg-slate-50/50 transition-colors ${order.status === 'Placed' ? 'bg-blue-50/30' : ''}`}>
                                        <td className="p-4 font-mono font-bold text-slate-800">{order.order_id}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{order.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{order.phone}</p>
                                        </td>
                                        <td className="p-4 max-w-xs truncate" title={order.details}>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold mr-2 ${order.details.includes('ACADEMIC') ? 'bg-indigo-100 text-indigo-700' : (order.details.includes('STORE') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700')}`}>
                                                {order.details.includes('ACADEMIC') ? 'ACADEMIC' : (order.details.includes('STORE') ? 'STORE' : 'PRINT')}
                                            </span>
                                            {order.details.split(' ')[0].replace(/【|】/g,'')}...
                                        </td>
                                        <td className="p-4 font-bold">₹{order.amount}</td>
                                        <td className="p-4">
                                            <div className="relative w-40">
                                                {updatingOrderId === order.order_id && (
                                                    <div className="absolute right-8 top-2.5 z-10">
                                                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                                    </div>
                                                )}
                                                <select 
                                                    value={order.status || 'Placed'}
                                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                                    disabled={updatingOrderId === order.order_id}
                                                    className={`w-full p-2 rounded-lg font-bold text-xs border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                        order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        order.status === 'Ready' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    <option>Placed</option>
                                                    <option>Processing</option>
                                                    <option>Ready</option>
                                                    <option>Out for Delivery</option>
                                                    <option>Completed</option>
                                                    <option>Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleContactOrder(order)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                                            >
                                                <MessageCircle className="w-3 h-3" /> WhatsApp
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* TAB 2: INVENTORY CONTROL */}
        {activeTab === 'inventory' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 animate-fade-in-up">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Inventory Control</h2>
                        <p className="text-xs text-slate-400">Live sync with Student Shop.</p>
                    </div>
                    <button onClick={fetchInventory} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MANAGED_PRODUCTS.map((item) => {
                            const isInStock = inventory[item.id] !== false;
                            const isToggling = togglingItemId === item.id;

                            return (
                                <div key={item.id} className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${isInStock ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl shadow-sm ${isInStock ? 'bg-orange-50 text-orange-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className={`font-bold block ${isInStock ? 'text-slate-800' : 'text-slate-500'}`}>{item.name}</span>
                                            <span className={`text-[10px] font-bold ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                                                {isInStock ? 'IN STOCK' : 'UNAVAILABLE'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        {isToggling && <Loader2 className="w-4 h-4 animate-spin text-slate-400 absolute right-12 top-1" />}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={isInStock}
                                                disabled={isToggling}
                                                onChange={() => handleToggleStock(item.id, item.name, isInStock)} 
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* TAB 3: STUDENT REQUESTS */}
        {activeTab === 'requests' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Student Requests</h2>
                        <p className="text-xs text-slate-400">Custom item inquiries from the Store.</p>
                    </div>
                    <button onClick={fetchRequests} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Item Name</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-slate-400">No pending requests.</td></tr>
                            ) : (
                                requests.map((req, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${req.status === 'Pending' ? 'bg-orange-50/30' : ''}`}>
                                        <td className="p-4 font-mono text-xs text-slate-500">{new Date(req.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-slate-800">{req.itemName}</td>
                                        <td className="p-4 font-bold">{req.quantity}</td>
                                        <td className="p-4 font-mono text-xs">{req.phone}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${req.status === 'Contacted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleMarkContacted(req.itemName, req.phone)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                                            >
                                                <MessageCircle className="w-3 h-3" /> WhatsApp
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-slate-200`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);