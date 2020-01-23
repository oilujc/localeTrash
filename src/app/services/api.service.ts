import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  getTrash() {

    const token = this.storage.get('token');
    const headers = new HttpHeaders().set('Authorization',`token ${token}`);
    return this.http.get(`${environment.apiUrl}/api/trash/`, {headers});
  }
}
