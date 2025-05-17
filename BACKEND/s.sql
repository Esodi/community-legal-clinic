INSERT INTO services (
    title, description, videoThumbnail, videoUrl, status, created_at, updated_at
)
SELECT 
    title, description, videoThumbnail, videoUrl, status, created_at, updated_at
FROM services
WHERE id = 2;
