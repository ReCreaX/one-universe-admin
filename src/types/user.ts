// userManagementStore.ts or relevant file

// Define all possible field variations that backend might return
export interface UserType {
  id: string;
  name: string;
  email: string;

  // Wallet variations
  wallet?: any;
  Wallet?: any;

  // Profile variations
  profile?: any;
  sellerProfile?: any;

  // Panic contacts variations
  panicContacts?: any[];
  PanicContact?: any[];  // backend sometimes uses this

  // Job documents variations
  jobDocuments?: any[];
  JobDocument?: any[];   // backend sometimes uses this

  // Common fields
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;

  // This allows any extra fields (including ones we missed)
  // Must come AFTER all known properties
  [key: string]: any;
}

