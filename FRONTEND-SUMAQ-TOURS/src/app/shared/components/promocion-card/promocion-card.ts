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
  PromocionResponse
} from '../../models/promocion.model';


@Component({
  selector: 'app-promocion-card',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './promocion-card.html',
  styleUrl: './promocion-card.scss'
})
export class PromocionCard {

  readonly promocion =
    input.required<PromocionResponse>();

}