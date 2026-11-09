import {
  Component
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';


@Component({
  selector: 'app-payment-cancel',

  imports: [
    RouterLink,
    MatButtonModule
  ],

  templateUrl: './payment-cancel.html',
  styleUrl: './payment-cancel.scss'
})
export class PaymentCancel {

}