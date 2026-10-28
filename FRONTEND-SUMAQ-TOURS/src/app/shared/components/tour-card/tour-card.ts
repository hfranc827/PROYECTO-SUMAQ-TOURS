import {
  Component,
  input
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  TourResponse
} from '../../models/tour.model';


@Component({
  selector: 'app-tour-card',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './tour-card.html',
  styleUrl: './tour-card.scss'
})
export class TourCard {

  readonly tour =
    input.required<TourResponse>();

}