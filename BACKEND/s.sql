-- 1. Set "Community Legal Clinic (CLC)" as main
UPDATE contact_items
SET is_main = 1, is_address = 0, is_contact = 0, value = ''
WHERE id = 93;

-- 2. Change "Dar-es-Salaam" to "Dar es Salaam," and mark as address
UPDATE contact_items
SET label = 'Dar es Salaam,', is_address = 1, is_main = 0, is_contact = 0, value = ''
WHERE id = 95;

-- 3. Change "P. O. Box 4661," to empty label and set is_address = 1
UPDATE contact_items
SET label = '', is_address = 1, is_main = 0, is_contact = 0
WHERE id = 94;

-- 4. Add new record: "P. O. Box 4661," as address
INSERT INTO contact_items (contact_id, label, is_address, status)
VALUES (1, 'P. O. Box 4661,', 1, 'active');

-- 5. Add new record: "TANZANIA." as address
INSERT INTO contact_items (contact_id, label, is_address, status)
VALUES (1, 'TANZANIA.', 1, 'active');

-- 6. Update email contact
UPDATE contact_items
SET label = 'Email', value = 'info@clc.tz', is_contact = 1, is_main = 0, is_address = 0
WHERE id = 96;

-- 7. Update phone contact
UPDATE contact_items
SET label = 'Phone', value = '+255 745 118 253', is_contact = 1, is_main = 0, is_address = 0
WHERE id = 97;

