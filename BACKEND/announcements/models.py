from db import get_connection
from datetime import datetime

DEFAULT_ANNOUNCEMENTS = {
    "title": "ANNOUNCEMENTS",
    "announcements": [
        {
            "title": "Upcoming UDSM Research Week Exhibition on how ICT has changed Legal access in Tanzania, - 2025",
            "description": "Join us for an insightful exhibition showcasing the impact of ICT on legal access in Tanzania at the UDSM Research Week.",
            "date": {
                "day": "19",
                "month": "MAY",
                "year": "2025"
            },
            "isNew": True,
            "status": "active"
        },
        {
            "title": "Invitation to ICT training on the use of chatbot systems in legal assistance, 2025",
            "description": "Learn how to effectively utilize chatbot systems for legal assistance in this comprehensive ICT training session.",
            "date": {
                "day": "05",
                "month": "MAY",
                "year": "2025"
            },
            "isNew": True,
            "status": "active"
        },
        {
            "title": "Official inaguration of CLC Chatbot System at Kibaha District Council - Dec 2023",
            "description": "Witness the launch of our innovative CLC Chatbot System at Kibaha District Council, marking a new era in legal assistance.",
            "date": {
                "day": "18",
                "month": "DEC",
                "year": "2023"
            },
            "isNew": False,
            "status": "active"
        }
    ]
}

def get_all_announcements():
    """Get all announcements or return defaults if none exist"""
    conn = get_connection()
    c = conn.cursor()
    
    c.execute("SELECT * FROM announcements WHERE status = 'active' ORDER BY year DESC, month DESC, day DESC")
    announcements = c.fetchall()
    
    if announcements:
        announcements_list = []
        for announcement in announcements:
            announcements_list.append({
                "id": announcement[0],
                "title": announcement[1],
                "description": announcement[2],
                "date": {
                    "day": announcement[3],
                    "month": announcement[4],
                    "year": announcement[5]
                },
                "isNew": bool(announcement[6]),
                "status": announcement[7],
                "created_at": announcement[8],
                "updated_at": announcement[9]
            })
    else:
        # Use default announcements
        announcements_list = []
        for i, announcement in enumerate(DEFAULT_ANNOUNCEMENTS["announcements"], 1):
            announcements_list.append({
                "id": i,
                "title": announcement["title"],
                "description": announcement["description"],
                "date": announcement["date"],
                "isNew": announcement["isNew"],
                "status": "active",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })
    
    conn.close()
    return {
        "title": "ANNOUNCEMENTS",
        "announcements": announcements_list
    }

def add_announcement(title, description, day, month, year, is_new=True, status="active"):
    """Add a new announcement"""
    conn = get_connection()
    c = conn.cursor()
    
    c.execute("""
        INSERT INTO announcements (
            title, description, day, month, year, is_new, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (title, description, day, month, year, is_new, status))
    
    announcement_id = c.lastrowid
    
    conn.commit()
    conn.close()
    return announcement_id

def update_announcement(announcement_id, title, description, day, month, year, is_new, status):
    """Update an existing announcement"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    c.execute("""
        UPDATE announcements 
        SET title=?, description=?, day=?, month=?, year=?, is_new=?, status=?, updated_at=?
        WHERE id=?
    """, (title, description, day, month, year, is_new, status, now, announcement_id))
    
    conn.commit()
    conn.close()

def delete_announcement(announcement_id):
    """Delete an announcement"""
    conn = get_connection()
    c = conn.cursor()
    
    c.execute("DELETE FROM announcements WHERE id=?", (announcement_id,))
    
    conn.commit()
    conn.close()

def toggle_announcement_status(announcement_id, status):
    """Toggle the status of an announcement"""
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    
    c.execute("""
        UPDATE announcements 
        SET status=?, updated_at=?
        WHERE id=?
    """, (status, now, announcement_id))
    
    conn.commit()
    conn.close() 