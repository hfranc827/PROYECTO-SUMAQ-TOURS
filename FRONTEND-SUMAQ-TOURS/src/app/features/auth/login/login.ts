
import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Auth
} from '../../../core/services/auth';

import {
  LoginRequest
} from '../../../shared/models/auth.model';


@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly fb =
    inject(FormBuilder);

  private readonly auth =
    inject(Auth);

  private readonly router =
    inject(Router);


  loading = false;

  errorMessage = '';


  // ===========================
  // FORMULARIO
  // ===========================

  form = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]

  });


  // ===========================
  // INICIAR SESIÓN
  // ===========================

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.errorMessage = '';


    const request: LoginRequest = {

      email:
        this.form.controls.email.value!,

      password:
        this.form.controls.password.value!

    };


    this.auth.login(request)
      .subscribe({

        next: response => {

          this.loading = false;

          this.redirigirSegunRol(
            response.rol
          );

        },

        error: error => {

          console.error(
            'Error iniciando sesión:',
            error
          );

          this.loading = false;

          if (error.status === 401) {

            this.errorMessage =
              'Correo o contraseña incorrectos.';

            return;
          }

          if (error.status === 400) {

            this.errorMessage =
              'Verifica los datos ingresados.';

            return;
          }

          this.errorMessage =
            'No fue posible iniciar sesión. Inténtalo nuevamente.';

        }

      });

  }


  // ===========================
  // REDIRECCIÓN POR ROL
  // ===========================

  private redirigirSegunRol(
    rol: string
  ): void {

    switch (rol) {

      case 'ROLE_ADMIN':

        this.router.navigate([
          '/admin'
        ]);

        break;


      case 'ROLE_ASESOR':

        this.router.navigate([
          '/asesor'
        ]);

        break;


      case 'ROLE_CLIENTE':

        this.router.navigate([
          '/'
        ]);

        break;


      default:

        this.router.navigate([
          '/'
        ]);

    }

  }

}
