
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VisaList from './components/VisaList';
import FinanceScreen from './components/FinanceScreen';
import SettingsScreen from './components/SettingsScreen';
import VisaFormModal from './components/VisaFormModal';
import { FullVisaDetails } from './types';
import { getCustomers, getVisas, getCompanySettings } from './webStorageService';
import { Plus, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<FullVisaDetails | null>(null);
  const [companyName, setCompanyName] = useState('أدمز ترافيل');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Application State
  const [fullData, setFullData] = useState<FullVisaDetails[]>([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Load Data
  useEffect(() => {
    const customers = getCustomers();
    const visas = getVisas();
    const settings = getCompanySettings();

    setCompanyName(settings.name);
    
    // Merge data for easier display
    const merged: FullVisaDetails[] = visas.map((visa: any) => {
      const customer = customers.find((c: any) => c.id === visa.customerId);
      return {
        ...visa,
        customerName: customer ? customer.name : 'غير معروف',
        customerPhone: customer ? customer.phone : '',
        customerPassport: customer ? customer.passportNumber : '',
      };
    }).reverse(); // Show newest first

    setFullData(merged);
  }, [lastRefresh]);

  const handleRefresh = () => {
    setLastRefresh(Date.now());
  };

  const openCreateModal = () => {
      setEditingVisa(null);
      setIsModalOpen(true);
  }

  const openEditModal = (visa: FullVisaDetails) => {
      setEditingVisa(visa);
      setIsModalOpen(true);
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        companyName={companyName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 line-clamp-1">
                        {activeTab === 'dashboard' ? 'لوحة التحكم' : 
                        activeTab === 'visas' ? 'إدارة التأشيرات' : 
                        activeTab === 'finance' ? 'الحسابات' : 'الإعدادات'}
                    </h1>
                    <p className="text-slate-500 text-xs hidden sm:block">
                        {new Date().toLocaleDateString('ar-OM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
            
            {activeTab !== 'settings' && (
                <button 
                    onClick={openCreateModal}
                    className="bg-omani-red hover:bg-red-700 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 text-sm md:text-base"
                >
                    <Plus size={20} />
                    <span className="font-bold hidden md:inline">تأشيرة جديدة</span>
                </button>
            )}
        </header>

        {/* Dynamic Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fadeIn pb-20 md:pb-8">
            {activeTab === 'dashboard' && <Dashboard visas={fullData} />}
            {activeTab === 'visas' && (
                <VisaList 
                    visas={fullData} 
                    onRefresh={handleRefresh} 
                    onEditVisa={openEditModal}
                />
            )}
            {activeTab === 'finance' && (
                <FinanceScreen visas={fullData} />
            )}
            {activeTab === 'settings' && (
                <SettingsScreen onSettingsChange={handleRefresh} />
            )}
        </div>
      </main>

      {/* Modals */}
      <VisaFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleRefresh}
        visaToEdit={editingVisa}
      />
    </div>
  );
};

export default App;
