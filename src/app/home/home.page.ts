// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  travels: Travel[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private travelService: TravelService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadTravels();
  }

  loadTravels() {
    this.isLoading = true;
    this.error = null;

    this.travelService.getTravels().subscribe({
      next: (data) => {
        this.travels = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading travels:', error);
        this.isLoading = false;
        this.error = error;
        this.showError('Unable to load travels. Please try again later.');
      }
    });
  }

  async showError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  goToAddTrip() {
    this.navCtrl.navigateForward('/add-trip');
  }

  toggleFavorite(travel: Travel) {
    const updatedStatus = !travel.isFav;
    this.travelService.updateTravel(travel.id!, { ...travel, isFav: updatedStatus }).subscribe({
      next: (updatedTravel) => {
        travel.isFav = updatedStatus;
      },
      error: (error) => {
        console.error('Error updating favorite status:', error);
        this.showError('Unable to update favorite status. Please try again later.');
      }
    });
  }
}