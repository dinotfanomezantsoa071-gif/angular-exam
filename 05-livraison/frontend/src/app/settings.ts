import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LivraisonApi, Setting } from './api';

const supportedSettingKeys = new Set([
  'price.base', 'price.km', 'price.kg', 'price.volume', 'price.urgent', 'price.veryUrgent',
  'price.zone', 'score.distance', 'score.load', 'score.priority'
]);

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  template: `
    <div class="page-heading"><div><span class="eyebrow">ADMINISTRATION</span><h1>Paramètres métier</h1>
      <p>Configurez les règles tarifaires utilisées pour calculer les commandes.</p></div></div>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="loading-card">Chargement des paramètres…</div> } @else {
      <section class="panel settings-panel">
        <div class="panel-heading"><div><h2>Tarification et règles</h2><p>Les modifications sont appliquées aux nouveaux calculs de prix.</p></div></div>
        @if (settings().length) {
          <div class="settings-list">
            @for (setting of settings(); track setting.name) {
              <form class="setting-row" (ngSubmit)="save(setting)">
                <div><strong>{{ setting.label }}</strong><small>{{ setting.name }}</small></div>
                <label class="setting-value"><span>Valeur</span><input type="number" step="0.01" min="0" max="1000000" [name]="setting.name"
                  [(ngModel)]="setting.value" required></label>
                <button class="button secondary small" type="submit" [disabled]="saving() === setting.name">Enregistrer</button>
              </form>
            }
          </div>
        } @else { <div class="empty-state compact">Aucun paramètre enregistré.</div> }
      </section>
      <section class="panel add-setting-panel">
        <div class="panel-heading"><div><h2>Ajouter ou définir un paramètre</h2><p>Pour un tarif de zone, utilisez le format <code>price.zone.NOM</code>.</p></div></div>
        <form class="toolbar new-setting-form" (ngSubmit)="add()" #settingForm="ngForm">
          <label>Clé du paramètre<input name="name" [(ngModel)]="newName" required pattern="[a-zA-Z][a-zA-Z0-9.]{0,80}" placeholder="price.zone.CENTRE"></label>
          <label>Valeur<input name="value" type="number" min="0" max="1000000" step="0.01" [(ngModel)]="newValue" required></label>
          <button class="button primary" type="submit" [disabled]="settingForm.invalid || !supportedSettingName() || saving() === 'new'">Enregistrer le paramètre</button>
        </form>
        <p class="field-hint">Clés standard autorisées ou tarif de zone au format <code>price.zone.NOM</code>.</p>
      </section>
    }
  `
})
export class SettingsPage implements OnInit {
  private readonly api = inject(LivraisonApi);
  protected readonly settings = signal<Setting[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly saving = signal('');
  protected newName = '';
  protected newValue: number | null = null;

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    this.api.settings().subscribe({
      next: values => { this.settings.set(values); this.loading.set(false); },
      error: error => {
        this.error.set(error?.error?.message ?? 'Impossible de charger les paramètres.');
        this.loading.set(false);
      }
    });
  }

  protected save(setting: Setting): void {
    this.saving.set(setting.name);
    this.api.saveSetting(setting.name, Number(setting.value)).subscribe({
      next: () => {
        this.saving.set('');
        void Swal.fire({ icon: 'success', title: 'Paramètre enregistré', timer: 1300, showConfirmButton: false });
        this.load();
      },
      error: error => {
        this.saving.set('');
        this.error.set(error?.error?.message ?? 'La valeur du paramètre n’a pas pu être enregistrée.');
      }
    });
  }

  protected add(): void {
    if (!this.newName || this.newValue === null) return;
    if (!this.supportedSettingName()) {
      this.error.set('Le backend n’accepte que les paramètres tarifaires connus et les clés price.zone.*.');
      return;
    }
    this.saving.set('new');
    this.api.saveSetting(this.newName.trim(), Number(this.newValue)).subscribe({
      next: () => {
        this.saving.set('');
        this.newName = '';
        this.newValue = null;
        this.load();
        void Swal.fire({ icon: 'success', title: 'Paramètre enregistré', timer: 1300, showConfirmButton: false });
      },
      error: error => {
        this.saving.set('');
        this.error.set(error?.error?.message ?? 'Impossible d’enregistrer ce paramètre.');
      }
    });
  }

  protected supportedSettingName(): boolean {
    const name = this.newName.trim();
    return supportedSettingKeys.has(name) || name.startsWith('price.zone.');
  }
}
