import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Auth {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = environment.apiUrl;

}