import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-google-maps-modal',
  templateUrl: './google-maps-modal.component.html',
  styleUrls: ['./google-maps-modal.component.scss'],
  standalone: false
})
export class GoogleMapsModalComponent implements OnInit {
  latitude: number = 41.026683;
  longitude: number = -7.779658;
  selectedLocation: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  mapClicked(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      this.selectedLocation = `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`;
    }
  }

  saveLocation() {
    this.modalController.dismiss(this.selectedLocation);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}