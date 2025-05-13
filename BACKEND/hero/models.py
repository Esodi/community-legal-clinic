import sqlite3
from db import get_connection

def add_hero(headline, subheadline, ctaText, userMessage, botResponse, userName, options, status):
    """Adds a new hero section to the database."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Insert hero data
        c.execute("""
            INSERT INTO hero (headline, subheadline, ctaText, userMessage, botResponse, userName, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (headline, subheadline, ctaText, userMessage, botResponse, userName, status))
        
        hero_id = c.lastrowid
        
        # Insert options
        for option in options:
            c.execute("""
                INSERT INTO hero_options (hero_id, text, icon) 
                VALUES (?, ?, ?)
            """, (hero_id, option['text'], option['icon']))
        
        conn.commit()
        return hero_id
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def get_all_heroes():
    """Retrieves all hero sections with their options."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Get all hero data
        c.execute("SELECT * FROM hero ORDER BY id DESC")
        heroes = c.fetchall()
        
        results = []
        for hero in heroes:
            hero_id = hero[0]
            # Get options for this hero
            c.execute("SELECT id, text, icon FROM hero_options WHERE hero_id=?", (hero_id,))
            options = [{"id": row[0], "text": row[1], "icon": row[2]} for row in c.fetchall()]
            
            results.append({
                "id": hero_id,
                "headline": hero[1],
                "subheadline": hero[2],
                "ctaText": hero[3],
                "status": hero[7],
                "chatData": {
                    "userMessage": hero[4],
                    "botResponse": hero[5],
                    "userName": hero[6],
                    "options": options
                }
            })
        
        return results
    finally:
        conn.close()

def get_hero():
    """Retrieves the hero section data."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Get hero data where status is active
        c.execute("SELECT * FROM hero WHERE status = 'active' ORDER BY id DESC LIMIT 1")
        hero = c.fetchone()
        
        if not hero:
            # Return default data if no hero exists
            return {
                "headline": "FACING A LEGAL ISSUE?",
                "subheadline": "Start on WhatsApp, chat with legal Experts, book a phone or Zoom meeting, then meet in person to complete your case.",
                "ctaText": "CHAT WITH LEGAL EXPERTS",
                "status": "active",
                "chatData": {
                    "userMessage": "Hi, I need legal Service Can you help?",
                    "botResponse": "Thanks for reaching out! Please choose the options below:",
                    "userName": "Emma",
                    "options": [
                        {
                            "id": 1,
                            "text": "Book an Appointment",
                            "icon": "calendar"
                        },
                        {
                            "id": 2,
                            "text": "Chat with Support",
                            "icon": "chat"
                        }
                    ]
                }
            }
        
        # Get options for this hero
        c.execute("SELECT id, text, icon FROM hero_options WHERE hero_id=?", (hero[0],))
        options = [{"id": row[0], "text": row[1], "icon": row[2]} for row in c.fetchall()]
        
        return {
            "id": hero[0],
            "headline": hero[1],
            "subheadline": hero[2],
            "ctaText": hero[3],
            "chatData": {
                "userMessage": hero[4],
                "botResponse": hero[5],
                "userName": hero[6],
                "options": options
            }
        }
    finally:
        conn.close()

def update_hero(hero_id, headline, subheadline, ctaText, userMessage, botResponse, userName, options, status):
    """Updates an existing hero section."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Start transaction
        c.execute("BEGIN TRANSACTION")
        
        # Verify hero exists
        c.execute("SELECT id FROM hero WHERE id=?", (hero_id,))
        if not c.fetchone():
            raise ValueError(f"Hero with ID {hero_id} not found")
        
        # Update hero data
        c.execute("""
            UPDATE hero 
            SET headline=?, subheadline=?, ctaText=?, userMessage=?, botResponse=?, userName=?, status=?, updated_at=CURRENT_TIMESTAMP 
            WHERE id=?
        """, (headline, subheadline, ctaText, userMessage, botResponse, userName, status, hero_id))
        
        # Delete existing options
        c.execute("DELETE FROM hero_options WHERE hero_id=?", (hero_id,))
        
        # Insert new options
        for option in options:
            c.execute("""
                INSERT INTO hero_options (hero_id, text, icon) 
                VALUES (?, ?, ?)
            """, (hero_id, option['text'], option['icon']))
        
        # Commit transaction
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def delete_hero(hero_id):
    """Deletes a hero section."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Start transaction
        c.execute("BEGIN TRANSACTION")
        
        # Delete options first due to foreign key constraint
        c.execute("DELETE FROM hero_options WHERE hero_id=?", (hero_id,))
        c.execute("DELETE FROM hero WHERE id=?", (hero_id,))
        
        # Commit transaction
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close() 