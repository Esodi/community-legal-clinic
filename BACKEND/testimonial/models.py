import sqlite3
from db import get_connection

# It's often better to centralize DB configuration, but for now,
# we'll define it here. Assumes the same DB file as services.
DB = 'services.db'

def init_db():
    """Initializes the testimonials table if it doesn't exist."""
    conn = get_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT,
            text TEXT NOT NULL,
            image TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("Testimonials table initialized.") # Optional: Add feedback

def add_testimonial(name, location, text, image, status):
    """Adds a new testimonial to the database."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("INSERT INTO testimonials (name, location, text, image, status) VALUES (?, ?, ?, ?, ?)",
              (name, location, text, image, status))
    testimonial_id = c.lastrowid
    conn.commit()
    conn.close()
    return testimonial_id

def get_all_testimonials():
    """Retrieves all testimonials and formats them as requested."""
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, name, location, text, image, status FROM testimonials WHERE status = 'active'")
    testimonials_raw = c.fetchall()
    conn.close()

    testimonials_list = [dict(row) for row in testimonials_raw]
    
    # If no testimonials in database, return default data
    if not testimonials_list:
        testimonials_list = [
            {
                "id": 1,
                "name": "Advocate Johnson Laiton",
                "location": "Dar es Salaam",
                "text": "Joining the Community Legal Clinic platform gave me access to international clients looking for legitimate partnerships in Tanzania's mining sector. The system is transparent, well-organized, and the compliance it helped me grow my practice and assist in sustainable development.",
                "image": "/testimonials/client1.jpg"
            },
            {
                "id": 2,
                "name": "Samuel K.",
                "location": "Dar es Salaam",
                "text": "I needed to legally change my name, and the CLC platform made it incredibly straightforward. I was connected to a successful legal practitioner who guided me through. They drafted the deed poll quickly and professionally within the same day, and it was submitted for registration with the Ministry of Legal Affairs. The entire process would be fully completed within a week. Seamless, reliable, and very efficient.",
                "image": "/testimonials/client2.jpg"
            },
            {
                "id": 3,
                "name": "Zhang Wei & Joseph M.",
                "location": "Sino-Tanzania Mining Partners",
                "text": "Navigating Tanzania's mining regulations as a foreign investor seemed daunting—until I discovered the CLC platform. Their licensed legal practitioners who handled the entire registration process with the Mining Commission efficiently. Within weeks, we had all the permits we needed to begin operations. Invaluable support!",
                "image": "/testimonials/client3.jpg"
            }
        ]

    return {
        "title": "Trusted by 4000+ Clients since 2024",
        "subtitle": "We have a reputation for helping clients around the world find success on their most important projects",
        "testimonials": testimonials_list
    }

def update_testimonial(testimonial_id, name, location, text, image, status):
    """Updates an existing testimonial."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("UPDATE testimonials SET name=?, location=?, text=?, image=?, status=? WHERE id=?",
              (name, location, text, image, status, testimonial_id))
    conn.commit()
    conn.close()
    # Consider returning status or checking rowcount

def delete_testimonial(testimonial_id):
    """Deletes a testimonial from the database."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("DELETE FROM testimonials WHERE id=?", (testimonial_id,))
    conn.commit()
    conn.close()
    # Consider returning status or checking rowcount

# Note: You'll need to call init_db() once somewhere in your application's
# startup sequence to ensure the table exists before you try to use it.
# For example, in your main application file or a setup script. 