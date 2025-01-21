import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TravelService } from '../services/travel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.page.html',
  styleUrls: ['./add-trip.page.scss'],
  standalone: false
})
export class AddTripPage {
  newTrip = {
    description: '',
    type: '',
    state: '',
    startAt: null,
    endAt: null,
    createdBy: 'Alvaro',
    note: '',
    isFav: false
  };

  constructor(
    private travelService: TravelService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  async addTrip() {
    const loading = await this.loadingController.create({
      message: 'Adding trip...'
    });
    await loading.present();

    this.travelService.addTravel(this.newTrip).subscribe({
      next: async () => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Trip added successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
          window.location.reload();
        });
      },
      error: async (error: Error) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error adding trip: ' + error.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}