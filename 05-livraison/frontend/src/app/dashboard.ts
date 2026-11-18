import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { AnalyticsResponse, ApiRecord, LivraisonApi } from './api';
import { AuthService } from './auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="page-heading">
      <div><span class="eyebrow">APERÇU</span><h1>Bonjour, {{ auth.username() }}</h1>
        <p>Voici le résumé de votre activité de livraison.</p></div>
      <a class="button primary" routerLink="/orders/new"><span>＋</span> Nouvelle commande</a>
    </div>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="loading-card">Chargement des données…</div> } @else {
      <div class="stat-grid">
        <article class="stat-card"><div class="stat-label">Commandes</div><div class="stat-value">{{ metric('Commandes') }}</div>
          <div class="stat-note">Sur la période disponible</div><span class="stat-icon blue">▤</span></article>
        <article class="stat-card"><div class="stat-label">Livraisons réussies</div><div class="stat-value">{{ metric('Livraisons') }}</div>
          <div class="stat-note">{{ metric('Réussite (%)') | number:'1.0-1' }} % de réussite</div><span class="stat-icon green">✓</span></article>
        <article class="stat-card"><div class="stat-label">Chiffre d'affaires</div><div class="stat-value">{{ metric('Chiffre d\\'affaires') | number:'1.0-0' }} <small>€</small></div>
          <div class="stat-note">Livraisons confirmées</div><span class="stat-icon purple">€</span></article>
        <article class="stat-card"><div class="stat-label">Incidents à traiter</div><div class="stat-value">{{ openIncidents() }}</div>
          <div class="stat-note">Incidents non résolus</div><span class="stat-icon amber">⚑</span></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel">
          <div class="panel-heading"><div><h2>Commandes récentes</h2><p>Suivez les dernières opérations</p></div>
            <a class="text-link" routerLink="/orders">Toutes les commandes <span>→</span></a></div>
          @if (orders().length) {
            <div class="table-wrap"><table><thead><tr><th>Commande</th><th>Zone</th><th>Statut</th><th>Échéance</th><th></th></tr></thead>
              <tbody>@for (order of orders(); track order['id']) {
                <tr><td><strong>{{ order['number'] }}</strong><small class="cell-sub">#{{ order['id'] }}</small></td>
                  <td>{{ order['zone'] }}</td><td><span class="badge" [class]="badgeClass(order['status'])">{{ humanize(order['status']) }}</span></td>
                  <td>{{ formatDate(order['expectedAt']) }}</td>
                  <td><a class="row-link" [routerLink]="['/orders', order['id']]">Détails →</a></td></tr>
              }</tbody></table></div>
          } @else { <div class="empty-state compact">Aucune commande pour le moment.</div> }
        </section>
        <section class="panel quick-panel">
          <div class="panel-heading"><div><h2>Accès rapides</h2><p>Gérez votre activité au quotidien</p></div></div>
          <a class="quick-link" routerLink="/clients"><span class="quick-icon blue">♙</span><span><strong>Clients</strong><small>Consulter et gérer les fiches clients</small></span><b>→</b></a>
          <a class="quick-link" routerLink="/deliverers"><span class="quick-icon green">◉</span><span><strong>Livreurs</strong><small>Disponibilités et capacités</small></span><b>→</b></a>
          <a class="quick-link" routerLink="/incidents"><span class="quick-icon amber">⚑</span><span><strong>Incidents</strong><small>Suivre les incidents de livraison</small></span><b>→</b></a>
          <a class="quick-link" routerLink="/statistics"><span class="quick-icon purple">▥</span><span><strong>Statistiques</strong><small>Performance et revenus</small></span><b>→</b></a>
        </section>
      </div>
      <div class="bottom-grid">
        <section class="panel mini-panel"><div class="mini-icon blue">▣</div><div><span>Colis enregistrés</span><strong>{{ parcelCount() }}</strong></div><a routerLink="/parcels">Voir →</a></section>
        <section class="panel mini-panel"><div class="mini-icon green">◉</div><div><span>Livreurs actifs</span><strong>{{ availableDeliverers() }}</strong></div><a routerLink="/deliverers">Voir →</a></section>
        <section class="panel mini-panel"><div class="mini-icon purple">✓</div><div><span>Preuves de livraison</span><strong>{{ proofCount() }}</strong></div><a routerLink="/proofs">Voir →</a></section>
      </div>
    }
  `
})
export class DashboardPage implements OnInit {
  private readonly api = inject(LivraisonApi);
  protected readonly auth = inject(AuthService);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly stats = signal<AnalyticsResponse | null>(null);
  protected readonly orders = signal<ApiRecord[]>([]);
  protected readonly openIncidents = signal(0);
  protected readonly parcelCount = signal(0);
  protected readonly availableDeliverers = signal(0);
  protected readonly proofCount = signal(0);

  ngOnInit(): void {
    forkJoin({
      stats: this.api.statistics().pipe(catchError(() => of(null))),
      orders: this.api.list<ApiRecord>('/api/orders', '', '', 0, 6).pipe(catchError(() => of(null))),
      incidents: this.api.list<ApiRecord>('/api/incidents', '', '', 0, 100).pipe(catchError(() => of(null))),
      parcels: this.api.list<ApiRecord>('/api/parcels', '', '', 0, 1).pipe(catchError(() => of(null))),
      deliverers: this.api.list<ApiRecord>('/api/deliverers', '', 'DISPONIBLE', 0, 100).pipe(catchError(() => of(null))),
      proofs: this.api.list<ApiRecord>('/api/proofs', '', '', 0, 1).pipe(catchError(() => of(null)))
    }).subscribe(result => {
      this.stats.set(result.stats);
      this.orders.set(result.orders?.content ?? []);
      this.openIncidents.set((result.incidents?.content ?? []).filter(i => !i['resolution']).length);
      this.parcelCount.set(result.parcels?.totalElements ?? 0);
      this.availableDeliverers.set(result.deliverers?.totalElements ?? 0);
      this.proofCount.set(result.proofs?.totalElements ?? 0);
      if (!result.stats || !result.orders) this.error.set('Certaines données sont temporairement indisponibles.');
      this.loading.set(false);
    });
  }

  protected metric(name: string): number { return this.stats()?.metrics[name] ?? 0; }
  protected humanize(value: unknown): string { return String(value ?? '—').replaceAll('_', ' ').toLowerCase().replace(/(^| )\S/g, s => s.toUpperCase()); }
  protected badgeClass(value: unknown): string {
    const status = String(value ?? '');
    if (['LIVREE', 'DISPONIBLE'].includes(status)) return 'badge success';
    if (['ECHEC_LIVRAISON', 'ANNULEE'].includes(status)) return 'badge danger';
    if (['EN_TRANSIT', 'PRISE_EN_CHARGE', 'ASSIGNEE'].includes(status)) return 'badge info';
    return 'badge neutral';
  }
  protected formatDate(value: unknown): string {
    if (!value) return '—';
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
  }
}
