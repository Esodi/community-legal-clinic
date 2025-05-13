import sqlite3
from pathlib import Path
from datetime import datetime
import shutil
import os
import json
import hashlib

# Database configuration
DB_NAME = 'clcorgtz.db'
DB_PATH = Path(__file__).parent / DB_NAME
BACKUP_DIR = Path(__file__).parent / 'backup'

# Define all table schemas in a central dictionary
TABLE_SCHEMAS = {
    'schema_versions': '''
        CREATE TABLE IF NOT EXISTS schema_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name TEXT NOT NULL,
            schema_hash TEXT NOT NULL,
            schema_definition TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'users': '''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive', 'deleted')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'tokens': '''
        CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            is_valid INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''',
    'services': '''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            videoThumbnail TEXT,
            videoUrl TEXT,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'offerings': '''
        CREATE TABLE IF NOT EXISTS offerings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_id INTEGER,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (service_id) REFERENCES services (id)
        )
    ''',
    'testimonials': '''
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT,
            text TEXT NOT NULL,
            image TEXT,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'hero': '''
        CREATE TABLE IF NOT EXISTS hero (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            headline TEXT NOT NULL,
            subheadline TEXT NOT NULL,
            ctaText TEXT NOT NULL,
            userMessage TEXT NOT NULL,
            botResponse TEXT NOT NULL,
            userName TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'hero_options': '''
        CREATE TABLE IF NOT EXISTS hero_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hero_id INTEGER,
            text TEXT NOT NULL,
            icon TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hero_id) REFERENCES hero (id)
        )
    ''',
    'about_us': '''
        CREATE TABLE IF NOT EXISTS about_us (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'contact_us': '''
        CREATE TABLE IF NOT EXISTS contact_us (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'contact_items': '''
        CREATE TABLE IF NOT EXISTS contact_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER NOT NULL,
            label TEXT NOT NULL,
            value TEXT,
            is_main BOOLEAN DEFAULT 0,
            is_address BOOLEAN DEFAULT 0,
            is_contact BOOLEAN DEFAULT 0,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contact_us (id)
        )
    ''',
    'useful_links': '''
        CREATE TABLE IF NOT EXISTS useful_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'useful_link_items': '''
        CREATE TABLE IF NOT EXISTS useful_link_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            useful_links_id INTEGER NOT NULL,
            label TEXT NOT NULL,
            href TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (useful_links_id) REFERENCES useful_links (id)
        )
    ''',
    'social_links': '''
        CREATE TABLE IF NOT EXISTS social_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT NOT NULL,
            aria_label TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'announcements': '''
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            day TEXT NOT NULL,
            month TEXT NOT NULL,
            year TEXT NOT NULL,
            is_new BOOLEAN DEFAULT 1,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'how': '''
        CREATE TABLE IF NOT EXISTS how (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subtitle TEXT NOT NULL,
            status TEXT CHECK(status IN ('active', 'pending','ongoing', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''',
    'how_steps': '''
        CREATE TABLE IF NOT EXISTS how_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            how_id INTEGER NOT NULL,
            step_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            icon TEXT NOT NULL,
            FOREIGN KEY (how_id) REFERENCES how(id)
        )
    ''',
}
# Define table dependencies (child -> parent relationships)
TABLE_DEPENDENCIES = {
    'tokens': ['users'],
    'offerings': ['services'],
    'hero_options': ['hero'],
    'contact_items': ['contact_us'],
    'useful_link_items': ['useful_links']
}

def backup_database():
    """Create a backup of the database with timestamp"""
    if not BACKUP_DIR.exists():
        BACKUP_DIR.mkdir()
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = BACKUP_DIR / f'clcorgtz_backup_{timestamp}.db'
    
    if DB_PATH.exists():
        shutil.copy2(DB_PATH, backup_path)
        print(f"Database backed up to {backup_path}")

def get_table_schema(cursor, table_name):
    """Get the schema of a table"""
    cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    result = cursor.fetchone()
    return result[0] if result else None

def calculate_schema_hash(schema_sql):
    """Calculate a hash of the schema SQL"""
    return hashlib.sha256(schema_sql.encode('utf-8')).hexdigest()

def check_schema_changes():
    """Check if there are schema changes in any table"""
    if not DB_PATH.exists():
        return True, []
    
    conn = get_connection()
    c = conn.cursor()
    
    changed_tables = []
    
    try:
        # Create schema_versions table if it doesn't exist
        c.execute(TABLE_SCHEMAS['schema_versions'])
        conn.commit()
        
        # Check each table's schema
        for table_name, expected_schema in TABLE_SCHEMAS.items():
            if table_name == 'schema_versions':
                continue
                
            # Clean up schema SQL for comparison
            expected_clean = ''.join(expected_schema.lower().split())
            expected_hash = calculate_schema_hash(expected_clean)
            
            # Get current schema version
            c.execute("""
                SELECT schema_hash 
                FROM schema_versions 
                WHERE table_name = ? 
                ORDER BY id DESC LIMIT 1
            """, (table_name,))
            result = c.fetchone()
            
            current_schema = get_table_schema(c, table_name)
            if current_schema:
                current_clean = ''.join(current_schema.lower().split())
                current_hash = calculate_schema_hash(current_clean)
                
                if not result or result[0] != expected_hash:
                    changed_tables.append(table_name)
            else:
                changed_tables.append(table_name)
        
        conn.close()
        return len(changed_tables) > 0, changed_tables
    except Exception as e:
        print(f"Error checking schema changes: {e}")
        conn.close()
        return True, list(TABLE_SCHEMAS.keys())

def update_schema_version(table_name, schema_sql):
    """Update the schema version for a table"""
    conn = get_connection()
    c = conn.cursor()
    
    schema_hash = calculate_schema_hash(''.join(schema_sql.lower().split()))
    
    c.execute("""
        INSERT INTO schema_versions (table_name, schema_hash, schema_definition)
        VALUES (?, ?, ?)
    """, (table_name, schema_hash, schema_sql))
    
    conn.commit()
    conn.close()

def get_connection():
    """Get a connection to the SQLite database."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def get_drop_order():
    """Get the correct order to drop tables based on dependencies"""
    drop_order = []
    added = set()
    
    def add_table(table):
        if table in added:
            return
        # First add dependencies
        if table in TABLE_DEPENDENCIES:
            for parent in TABLE_DEPENDENCIES[table]:
                if parent not in added:
                    add_table(parent)
        drop_order.append(table)
        added.add(table)
    
    # Add all tables in correct order
    for table in TABLE_SCHEMAS.keys():
        add_table(table)
    
    # Reverse to get correct drop order (children first)
    return drop_order[::-1]

def init_db():
    """Initialize the database with required tables"""
    conn = get_connection()
    c = conn.cursor()

    # Create schema_versions table first
    c.execute(TABLE_SCHEMAS['schema_versions'])
    conn.commit()

    # Initialize all other tables from the schema
    for table_name, schema in TABLE_SCHEMAS.items():
        if table_name == 'schema_versions':
            continue

        # Check if table exists
        c.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
        table_exists = c.fetchone() is not None

        if not table_exists:
            print(f"Creating table: {table_name}")
            c.execute(schema)
            conn.commit()

            # Store schema version
            schema_hash = calculate_schema_hash(schema)
            c.execute("""
                INSERT INTO schema_versions (table_name, schema_hash, schema_definition)
                VALUES (?, ?, ?)
            """, (table_name, schema_hash, schema))
            conn.commit()

    # Check if users table is empty and needs default users
    c.execute("SELECT COUNT(*) FROM users")
    user_count = c.fetchone()[0]

    if user_count == 0:
        # Create default users
        from auth.models import hash_password
        
        # Create admin user
        admin_password = 'admin'
        admin_password_hash = hash_password(admin_password)
  
        try:
            # Insert admin user
            c.execute("""
                INSERT INTO users (username, email, password_hash, role, status)
                VALUES (?, ?, ?, ?, ?)
            """, ('admin', 'admin@clc.tz', admin_password_hash, 'admin', 'active'))
            print(f"Created admin user - username: admin, password: {admin_password}")

            
            conn.commit()
            print("Default users created successfully")
        except sqlite3.IntegrityError as e:
            print(f"Error creating default users: {e}")
    else:
        print("Users already exist in the database")

    conn.close()
    print("Database initialization completed") 