-- Données de démonstration H2 : ajoutées seulement si absentes.
INSERT INTO client_records (name, email, phone, address, version)
SELECT 'Client Démonstration', 'client.livraison.demo@example.test', '+261 34 00 000 05', 'Antananarivo', 0
WHERE NOT EXISTS (SELECT 1 FROM client_records WHERE email = 'client.livraison.demo@example.test');
INSERT INTO deliverer_records (name, phone, vehicle, zone, max_weight, max_volume, distance_to_pickup, max_deliveries, status, version)
SELECT 'Livreur Démo', '+261 34 00 000 06', 'Moto', 'CENTRE', 30.00, 100.00, 1.00, 10, 'DISPONIBLE', 0
WHERE NOT EXISTS (SELECT 1 FROM deliverer_records WHERE phone = '+261 34 00 000 06');
INSERT INTO deliveryorder_records (number, client_id, deliverer_id, pickup_address, delivery_address, weight, volume, distance, price, priority, zone, status, expected_at, created_at, delivered_at, version)
SELECT 'LIV-DEMO-001', c.id, NULL, 'Entrepôt central', 'Centre-ville', 2.50, 10.00, 5.00, 0.00, 'NORMALE', 'CENTRE', 'CREEE', TIMESTAMP '2026-11-01 12:00:00', TIMESTAMP '2026-10-15 08:00:00', NULL, 0
FROM client_records c WHERE c.email = 'client.livraison.demo@example.test'
AND NOT EXISTS (SELECT 1 FROM deliveryorder_records WHERE number = 'LIV-DEMO-001');
INSERT INTO parcel_records (order_id, reference, description, weight, volume, version)
SELECT o.id, 'COLIS-DEMO-001', 'Colis de démonstration', 2.50, 10.00, 0
FROM deliveryorder_records o WHERE o.number = 'LIV-DEMO-001'
AND NOT EXISTS (SELECT 1 FROM parcel_records WHERE reference = 'COLIS-DEMO-001');
