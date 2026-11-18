import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsResponse, LivraisonApi } from './api';

@Component({
  selector: 'app-statistics',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="page-heading"><div><span class="eyebrow">ANALYSE</span><h1>Statistiques</h1>
      <p>Indicateurs de performance et de revenus de vos livraisons.</p></div></div>
    <section class="panel filter-panel">
      <form class="toolbar stats-toolbar" (ngSubmit)="load()">
        <label>Du <input type="date" name="from" [(ngModel)]="from"></label>
        <label>Au <input type="date" name="to" [(ngModel)]="to"></label>
        <label>Zone <input name="zone" [(ngModel)]="zone" placeholder="Toutes les zones"></label>
        <button class="button primary" type="submit">Actualiser les indicateurs</button>
      </form>
    </section>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="loading-card">Calcul des statistiques…</div> }
    @if (!loading() && stats(); as result) {
      <div class="metric-grid">
        @for (metric of metrics(); track metric.key) {
          <article class="metric-card"><span>{{ metric.key }}</span>
            <strong>{{ metric.value | number:'1.0-2' }}<small>{{ unit(metric.key) }}</small></strong></article>
        }
      </div>
      <section class="panel stats-panel">
        <div class="panel-heading"><div><h2>Performance par livreur</h2><p>Livraisons confirmées et revenus générés</p></div></div>
        @if (groupEntries().length) {
          <div class="table-wrap"><table><thead><tr><th>Livreur</th><th>Livraisons</th><th>Revenu</th></tr></thead>
            <tbody>@for (entry of groupEntries(); track entry.name) {
              <tr><td><strong>{{ entry.name }}</strong></td><td>{{ entry.values['Livraisons'] }}</td>
                <td>{{ entry.values['Revenu'] | number:'1.2-2' }} €</td></tr>
            }</tbody></table></div>
        } @else { <div class="empty-state compact">Aucune livraison confirmée sur cette période.</div> }
      </section>
    }
  `
})
export class StatisticsPage implements OnInit {
  private readonly api = inject(LivraisonApi);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly stats = signal<AnalyticsResponse | null>(null);
  protected from = '';
  protected to = '';
  protected zone = '';

  ngOnInit(): void {
    const today = new Date();
    this.to = this.localDate(today);
    this.from = `${today.getFullYear()}-01-01`;
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.statistics(this.from, this.to, this.zone).subscribe({
      next: result => { this.stats.set(result); this.loading.set(false); },
      error: error => {
        this.error.set(error?.error?.message ?? 'Impossible de charger les statistiques.');
        this.loading.set(false);
      }
    });
  }

  protected metrics(): { key: string; value: number }[] {
    return Object.entries(this.stats()?.metrics ?? {}).map(([key, value]) => ({ key, value }));
  }
  protected groupEntries(): { name: string; values: Record<string, number> }[] {
    return Object.entries(this.stats()?.groups ?? {}).map(([name, values]) => ({ name, values }));
  }
  protected unit(name: string): string {
    if (name.includes('%')) return '%';
    if (name.toLowerCase().includes('revenu') || name.toLowerCase().includes('affaires')) return ' €';
    if (name.toLowerCase().includes('distance')) return ' km';
    if (name.toLowerCase().includes('délai')) return ' h';
    return '';
  }

  private localDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
