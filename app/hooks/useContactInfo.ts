import { useState, useEffect } from "react";

export interface ContactItem {
  id: number;
  label: string;
  value: string | null;
  isMain: boolean;
  isAddress: boolean;
  isContact: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactData {
  id: number | null;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: ContactItem[];
}

export interface UseContactInfoReturn {
  loading: boolean;
  error: string | null;
  contactData: ContactData | null;
  mainContact: ContactItem | undefined;
  addressItems: ContactItem[];
  contactItems: ContactItem[];
  refetch: () => Promise<void>;
}

export default function useContactInfo(): UseContactInfoReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  async function fetchContactInfo() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/footer");
      if (!response.ok) throw new Error("Failed to fetch contact data");
      
      const result = await response.json();
      setContactData(result.contactUs);
    } catch (err) {
      console.error("Error fetching contact info:", err);
      setError("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContactInfo();
  }, []);

  // Derived contact information
  const mainContact = contactData?.items.find(item => item.isMain);
  const addressItems = contactData?.items.filter(item => item.isAddress) || [];
  const contactItems = contactData?.items.filter(item => item.isContact) || [];

  return {
    loading,
    error,
    contactData,
    mainContact,
    addressItems,
    contactItems,
    refetch: fetchContactInfo
  };
} 