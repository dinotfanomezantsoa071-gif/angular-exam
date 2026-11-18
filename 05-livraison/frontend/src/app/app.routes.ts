import { Routes } from '@angular/router';
import { authenticatedGuard, adminGuard, loginGuard } from './auth';

export const routes: Routes = [
  { path: 'login', canActivate: [loginGuard], loadComponent: () => import('./login').then(m => m.LoginPage) },
  { path: 'dashboard', canActivate: [authenticatedGuard], loadComponent: () => import('./dashboard').then(m => m.DashboardPage) },
  { path: 'statistics', canActivate: [authenticatedGuard], loadComponent: () => import('./statistics').then(m => m.StatisticsPage) },
  { path: 'settings', canActivate: [authenticatedGuard, adminGuard], loadComponent: () => import('./settings').then(m => m.SettingsPage) },
  { path: ':module/new', canActivate: [authenticatedGuard], loadComponent: () => import('./workspace').then(m => m.WorkspacePage) },
  { path: ':module/:id/edit', canActivate: [authenticatedGuard], loadComponent: () => import('./workspace').then(m => m.WorkspacePage) },
  { path: ':module/:id', canActivate: [authenticatedGuard], loadComponent: () => import('./workspace').then(m => m.WorkspacePage) },
  { path: ':module', canActivate: [authenticatedGuard], loadComponent: () => import('./workspace').then(m => m.WorkspacePage) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
