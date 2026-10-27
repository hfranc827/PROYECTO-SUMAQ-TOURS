import {
  Component,
  input
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  DestinoResponse
} from '../../models/destino.model';


@Component({
  selector: 'app-destino-card',

  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './destino-card.html',
  styleUrl: './destino-card.scss'
})
export class DestinoCard {

  readonly destino =
    input.required<DestinoResponse>();

}