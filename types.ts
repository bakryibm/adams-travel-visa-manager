

export enum VisaDuration {
  DAYS_10 = 10,
  DAYS_15 = 15,
  DAYS_30 = 30,
}

export enum VisaStatus {
  PENDING_ENTRY = 'PENDING_ENTRY', // Purchased but hasn't entered Oman yet
  ACTIVE = 'ACTIVE',               // Inside Oman, time ticking
  EXPIRED = 'EXPIRED',             // Overstayed
  CLOSED = 'CLOSED',               // Left the country
  VOID = 'VOID',                   // 90 days passed without entry
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  passportNumber?: string;
}

export interface VisaRecord {
  id: string;
  visaNumber: string;
  customerId: string;
  duration: VisaDuration;
  status: VisaStatus;
  purchaseDate: string; // System Creation Date (ISO)
  issueDate?: string;   // Actual Visa Issue Date (ISO)
  entryDate?: string;   // ISO Date string
  expiryDate?: string;  // ISO Date string
  renewalCount: number; // 0 to 4
  notes?: string;
  price: number; // In OMR
}

// For UI combining Customer and Visa
export interface FullVisaDetails extends VisaRecord {
  customerName: string;
  customerPhone: string;
  customerPassport?: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
}