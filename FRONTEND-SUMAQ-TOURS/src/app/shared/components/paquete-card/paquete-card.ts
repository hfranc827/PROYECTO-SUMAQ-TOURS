import {
  Component,
  input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatCardModule
} from '@angular/material/card';

import {
  PaqueteResponse
} from '../../models/paquete.model';


@Component({
  selector: 'app-paquete-card',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './paquete-card.html',
  styleUrl: './paquete-card.scss'
})
export class PaqueteCard {

  readonly paquete =
    input.required<PaqueteResponse>();

}