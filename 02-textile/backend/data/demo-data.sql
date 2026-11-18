-- Données de démonstration H2 : ajoutées seulement si absentes.
INSERT INTO client_records (name, email, phone, address, version)
SELECT 'Atelier Mada', 'atelier.demo@example.test', '+261 34 00 000 01', 'Antananarivo', 0
WHERE NOT EXISTS (SELECT 1 FROM client_records WHERE email = 'atelier.demo@example.test');
INSERT INTO product_records (name, reference, description, unit_price, version)
SELECT 'Chemise coton', 'DEMO-CHEMISE-01', 'Chemise en coton de démonstration', 25000.00, 0
WHERE NOT EXISTS (SELECT 1 FROM product_records WHERE reference = 'DEMO-CHEMISE-01');
INSERT INTO textileorder_records (number, client_id, order_date, delivery_date, delivered_at, priority, status, version)
SELECT 'CMD-DEMO-001', c.id, DATE '2026-10-01', DATE '2026-11-01', NULL, 'NORMALE', 'COMMANDE', 0
FROM client_records c WHERE c.email = 'atelier.demo@example.test'
AND NOT EXISTS (SELECT 1 FROM textileorder_records WHERE number = 'CMD-DEMO-001');
INSERT INTO orderline_records (order_id, product_id, quantity, produced_quantity, size, color, unit_price, version)
SELECT o.id, p.id, 20, 0, 'M', 'Bleu marine', 25000.00, 0
FROM textileorder_records o CROSS JOIN product_records p
WHERE o.number = 'CMD-DEMO-001' AND p.reference = 'DEMO-CHEMISE-01'
AND NOT EXISTS (SELECT 1 FROM orderline_records l WHERE l.order_id = o.id AND l.product_id = p.id);
