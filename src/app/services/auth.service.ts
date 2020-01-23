import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authState = new BehaviorSubject(false);

    constructor(
        private router: Router,
        private storage: Storage,
        private platform: Platform,
        private toastController: ToastController,
        private http: HttpClient
    ) {
        this.platform.ready().then(() => {
            this.ifLoggedIn();
        });
    }

    ifLoggedIn() {
        this.storage.get('USER_INFO').then((response) => {
            if (response) {
                this.authState.next(true);
            }
        });
    }


    login(body) {
        this.http.post(`${environment.apiUrl}/rest-auth/login/`, body).subscribe((data: any) => {
            this.storage.set('token', data.key).then((response) => {
                this.router.navigate(['/']);
                this.authState.next(true);
            });
        }, (err: any) => {
            this.showToast(err.non_field_errors);
        })
    }

    logout() {
        this.storage.remove('USER_INFO').then(() => {
            this.router.navigate(['login']);
            this.authState.next(false);
        });
    }

    isAuthenticated() {
        return this.authState.value;
    }

    async showToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });

        toast.present();
    }
}
