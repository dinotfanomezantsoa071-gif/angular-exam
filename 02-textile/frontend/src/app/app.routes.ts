import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', data: { title: 'Tableau de bord', page: 'dashboard' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'clients', data: { title: 'Clients', page: 'clients' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'products', data: { title: 'Produits', page: 'products' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'orders', data: { title: 'Commandes', page: 'orders' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'order-lines', data: { title: 'Lignes de commande', page: 'order-lines' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'production-steps', data: { title: 'Production', page: 'production-steps' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'quality-controls', data: { title: 'Contrôle qualité', page: 'quality-controls' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'statistics', data: { title: 'Statistiques', page: 'statistics' }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
      { path: 'settings', canActivate: [roleGuard], data: { title: 'Paramètres', page: 'settings', requiredRoles: ['ADMIN'] }, loadComponent: () => import('./features/business/business-page.component').then((m) => m.BusinessPageComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
