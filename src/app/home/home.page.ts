import { Component, OnInit } from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Environment,
    MyLocation,
    GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    map: GoogleMap;
    loading: any;
    constructor(
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private platform: Platform,
        private apiService: ApiService
    ) { }

    async ngOnInit() {
        await this.platform.ready();
        await this.loadMap();
        await this.getPosition();

        this.apiService.getTrash().subscribe((data: any) => {
            data.forEach(item => {
                this.addTrash(item);
            });
        })
    }

    loadMap() {
        this.map = GoogleMaps.create('map_canvas', {
            camera: {
                target: {
                    lat: 43.0741704,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 30
            }
        });
    }

    async getPosition() {
        this.map.clear();
        this.loading = await this.loadingCtrl.create({
            message: 'Please wait...'
        });
        await this.loading.present();

        // Get the location of you
        this.map.getMyLocation().then((location: MyLocation) => {
            this.loading.dismiss();
            console.log(JSON.stringify(location, null, 2));

            // Move the map camera to the location with animation
            this.map.animateCamera({
                target: location.latLng,
                zoom: 17,
                tilt: 30
            });

            // add a marker
            const marker: Marker = this.map.addMarkerSync({
                title: 'Me',
                snippet: 'Current position',
                position: location.latLng,
                animation: GoogleMapsAnimation.BOUNCE
            });

            // show the infoWindow
            marker.showInfoWindow();

            // If clicked it, display the alert
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                this.showToast('clicked!');
            });
        })
            .catch(err => {
                this.loading.dismiss();
                this.showToast(err.error_message);
            });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });

        toast.present();
    }

    addTrash(item) {
        // add a marker
        const marker: Marker = this.map.addMarkerSync({
            title: item.name,
            snippet: item.name,
            position: {
                lat: item.sector.lat,
                lng: item.sector.lng
            },
            animation: GoogleMapsAnimation.BOUNCE
        });

        // show the infoWindow
        marker.showInfoWindow();

        // If clicked it, display the alert
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast('clicked!');
        });
    }
}
