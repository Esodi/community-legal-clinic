from db import get_connection
from datetime import datetime
from service.models import get_all_services

DEFAULT_COMPANY_DETAILS = {
    "aboutUs": {
        "title": "ABOUT US",
        "description": "CLC is a trusted Tanzanian legal service provider connecting clients to licensed experts via WhatsApp. Through our LegalBridge Platform, we offer fast, professional support across various legal services making access to legal help easier, affordable, and available across Tanzania and beyond."
    },
    "contactUs": {
        "title": "CONTACT US",
        "items": [
            {
                "label": "Community Legal Clinic (CLC)",
                "isMain": True
            },
            {
                "label": "Dar es Salaam,",
                "isAddress": True
            },
            {
                "label": "",
                "isAddress": True
            },
            {
                "label": "P. O. Box 4661,",
                "isAddress": True
            },
            {
                "label": "TANZANIA.",
                "isAddress": True
            },
            {
                "label": "Email",
                "value": "info@clc.tz",
                "isContact": True
            },
            {
                "label": "Phone",
                "value": "+255 745 118 253",
                "isContact": True
            }
        ]
    },
    "ourServices": {
        "title": "OUR SERVICES",
        "items": [
            {
                "label": "",
                "href": "#services"
            },
            {
                "label": "",
                "href": "#services"
            },
            {
                "label": "",
                "href": "#services"
            },
            {
                "label": "",
                "href": "#services"
            },
            {
                "label": "",
                "href": "#services"
            },
            {
                "label": "",
                "href": "#services"
            }
        ]
    },
    "usefulLinks": {
        "title": "USEFUL LINKS",
        "items": [
            {
                "label": "About Us",
                "href": "#about"
            },
            {
                "label": "Our Services",
                "href": "#services"
            },
            {
                "label": "Testimonials",
                "href": "#testimonials"
            },
            {
                "label": "Book Consultation",
                "href": "https://shorturl.at/EMOCr"
            },
            {
                "label": "Chat with Expert",
                "href": "https://shorturl.at/UJAb8"
            }
        ]
    },
    "socialLinks": [
        {
            "platform": "whatsapp",
            "url": "https://wa.me/255745118253",
            "icon": "FaWhatsapp",
            "ariaLabel": "Chat with Legal Expert on WhatsApp"
        },
        {
            "platform": "twitter",
            "url": "https://twitter.com/communitylegalclinic",
            "icon": "FaTwitter",
            "ariaLabel": "Follow us on Twitter"
        },
        {
            "platform": "facebook",
            "url": "https://facebook.com/communitylegalclinic",
            "icon": "FaFacebook",
            "ariaLabel": "Like us on Facebook"
        },
        {
            "platform": "youtube",
            "url": "https://youtube.com/communitylegalclinic",
            "icon": "FaYoutube",
            "ariaLabel": "Subscribe to our YouTube channel"
        }
    ]
}

def get_company_details():
    """Get all company details or return defaults if not set"""
    conn = get_connection()
    c = conn.cursor()
    
    # Get about us
    c.execute("SELECT * FROM about_us ORDER BY id DESC LIMIT 1")
    about_us = c.fetchone()
    about_us_data = {
        "id": about_us[0] if about_us else None,
        "title": about_us[1] if about_us else DEFAULT_COMPANY_DETAILS["aboutUs"]["title"],
        "description": about_us[2] if about_us else DEFAULT_COMPANY_DETAILS["aboutUs"]["description"],
        "status": about_us[3] if about_us else "active",
        "created_at": about_us[4] if about_us else datetime.now().isoformat(),
        "updated_at": about_us[5] if about_us else datetime.now().isoformat()
    }

    # Get contact us
    c.execute("SELECT * FROM contact_us ORDER BY id DESC LIMIT 1")
    contact_us = c.fetchone()
    contact_items = []
    if contact_us:
        c.execute("SELECT * FROM contact_items WHERE contact_id=?", (contact_us[0],))
        items = c.fetchall()
        for item in items:
            contact_items.append({
                "id": item[0],
                "label": item[2],
                "value": item[3] if item[3] else None,
                "isMain": bool(item[4]),
                "isAddress": bool(item[5]),
                "isContact": bool(item[6]),
                "status": item[7],
                "created_at": item[8],
                "updated_at": item[9]
            })
    else:
        # Use default items
        for i, item in enumerate(DEFAULT_COMPANY_DETAILS["contactUs"]["items"], 1):
            contact_items.append({
                "id": i,
                "label": item["label"],
                "value": item.get("value"),
                "isMain": bool(item.get("isMain", 0)),
                "isAddress": bool(item.get("isAddress", 0)),
                "isContact": bool(item.get("isContact", 0)),
                "status": "active",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })

    contact_us_data = {
        "id": contact_us[0] if contact_us else None,
        "title": contact_us[1] if contact_us else DEFAULT_COMPANY_DETAILS["contactUs"]["title"],
        "status": contact_us[2] if contact_us else "active",
        "created_at": contact_us[3] if contact_us else datetime.now().isoformat(),
        "updated_at": contact_us[4] if contact_us else datetime.now().isoformat(),
        "items": contact_items
    }

    # Get our services
    services_data = get_all_services()
    our_services_items = []
    if services_data["packages"]:
        for service in services_data["packages"]:
            our_services_items.append({
                "id": service["id"],
                "label": service["title"],
                "href": "#services",
                "status": service.get("status", "active"),
                "created_at": service.get("created_at", datetime.now().isoformat()),
                "updated_at": service.get("updated_at", datetime.now().isoformat())
            })
    else:
        # Use default items
        for i, item in enumerate(DEFAULT_COMPANY_DETAILS["ourServices"]["items"], 1):
            our_services_items.append({
                "id": i,
                "label": item["label"],
                "href": item["href"],
                "status": "active",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })

    our_services_data = {
        "title": "OUR SERVICE PACKAGES",
        "items": our_services_items
    }

    # Get useful links
    c.execute("SELECT * FROM useful_links ORDER BY id DESC LIMIT 1")
    useful_links = c.fetchone()
    useful_items = []
    if useful_links:
        c.execute("SELECT * FROM useful_link_items WHERE useful_links_id=?", (useful_links[0],))
        items = c.fetchall()
        for item in items:
            useful_items.append({
                "id": item[0],
                "label": item[2],
                "href": item[3],
                "status": item[4],
                "created_at": item[5],
                "updated_at": item[6]
            })
    else:
        # Use default items
        for i, item in enumerate(DEFAULT_COMPANY_DETAILS["usefulLinks"]["items"], 1):
            useful_items.append({
                "id": i,
                "label": item["label"],
                "href": item["href"],
                "status": "active",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })

    useful_links_data = {
        "id": useful_links[0] if useful_links else None,
        "title": useful_links[1] if useful_links else DEFAULT_COMPANY_DETAILS["usefulLinks"]["title"],
        "status": useful_links[2] if useful_links else "active",
        "created_at": useful_links[3] if useful_links else datetime.now().isoformat(),
        "updated_at": useful_links[4] if useful_links else datetime.now().isoformat(),
        "items": useful_items
    }

    # Get social links
    c.execute("SELECT * FROM social_links")
    social_links = c.fetchall()
    social_links_data = []
    if social_links:
        for link in social_links:
            social_links_data.append({
                "id": link[0],
                "platform": link[1],
                "url": link[2],
                "icon": link[3],
                "ariaLabel": link[4],
                "status": link[5],
                "created_at": link[6],
                "updated_at": link[7]
            })
    else:
        # Use default items
        for i, link in enumerate(DEFAULT_COMPANY_DETAILS["socialLinks"], 1):
            social_links_data.append({
                "id": i,
                "platform": link["platform"],
                "url": link["url"],
                "icon": link["icon"],
                "ariaLabel": link["ariaLabel"],
                "status": "active",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })

    conn.close()
    return {
        "aboutUs": about_us_data,
        "contactUs": contact_us_data,
        "ourServices": our_services_data,
        "usefulLinks": useful_links_data,
        "socialLinks": social_links_data
    }

def update_about_us(title, description):
    """Update about us section"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    c.execute("SELECT id FROM about_us ORDER BY id DESC LIMIT 1")
    existing = c.fetchone()
    
    if existing:
        c.execute("""
            UPDATE about_us 
            SET title=?, description=?, updated_at=? 
            WHERE id=?
        """, (title, description, now, existing[0]))
    else:
        c.execute("""
            INSERT INTO about_us (title, description, status, created_at, updated_at)
            VALUES (?, ?, 'active', ?, ?)
        """, (title, description, now, now))
    
    conn.commit()
    conn.close()

def update_contact_us(title, items):
    """Update contact us section"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    c.execute("SELECT id FROM contact_us ORDER BY id DESC LIMIT 1")
    existing = c.fetchone()
    
    if existing:
        contact_id = existing[0]
        c.execute("""
            UPDATE contact_us 
            SET title=?, updated_at=? 
            WHERE id=?
        """, (title, now, contact_id))
    else:
        c.execute("""
            INSERT INTO contact_us (title, status, created_at, updated_at)
            VALUES (?, 'active', ?, ?)
        """, (title, now, now))
        contact_id = c.lastrowid
    
    # Update items
    c.execute("DELETE FROM contact_items WHERE contact_id=?", (contact_id,))
    for item in items:
        # Convert boolean values to 1/0 for SQLite storage
        is_main = 1 if item.get("isMain", False) else 0
        is_address = 1 if item.get("isAddress", False) else 0
        is_contact = 1 if item.get("isContact", False) else 0
        
        c.execute("""
            INSERT INTO contact_items (
                contact_id, label, value, is_main, is_address, is_contact,
                status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
        """, (
            contact_id, item["label"], item.get("value"), 
            is_main, is_address, is_contact, now, now
        ))
    
    conn.commit()
    conn.close()

def update_useful_links(title, items):
    """Update useful links section"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    c.execute("SELECT id FROM useful_links ORDER BY id DESC LIMIT 1")
    existing = c.fetchone()
    
    if existing:
        links_id = existing[0]
        c.execute("""
            UPDATE useful_links 
            SET title=?, updated_at=? 
            WHERE id=?
        """, (title, now, links_id))
    else:
        c.execute("""
            INSERT INTO useful_links (title, status, created_at, updated_at)
            VALUES (?, 'active', ?, ?)
        """, (title, now, now))
        links_id = c.lastrowid
    
    # Update items
    c.execute("DELETE FROM useful_link_items WHERE useful_links_id=?", (links_id,))
    for item in items:
        c.execute("""
            INSERT INTO useful_link_items (
                useful_links_id, label, href, status, created_at, updated_at
            )
            VALUES (?, ?, ?, 'active', ?, ?)
        """, (links_id, item["label"], item["href"], now, now))
    
    conn.commit()
    conn.close()

def update_social_links(links):
    """Update social links"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    # Clear existing links
    c.execute("DELETE FROM social_links")
    
    # Insert new links
    for link in links:
        c.execute("""
            INSERT INTO social_links (
                platform, url, icon, aria_label, status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, 'active', ?, ?)
        """, (
            link["platform"], link["url"], link["icon"],
            link["ariaLabel"], now, now
        ))
    
    conn.commit()
    conn.close() 