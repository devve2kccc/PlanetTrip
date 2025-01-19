import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelService } from '../services/travel.service';
import { Travel, Location, TravelComment } from '../models/travel.model';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { GoogleMapsModalComponent } from '../google-maps-modal/google-maps-modal.component';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
  standalone: false
})
export class TripDetailPage implements OnInit {
  trip: Travel | null = null;
  locations: Location[] = [];
  comments: TravelComment[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private travelService: TravelService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.loadTripDetails(tripId);
      this.loadLocations(tripId);
    } else {
      this.showError('Trip ID not found');
      this.router.navigate(['/home']);
    }
  }

  loadTripDetails(id: string) {
    this.isLoading = true;
    this.error = null;

    this.travelService.getTravel(id).subscribe({
      next: (data) => {
        this.trip = data;
        this.comments = data.comments || []; // Extract comments from travel data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trip details:', error);
        this.isLoading = false;
        this.error = error;
        this.showError('Unable to load trip details. Please try again later.');
        this.router.navigate(['/home']);
      }
    });
  }

  loadLocations(tripId: string) {
    this.travelService.getLocations(tripId).subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.showError('Unable to load locations. Please try again later.');
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

  async showSuccess(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async editTrip() {
    const alert = await this.alertController.create({
      header: 'Edit Trip',
      inputs: [
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description',
          value: this.trip?.description
        },
        {
          name: 'type',
          type: 'text',
          placeholder: 'Type',
          value: this.trip?.type
        },
        {
          name: 'state',
          type: 'text',
          placeholder: 'State',
          value: this.trip?.state
        },
        {
          name: 'startAt',
          type: 'date',
          placeholder: 'Start Date',
          value: this.trip?.startAt ? new Date(this.trip.startAt).toISOString().split('T')[0] : ''
        },
        {
          name: 'endAt',
          type: 'date',
          placeholder: 'End Date',
          value: this.trip?.endAt ? new Date(this.trip.endAt).toISOString().split('T')[0] : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if (this.trip) {
              const updatedTrip: Travel = {
                ...this.trip,
                description: data.description,
                type: data.type,
                state: data.state,
                startAt: data.startAt ? new Date(data.startAt) : null,
                endAt: data.endAt ? new Date(data.endAt) : null
              };
              this.travelService.updateTravel(this.trip.id!, updatedTrip).subscribe({
                next: () => {
                  this.trip = updatedTrip;
                  this.showSuccess('Trip updated successfully!');
                },
                error: (error) => {
                  console.error('Error updating trip:', error);
                  this.showError('Unable to update trip. Please try again later.');
                }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteTrip() {
    const alert = await this.alertController.create({
      header: 'Delete Trip',
      message: 'Are you sure you want to delete this trip?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            if (this.trip) {
              this.travelService.deleteTravel(this.trip.id!).subscribe({
                next: () => {
                  this.showSuccess('Trip deleted successfully!');
                  this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
                    window.location.reload();
                  });
                },
                error: (error) => {
                  console.error('Error deleting trip:', error);
                  this.showError('Unable to delete trip. Please try again later.');
                }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async addLocation() {
    const modal = await this.modalController.create({
      component: GoogleMapsModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.saveLocation(result.data);
      }
    });

    await modal.present();
  }

  saveLocation(mapUrl: string) {
    const alert = this.alertController.create({
      header: 'Add Location',
      inputs: [
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        },
        {
          name: 'type',
          type: 'text',
          placeholder: 'Type'
        },
        {
          name: 'state',
          type: 'text',
          placeholder: 'State'
        },
        {
          name: 'map',
          type: 'text',
          placeholder: 'Map URL',
          value: mapUrl
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (this.trip) {
              const newLocation: Location = {
                travelId: this.trip.id!,
                description: data.description,
                type: data.type,
                state: data.state,
                map: data.map
              };
              this.travelService.addLocation(newLocation).subscribe({
                next: (location) => {
                  this.locations.push(location);
                  this.showSuccess('Location added successfully!');
                },
                error: (error) => {
                  console.error('Error adding location:', error);
                  this.showError('Unable to add location. Please try again later.');
                }
              });
            }
          }
        }
      ]
    });

    alert.then(alertEl => alertEl.present());
  }

  async editLocation(location: Location) {
    const alert = await this.alertController.create({
      header: 'Edit Location',
      inputs: [
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description',
          value: location.description
        },
        {
          name: 'type',
          type: 'text',
          placeholder: 'Type',
          value: location.type
        },
        {
          name: 'state',
          type: 'text',
          placeholder: 'State',
          value: location.state
        },
        {
          name: 'map',
          type: 'text',
          placeholder: 'Map URL',
          value: location.map
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            const updatedLocation: Location = {
              ...location,
              description: data.description,
              type: data.type,
              state: data.state,
              map: data.map
            };
            this.travelService.updateLocation(location.id!, updatedLocation).subscribe({
              next: () => {
                const index = this.locations.findIndex(loc => loc.id === location.id);
                if (index !== -1) {
                  this.locations[index] = updatedLocation;
                }
                this.showSuccess('Location updated successfully!');
              },
              error: (error) => {
                console.error('Error updating location:', error);
                this.showError('Unable to update location. Please try again later.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteLocation(location: Location) {
    const alert = await this.alertController.create({
      header: 'Delete Location',
      message: 'Are you sure you want to delete this location?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.travelService.deleteLocation(location.id!).subscribe({
              next: () => {
                this.locations = this.locations.filter(loc => loc.id !== location.id);
                this.showSuccess('Location deleted successfully!');
              },
              error: (error) => {
                console.error('Error deleting location:', error);
                this.showError('Unable to delete location. Please try again later.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async addComment() {
    const alert = await this.alertController.create({
      header: 'Add Comment',
      inputs: [
        {
          name: 'comment',
          type: 'textarea',
          placeholder: 'Comment content'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (this.trip) {
              const newComment: TravelComment = {
                travelId: this.trip.id!,
                comment: data.comment,
                createdAt: new Date()
              };
              this.travelService.addTravelComment(newComment).subscribe({
                next: (comment) => {
                  this.comments.push(comment);
                  this.showSuccess('Comment added successfully!');
                },
                error: (error) => {
                  console.error('Error adding comment:', error);
                  this.showError('Unable to add comment. Please try again later.');
                }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteComment(comment: TravelComment) {
    const alert = await this.alertController.create({
      header: 'Delete Comment',
      message: 'Are you sure you want to delete this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.travelService.deleteTravelComment(comment.id!).subscribe({
              next: () => {
                this.comments = this.comments.filter(c => c.id !== comment.id);
                this.showSuccess('Comment deleted successfully!');
              },
              error: (error) => {
                console.error('Error deleting comment:', error);
                this.showError('Unable to delete comment. Please try again later.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}