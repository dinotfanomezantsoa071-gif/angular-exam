import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <main class="login-page">
      <section class="login-card">
        <a class="brand login-brand" href="/login">
          <span class="brand-mark">L</span>
          <span><strong>Livraison</strong><small>Operations platform</small></span>
        </a>
        <div class="login-heading">
          <span class="eyebrow">ESPACE SÉCURISÉ</span>
          <h1>Ravi de vous revoir</h1>
          <p>Connectez-vous pour accéder au centre de pilotage.</p>
        </div>
        @if (expired) { <div class="alert error">Votre session a expiré. Veuillez vous reconnecter.</div> }
        @if (error()) { <div class="alert error">{{ error() }}</div> }
        <form (ngSubmit)="submit()" #loginForm="ngForm">
          <label for="username">Identifiant</label>
          <input id="username" name="username" [(ngModel)]="username" autocomplete="username" required autofocus>
          <label for="password">Mot de passe</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" autocomplete="current-password" required>
          <button class="button primary login-submit" type="submit" [disabled]="loginForm.invalid || loading()">
            {{ loading() ? 'Connexion…' : 'Se connecter' }} <span>→</span>
          </button>
        </form>
        <p class="login-footnote">Authentification sécurisée par votre serveur Livraison.</p>
      </section>
    </main>
  `
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected username = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly expired = this.route.snapshot.queryParamMap.has('expired');

  protected submit(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.username, this.password).subscribe(valid => {
      this.loading.set(false);
      if (valid) {
        void this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Identifiant ou mot de passe invalide, ou serveur indisponible.');
      }
    });
  }
}
