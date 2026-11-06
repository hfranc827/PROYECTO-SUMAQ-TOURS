
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
  MatSelectModule
} from '@angular/material/select';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Auth
} from '../../../core/services/auth';

import {
  RegisterRequest
} from '../../../shared/models/auth.model';


@Component({
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private readonly fb =
    inject(FormBuilder);

  private readonly auth =
    inject(Auth);

  private readonly router =
    inject(Router);


  loading = false;

  errorMessage = '';

  successMessage = '';


  // ===========================
  // FORMULARIO
  // ===========================

  form = this.fb.group({

    nombres: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    apellidos: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]
    ],

    telefono: [
      '',
      [
        Validators.maxLength(20)
      ]
    ],

    tipoDocumento: [
      '',
      [
        Validators.maxLength(30)
      ]
    ],

    numeroDocumento: [
      '',
      [
        Validators.maxLength(30)
      ]
    ]

  });


  // ===========================
  // REGISTRAR CLIENTE
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

    this.successMessage = '';


    const request: RegisterRequest = {

      nombres:
        this.form.controls.nombres.value!,

      apellidos:
        this.form.controls.apellidos.value!,

      email:
        this.form.controls.email.value!,

      password:
        this.form.controls.password.value!,

      telefono:
        this.form.controls.telefono.value || '',

      tipoDocumento:
        this.form.controls.tipoDocumento.value || '',

      numeroDocumento:
        this.form.controls.numeroDocumento.value || ''

    };


    this.auth.register(request)
      .subscribe({

        next: response => {

          this.loading = false;

          this.successMessage =
            response.mensaje ||
            'Cuenta creada correctamente.';


          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 1200);

        },

        error: error => {

          console.error(
            'Error registrando usuario:',
            error
          );

          this.loading = false;

          if (error.status === 409) {

            this.errorMessage =
              'El correo o documento ya está registrado.';

            return;
          }

          if (error.status === 400) {

            this.errorMessage =
              'Verifica los datos ingresados.';

            return;
          }

          this.errorMessage =
            'No fue posible crear la cuenta. Inténtalo nuevamente.';

        }

      });

  }

}
