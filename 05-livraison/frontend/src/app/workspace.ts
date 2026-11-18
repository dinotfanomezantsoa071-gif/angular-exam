import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiRecord, FormField, LivraisonApi, ModuleDefinition, moduleDefinition } from './api';
import { AuthService } from './auth';

@Component({
  selector: 'app-workspace',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './workspace.html'
})
export class WorkspacePage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(LivraisonApi);
  protected readonly auth = inject(AuthService);
  private readonly routeSub?: Subscription;
  protected readonly module = signal<ModuleDefinition | null>(null);
  protected readonly moduleKey = signal('');
  protected readonly records = signal<ApiRecord[]>([]);
  protected readonly record = signal<ApiRecord | null>(null);
  protected readonly relatedRecords = signal<ApiRecord[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly page = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);
  protected readonly query = signal('');
  protected readonly status = signal('');
  protected readonly isForm = signal(false);
  protected readonly isDetail = signal(false);
  protected readonly isEditing = signal(false);
  protected form: Record<string, unknown> = {};

  constructor() {
    this.routeSub = this.route.paramMap.subscribe(() => this.readRoute());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private readRoute(): void {
    const key = this.route.snapshot.paramMap.get('module') ?? '';
    const definition = moduleDefinition(key);
    this.moduleKey.set(key);
    this.module.set(definition);
    this.error.set('');
    if (!definition) {
      void this.router.navigate(['/dashboard']);
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const url = this.router.url;
    this.isForm.set(url.endsWith('/new') || url.endsWith('/edit'));
    this.isEditing.set(url.endsWith('/edit') && Number.isFinite(id));
    this.isDetail.set(Number.isFinite(id) && id > 0 && !this.isForm());

    if (this.isForm()) {
      if (!this.auth.canOperate() || (this.isEditing() && !this.auth.canManage())) {
        void this.router.navigate([`/${key}`]);
        return;
      }
      this.record.set(null);
      this.initializeForm(definition);
      this.loadRelations(definition.fields);
      if (this.isEditing()) this.loadRecord(id, true);
    } else if (this.isDetail()) {
      this.loadRecord(id, false);
      this.loadRelations(definition.fields);
    } else {
      this.loadList();
    }
  }

  private initializeForm(definition: ModuleDefinition): void {
    const form: Record<string, unknown> = {};
    for (const field of definition.fields) {
      if (field.type === 'datetime-local') {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        form[field.key] = now.toISOString().slice(0, 16);
      } else if (field.key === 'priority') {
        form[field.key] = 'NORMALE';
      } else if (field.key === 'type') {
        form[field.key] = field.options?.[0] ?? '';
      } else if (field.key === 'status') {
        form[field.key] = field.options?.[0] ?? '';
      } else {
        form[field.key] = '';
      }
    }
    if (this.moduleKey() === 'incidents') {
      const orderId = this.route.snapshot.queryParamMap.get('orderId');
      if (orderId) form['orderId'] = Number(orderId);
    }
    this.form = form;
  }

  private loadRelations(fields: FormField[]): void {
    const relation = fields.find(field => field.relation)?.relation;
    if (!relation) {
      this.relatedRecords.set([]);
      return;
    }
    const endpoint = relation === 'clients' ? '/api/clients' : '/api/orders';
    this.api.list<ApiRecord>(endpoint, '', '', 0, 100).subscribe({
      next: result => {
        const eligible = this.moduleKey() === 'parcels'
          ? result.content.filter(row => row['status'] === 'CREEE')
          : this.moduleKey() === 'proofs'
            ? result.content.filter(row => row['status'] === 'EN_TRANSIT')
            : this.moduleKey() === 'incidents'
              ? result.content.filter(row => ['ASSIGNEE', 'PRISE_EN_CHARGE', 'EN_TRANSIT'].includes(String(row['status'])))
              : result.content;
        this.relatedRecords.set(eligible);
      },
      error: () => this.relatedRecords.set([])
    });
  }

  protected loadList(): void {
    const definition = this.module();
    if (!definition) return;
    this.loading.set(true);
    this.api.list<ApiRecord>(definition.endpoint, this.query(), this.status(), this.page()).subscribe({
      next: result => {
        this.records.set(result.content);
        this.page.set(result.number);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: error => {
        this.showError(error);
        this.loading.set(false);
      }
    });
  }

  private loadRecord(id: number, asForm: boolean): void {
    const definition = this.module();
    if (!definition) return;
    this.loading.set(true);
    this.api.get<ApiRecord>(definition.endpoint, id).subscribe({
      next: result => {
        this.record.set(result);
        if (asForm) {
          for (const field of definition.fields) {
            const value = result[field.key];
            this.form[field.key] = field.type === 'datetime-local' && value
              ? String(value).slice(0, 16) : value ?? '';
          }
        }
        this.loading.set(false);
      },
      error: error => {
        this.showError(error);
        this.loading.set(false);
      }
    });
  }

  protected search(): void {
    this.page.set(0);
    this.loadList();
  }

  protected changePage(offset: number): void {
    const next = this.page() + offset;
    if (next >= 0 && next < this.totalPages()) {
      this.page.set(next);
      this.loadList();
    }
  }

  protected submitForm(): void {
    const definition = this.module();
    if (!definition) return;
    const payload: Record<string, unknown> = {};
    for (const field of definition.fields) {
      const value = this.form[field.key];
      if (value === '' || value === null || value === undefined) {
        if (field.required) {
          this.error.set(`${field.label} est obligatoire.`);
          return;
        }
        payload[field.key] = null;
      } else if (field.type === 'number' || field.relation) {
        payload[field.key] = Number(value);
      } else {
        payload[field.key] = value;
      }
    }
    this.saving.set(true);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const request = this.isEditing()
      ? this.api.update<ApiRecord>(definition.endpoint, id, payload)
      : this.api.create<ApiRecord>(definition.endpoint, payload);
    request.subscribe({
      next: result => {
        this.saving.set(false);
        void Swal.fire({ icon: 'success', title: this.isEditing() ? 'Modifications enregistrées' : 'Création effectuée',
          text: `${definition.singular} ${this.isEditing() ? 'mis à jour' : 'ajouté'} avec succès.`,
          timer: 1700, showConfirmButton: false });
        void this.router.navigate([`/${this.moduleKey()}`, result['id']]);
      },
      error: error => {
        this.saving.set(false);
        this.showError(error);
      }
    });
  }

  protected async deleteRecord(item: ApiRecord): Promise<void> {
    const definition = this.module();
    const id = Number(item['id']);
    if (!definition || !id) return;
    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Supprimer cet enregistrement ?',
      text: 'Cette action est définitive et peut être refusée si la donnée est encore utilisée.',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc4d57'
    });
    if (!confirmation.isConfirmed) return;
    this.api.remove(definition.endpoint, id).subscribe({
      next: () => {
        void Swal.fire({ icon: 'success', title: 'Supprimé', timer: 1300, showConfirmButton: false });
        this.loadList();
      },
      error: error => this.showError(error)
    });
  }

  protected async performOrderAction(action: string): Promise<void> {
    const item = this.record();
    const id = Number(item?.['id']);
    if (!item || !id) return;
    let body: Record<string, unknown> = {};
    let title = action;
    if (action === 'deliver') {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const form = await Swal.fire({
        title: 'Confirmer la livraison',
        html: '<input id="recipient" class="swal2-input" placeholder="Nom du réceptionnaire">' +
          '<input id="confirmationCode" class="swal2-input" placeholder="Code de confirmation">' +
          '<input id="deliveredAt" class="swal2-input" type="datetime-local" value="' + now.toISOString().slice(0, 16) + '">' +
          '<textarea id="comment" class="swal2-textarea" placeholder="Commentaire (facultatif)"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        preConfirm: () => {
          const recipient = (document.getElementById('recipient') as HTMLInputElement).value.trim();
          const confirmationCode = (document.getElementById('confirmationCode') as HTMLInputElement).value.trim();
          const at = (document.getElementById('deliveredAt') as HTMLInputElement).value;
          if (!recipient || !confirmationCode || !at) {
            Swal.showValidationMessage('Le réceptionnaire, le code et la date sont obligatoires.');
            return undefined;
          }
          return { recipient, confirmationCode, at, comment: (document.getElementById('comment') as HTMLTextAreaElement).value };
        }
      });
      if (!form.isConfirmed || !form.value) return;
      body = form.value;
      title = 'Livraison confirmée';
    } else {
      const names: Record<string, string> = {
        assign: 'Attribuer un livreur', pickup: 'Confirmer la prise en charge', start: 'Démarrer la livraison',
        cancel: 'Annuler la commande', return: 'Enregistrer le retour'
      };
      title = names[action] ?? action;
      const confirmation = await Swal.fire({
        icon: action === 'cancel' ? 'warning' : 'question',
        title,
        text: action === 'assign' ? 'Le livreur compatible sera choisi automatiquement selon la zone et les capacités.' : undefined,
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      });
      if (!confirmation.isConfirmed) return;
    }
    this.api.action(`orders/${id}/${action}`, body).subscribe({
      next: () => {
        void Swal.fire({ icon: 'success', title, timer: 1500, showConfirmButton: false });
        this.loadRecord(id, false);
      },
      error: error => this.showError(error)
    });
  }

  protected async resolveIncident(): Promise<void> {
    const id = Number(this.record()?.['id']);
    if (!id) return;
    const form = await Swal.fire({
      title: 'Résoudre l’incident',
      input: 'textarea',
      inputLabel: 'Description de la résolution',
      inputPlaceholder: 'Décrivez la solution apportée…',
      inputValidator: value => value?.trim() ? undefined : 'La résolution est obligatoire.',
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler'
    });
    if (!form.isConfirmed) return;
    this.api.action(`incidents/${id}/resolve`, { comment: form.value }).subscribe({
      next: () => {
        void Swal.fire({ icon: 'success', title: 'Incident résolu', timer: 1500, showConfirmButton: false });
        this.loadRecord(id, false);
      },
      error: error => this.showError(error)
    });
  }

  protected showTracking(): void {
    const id = Number(this.record()?.['id']);
    if (!id) return;
    this.api.tracking(id).pipe(
      catchError(error => {
        this.showError(error);
        return of([]);
      })
    ).subscribe(events => {
      if (!events.length) {
        void Swal.fire({ title: 'Historique de suivi', text: 'Aucun événement de suivi.', icon: 'info' });
        return;
      }
      const lines = events.map(event => {
        const item = event as Record<string, unknown>;
        return `${this.formatDate(item['occurredAt'])} — ${item['action'] ?? 'Mise à jour'}${item['actor'] ? ` · ${item['actor']}` : ''}`;
      });
      void Swal.fire({ title: 'Historique de suivi', html: `<div class="tracking-list">${lines.map(line => `<p>${this.escapeHtml(line)}</p>`).join('')}</div>`, confirmButtonText: 'Fermer' });
    });
  }

  protected detailEntries(): { label: string; value: string }[] {
    const item = this.record();
    const definition = this.module();
    if (!item || !definition) return [];
    const labels = new Map([
      ...definition.fields.map(field => [field.key, field.label] as [string, string]),
      ...definition.columns.map(column => [column.key, column.label] as [string, string])
    ]);
    return Object.entries(item)
      .filter(([key, value]) => key !== 'version' && value !== null && value !== undefined)
      .map(([key, value]) => ({
        label: labels.get(key) ?? this.humanize(key),
        value: key.toLowerCase().includes('at') ? this.formatDate(value) : this.humanizeValue(key, value)
      }));
  }

  protected value(row: ApiRecord, key: string): string {
    const value = row[key];
    if (value === undefined || value === null || value === '') return '—';
    const column = this.module()?.columns.find(item => item.key === key);
    if (column?.format === 'date') return this.formatDate(value);
    if (column?.format === 'currency') return `${Number(value).toLocaleString('fr-FR')} €`;
    return this.humanizeValue(key, value);
  }

  protected relationLabel(field: FormField, id: unknown): string {
    const item = this.relatedRecords().find(row => String(row['id']) === String(id));
    if (!item) return '';
    return field.relation === 'clients'
      ? `${item['name']} · #${item['id']}`
      : `${item['number']} · ${item['status'] ?? ''} · #${item['id']}`;
  }

  protected rowLink(row: ApiRecord): unknown[] {
    return [`/${this.moduleKey()}`, row['id']];
  }

  protected canCreate(): boolean { return this.auth.canOperate(); }
  protected canModify(): boolean {
    const definition = this.module();
    return this.auth.canManage() && definition?.canEdit !== false;
  }
  protected canDelete(): boolean {
    const definition = this.module();
    return this.auth.canManage() && definition?.canDelete !== false;
  }
  protected canModifyRecord(row: ApiRecord): boolean {
    if (!this.canModify()) return false;
    if (this.moduleKey() === 'orders') return row['status'] === 'CREEE';
    if (this.moduleKey() === 'deliverers') return row['status'] !== 'EN_LIVRAISON';
    return true;
  }
  protected canDeleteRecord(row: ApiRecord): boolean {
    if (!this.canDelete()) return false;
    return this.moduleKey() !== 'orders' || row['status'] === 'CREEE';
  }
  protected hasStatusColumn(): boolean {
    return this.module()?.columns.some(column => column.key === 'status') ?? false;
  }

  protected humanize(value: unknown): string {
    return String(value ?? '—').replaceAll('_', ' ').toLowerCase().replace(/(^| )\S/g, s => s.toUpperCase());
  }
  protected humanizeValue(key: string, value: unknown): string {
    if (key === 'status' || key === 'priority' || key === 'type') return this.humanize(value);
    return String(value);
  }
  protected formatDate(value: unknown): string {
    if (!value) return '—';
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }
  protected badgeClass(value: unknown): string {
    const status = String(value ?? '');
    if (['LIVREE', 'DISPONIBLE'].includes(status)) return 'badge success';
    if (['ECHEC_LIVRAISON', 'ANNULEE', 'INDISPONIBLE', 'RETOURNEE'].includes(status)) return 'badge danger';
    if (['EN_TRANSIT', 'PRISE_EN_CHARGE', 'ASSIGNEE', 'EN_LIVRAISON'].includes(status)) return 'badge info';
    return 'badge neutral';
  }
  protected isStatus(key: string): boolean {
    return ['status', 'priority', 'type'].includes(key);
  }
  protected get orderActions(): { action: string; label: string }[] {
    const status = this.record()?.['status'];
    const actions = [
      { action: 'assign', label: 'Attribuer' },
      { action: 'pickup', label: 'Prise en charge' },
      { action: 'start', label: 'Démarrer' },
      { action: 'deliver', label: 'Confirmer la livraison' },
      { action: 'return', label: 'Enregistrer le retour' },
      { action: 'cancel', label: 'Annuler' }
    ];
    const allowed: Record<string, string[]> = {
      CREEE: ['assign', 'cancel'],
      ASSIGNEE: ['pickup', 'cancel'],
      PRISE_EN_CHARGE: ['start'],
      EN_TRANSIT: ['deliver'],
      ECHEC_LIVRAISON: ['return']
    };
    return this.auth.canOperate() ? actions.filter(item => allowed[String(status)]?.includes(item.action)) : [];
  }
  protected get canResolve(): boolean {
    return this.auth.canOperate() && this.moduleKey() === 'incidents' && !this.record()?.['resolution'];
  }
  protected get canReportIncident(): boolean {
    return this.auth.canOperate() && this.moduleKey() === 'orders' &&
      ['ASSIGNEE', 'PRISE_EN_CHARGE', 'EN_TRANSIT'].includes(String(this.record()?.['status']));
  }

  private escapeHtml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  private showError(error: unknown): void {
    const candidate = error as {
      error?: { message?: string; detail?: string; errors?: Record<string, string> };
      message?: string
    };
    const fieldErrors = candidate.error?.errors;
    const message = fieldErrors && Object.keys(fieldErrors).length
      ? Object.entries(fieldErrors).map(([field, reason]) => `${this.humanize(field)} : ${reason}`).join('\n')
      : candidate.error?.message ?? candidate.error?.detail ?? candidate.message ?? 'Une erreur est survenue.';
    this.error.set(message);
    void Swal.fire({ icon: 'error', title: 'Opération impossible', text: message, confirmButtonText: 'Fermer' });
  }
}
