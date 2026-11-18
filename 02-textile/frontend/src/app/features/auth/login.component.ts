import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="grid min-h-screen place-items-center bg-slate-100 px-5 py-10">
      <section class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
        <div class="mb-8 grid size-12 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">T</div>
        <p class="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">Atelier textile</p>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Bienvenue</h1>
        <p class="mt-2 text-sm leading-6 text-slate-500">Connectez-vous avec votre compte de l’atelier.</p>
        <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <label class="block text-sm font-medium text-slate-700">
            Identifiant
            <input class="form-input mt-2" formControlName="username" autocomplete="username" required>
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Mot de passe
            <input class="form-input mt-2" formControlName="password" type="password" autocomplete="current-password" required>
          </label>
          @if (error()) {
            <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ error() }}</p>
          }
          <button class="primary-button w-full" type="submit" [disabled]="form.invalid || busy()">
            {{ busy() ? 'Vérification…' : 'Se connecter' }}
          </button>
        </form>
        <p class="mt-6 text-xs leading-5 text-slate-400">
          L’accès est vérifié auprès de l’API sécurisée. Les identifiants restent uniquement en mémoire pendant cette session.
        </p>
      </section>
    </main>
  `,
})
export class LoginComponent {
  readonly busy = signal(false);
  readonly error = signal('');
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  submit(): void {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    const { username, password } = this.form.getRawValue();
    this.auth.login(username.trim(), password).subscribe({
      next: () => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl');
        const returnUrl = requested?.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        this.busy.set(false);
        this.error.set(error instanceof HttpErrorResponse && error.status === 401
          ? 'Identifiant ou mot de passe incorrect.'
          : 'Connexion impossible. Vérifiez que le serveur est disponible.');
      },
      complete: () => this.busy.set(false),
    });
  }
}
