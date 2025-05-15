"use client"

import useContactInfo from "@/app/hooks/useContactInfo"

export default function ContactDisplay() {
  const { 
    loading, 
    error, 
    contactData, 
    mainContact, 
    addressItems, 
    contactItems 
  } = useContactInfo()

  if (loading) {
    return <div>Loading contact information...</div>
  }

  if (error || !contactData) {
    return <div>Error: {error || "Unable to load contact information"}</div>
  }

  return (
    <div className="contact-display">
      <h2 className="text-xl font-bold mb-4">{contactData.title}</h2>
      
      {/* Main company name */}
      {mainContact && (
        <div className="main-contact mb-2">
          <h3 className="font-semibold">{mainContact.label}</h3>
        </div>
      )}
      
      {/* Address block */}
      {addressItems.length > 0 && (
        <div className="address-block mb-4">
          {addressItems.map(item => (
            <p key={item.id} className="text-sm">
              {item.label}
            </p>
          ))}
        </div>
      )}
      
      {/* Contact methods */}
      {contactItems.length > 0 && (
        <div className="contact-methods">
          {contactItems.map(item => (
            <div key={item.id} className="flex items-center gap-2 text-sm mb-1">
              <span className="font-medium">{item.label}:</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 