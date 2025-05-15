import sqlite3
from db import get_connection

def add_how(title, subtitle, steps, status="active"):
    """Adds a new how section to the database."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Start transaction
        c.execute("BEGIN TRANSACTION")
        
        # Insert how data
        c.execute("""
            INSERT INTO how (title, subtitle, status, created_at, updated_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """, (title, subtitle, status))
        
        how_id = c.lastrowid
        
        # Insert steps
        for step in steps:
            c.execute("""
                INSERT INTO how_steps (how_id, step_id, title, description, icon) 
                VALUES (?, ?, ?, ?, ?)
            """, (how_id, step['id'], step['title'], step['description'], step['icon']))
        
        conn.commit()
        return how_id
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def get_all_hows():
    """Retrieves all how sections with their steps."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Get all how data
        c.execute("SELECT * FROM how ORDER BY id DESC WHERE status = 'active'")
        hows = c.fetchall()
        
        results = []
        for how in hows:
            how_id = how[0]
            # Get steps for this how section
            c.execute("""
                SELECT step_id, title, description, icon 
                FROM how_steps 
                WHERE how_id=? 
                ORDER BY step_id
            """, (how_id,))
            steps = [
                {
                    "id": row[0],
                    "title": row[1],
                    "description": row[2],
                    "icon": row[3]
                } 
                for row in c.fetchall()
            ]
            
            results.append({
                "id": how_id,
                "title": how[1],
                "subtitle": how[2],
                "status": how[3],
                "steps": steps,
                "created_at": how[4],
                "updated_at": how[5]
            })
        
        return results
    finally:
        conn.close()

def get_how():
    """Retrieves the latest how section data."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Get how data
        c.execute("SELECT * FROM how WHERE status = 'active' ORDER BY id DESC LIMIT 1")
        how = c.fetchone()
        
        if not how:
            return None
        
        # Get steps for this how section
        c.execute("""
            SELECT step_id, title, description, icon 
            FROM how_steps 
            WHERE how_id=? 
            ORDER BY step_id
        """, (how[0],))
        steps = [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "icon": row[3]
            } 
            for row in c.fetchall()
        ]
        
        return {
            "id": how[0],
            "title": how[1],
            "subtitle": how[2],
            "status": how[3],
            "steps": steps,
            "created_at": how[4],
            "updated_at": how[5]
        }
    finally:
        conn.close()

def update_how(how_id, title, subtitle, steps, status):
    """Updates an existing how section."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Start transaction
        c.execute("BEGIN TRANSACTION")
        
        # Verify how exists
        c.execute("SELECT id FROM how WHERE id=?", (how_id,))
        if not c.fetchone():
            raise ValueError(f"How section with ID {how_id} not found")
        
        # Update how data
        c.execute("""
            UPDATE how 
            SET title=?, subtitle=?, status=?, updated_at=CURRENT_TIMESTAMP 
            WHERE id=?
        """, (title, subtitle, status, how_id))
        
        # Delete existing steps
        c.execute("DELETE FROM how_steps WHERE how_id=?", (how_id,))
        
        # Insert new steps
        for step in steps:
            c.execute("""
                INSERT INTO how_steps (how_id, step_id, title, description, icon) 
                VALUES (?, ?, ?, ?, ?)
            """, (how_id, step['id'], step['title'], step['description'], step['icon']))
        
        # Commit transaction
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def delete_how(how_id):
    """Deletes a how section."""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Start transaction
        c.execute("BEGIN TRANSACTION")
        
        # Delete steps first due to foreign key constraint
        c.execute("DELETE FROM how_steps WHERE how_id=?", (how_id,))
        c.execute("DELETE FROM how WHERE id=?", (how_id,))
        
        # Commit transaction
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        raise
    finally:
        conn.close() 