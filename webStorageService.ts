// Web Storage Service for browser environment
export interface Customer {
  id: string;
  name: string;
  phone: string;
  passportNumber: string;
  createdAt: number;
}

export interface Visa {
  id: string;
  customerId: string;
  type: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string;
  price: number;
  paid: boolean;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface CompanySettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  createdAt: number;
  updatedAt: number;
}

// Helper function to get data from localStorage with fallback
function getData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper function to save data to localStorage
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Customer functions
export function getCustomers(): Customer[] {
  return getData<Customer[]>('customers', []);
}

export function saveCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: generateId(),
    createdAt: Date.now()
  };
  saveData('customers', [...customers, newCustomer]);
  return newCustomer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): void {
  const customers = getCustomers();
  const updated = customers.map(customer => 
    customer.id === id ? { ...customer, ...updates } : customer
  );
  saveData('customers', updated);
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers();
  const updated = customers.filter(customer => customer.id !== id);
  saveData('customers', updated);
}

// Visa functions
export function getVisas(): Visa[] {
  return getData<Visa[]>('visas', []);
}

export function saveVisa(visa: Omit<Visa, 'id' | 'createdAt' | 'updatedAt'>): Visa {
  const visas = getVisas();
  const newVisa: Visa = {
    ...visa,
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  saveData('visas', [...visas, newVisa]);
  return newVisa;
}

export function updateVisa(id: string, updates: Partial<Visa>): void {
  const visas = getVisas();
  const updated = visas.map(visa => 
    visa.id === id ? { ...visa, ...updates, updatedAt: Date.now() } : visa
  );
  saveData('visas', updated);
}

export function deleteVisa(id: string): void {
  const visas = getVisas();
  const updated = visas.filter(visa => visa.id !== id);
  saveData('visas', updated);
}

// Company settings functions
export function getCompanySettings(): CompanySettings {
  return getData<CompanySettings>('companySettings', {
    name: 'أدمز ترافيل',
    phone: '',
    email: '',
    address: '',
    currency: 'OMR',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
}

export function saveCompanySettings(settings: Partial<CompanySettings>): void {
  const currentSettings = getCompanySettings();
  const updatedSettings = {
    ...currentSettings,
    ...settings,
    updatedAt: Date.now()
  };
  saveData('companySettings', updatedSettings);
}

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export types for use in other files
// Note: Types are already exported as interfaces above