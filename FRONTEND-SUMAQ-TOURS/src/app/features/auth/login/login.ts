import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { finalize } from 'rxjs';

import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  hidePassword = true;

  readonly form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      Validators.required
    ]
  });

  submit(): void {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    const request: LoginRequest = {
      email: values.email.trim(),
      password: values.password
    };

    this.loading = true;

    this.auth.login(request)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: response => {
          this.redirigirSegunRol(response.rol);
        },

        error: error => {
          switch (error.status) {
            case 401:
              this.errorMessage =
                'Correo o contraseña incorrectos.';
              break;

            case 400:
              this.errorMessage =
                'Verifica los datos ingresados.';
              break;

            case 0:
              this.errorMessage =
                'No se pudo conectar con el servidor. Revisa tu conexión.';
              break;

            default:
              this.errorMessage =
                'No fue posible iniciar sesión. Inténtalo nuevamente.';
          }
        }
      });
  }

  private redirigirSegunRol(rol: string): void {
    switch (rol) {
      case 'ROLE_ADMIN':
        void this.router.navigate(['/admin']);
        break;

      case 'ROLE_ASESOR':
        void this.router.navigate(['/asesor']);
        break;

      case 'ROLE_CLIENTE':
      default:
        void this.router.navigate(['/']);
        break;
    }
  }
}