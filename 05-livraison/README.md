# Livraison — version 2

Adresse : http://localhost:8185/

Le projet est séparé en deux dossiers :

- `backend/` : API Spring Boot, base H2 et scripts Maven.
- `frontend/` : application Angular.

## Lancement

1. Démarrer le backend avec `backend\lancer.cmd` (JDK 21).
2. Dans un autre terminal, exécuter `cd frontend`, puis `npm install` et `npm start`.

L'interface Angular est disponible sur http://localhost:4201/ et utilise le proxy `/api` vers le backend.

Compiler et tester le backend avec `backend\compiler.cmd`, et compiler Angular avec `cd frontend` puis `npm run build`.

Dans Eclipse : importer le dossier `backend` comme projet Maven avec un JDK 21, puis lancer `backend\05-livraison-v2.launch` ou `com.example.livraison.Application`.

La base H2 est créée au premier lancement dans `backend/data/livraison.mv.db`. Le dossier de travail doit être `backend`. `backend/data/demo-data.sql` charge des exemples sans écraser les données existantes.

Comptes : `admin / Admin123!`, `manager / Manager123!`, `operator / Operator123!`, `user / User123!`. Informations communes : `../ACCES_PROJETS.txt`.
