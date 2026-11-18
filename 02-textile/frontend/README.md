# Frontend — gestion textile

Application Angular standalone, indépendante du backend Spring Boot.

## Prérequis

- Node.js 20.19+ (ou 22.12+ / 24+)
- Backend textile lancé sur `http://localhost:8182`

## Lancement

```bash
npm install
npm start
```

L'interface de développement est disponible sur `http://localhost:4200`.
L'URL de l'API est définie dans `src/environments/environment.development.ts`.

L'API utilise HTTP Basic et ne fournit pas d'endpoint de connexion. Les identifiants sont gardés en mémoire uniquement; l'interface se déconnecte au rechargement. Le backend devra autoriser CORS pour l'origine Angular (`http://localhost:4200`).

Les pages métier restent à réaliser dans l'étape Features.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
