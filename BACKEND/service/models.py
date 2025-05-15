from db import get_connection

def add_service(title, description, videoThumbnail, videoUrl, offerings, status='pending'):
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO services (title, description, videoThumbnail, videoUrl, status) VALUES (?, ?, ?, ?, ?)",
        (title, description, videoThumbnail, videoUrl, status)
    )
    service_id = c.lastrowid
    for offer in offerings:
        c.execute("INSERT INTO offerings (service_id, text) VALUES (?, ?)", (service_id, offer['text']))
    conn.commit()
    conn.close()
    return service_id

def get_all_services():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM services WHERE status = 'active'")
    services = c.fetchall()

    packages = []
    for service in services:
        service_id = service[0]
        c.execute("SELECT id, text FROM offerings WHERE service_id=?", (service_id,))
        offerings = [{"id": row[0], "text": row[1]} for row in c.fetchall()]
        packages.append({
            "id": service_id,
            "title": service[1],
            "description": service[2],
            "videoThumbnail": service[3],
            "videoUrl": service[4],
            "status": service[5],
            "offerings": offerings
        })
    conn.close()
    return {
        "title": "OUR SERVICE PACKAGES",
        "packages": packages
    }

def update_service(service_id, title, description, videoThumbnail, videoUrl, offerings, status='pending'):
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "UPDATE services SET title=?, description=?, videoThumbnail=?, videoUrl=?, status=? WHERE id=?",
        (title, description, videoThumbnail, videoUrl, status, service_id)
    )
    c.execute("DELETE FROM offerings WHERE service_id=?", (service_id,))
    for offer in offerings:
        c.execute("INSERT INTO offerings (service_id, text) VALUES (?, ?)", (service_id, offer['text']))
    conn.commit()
    conn.close()

def delete_service(service_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute("DELETE FROM offerings WHERE service_id=?", (service_id,))
    c.execute("DELETE FROM services WHERE id=?", (service_id,))
    conn.commit()
    conn.close()
