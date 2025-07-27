import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HotelsService } from '../hotels-service.service';
import { Hotel } from '../interfaces/hotel-dashboard';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-manage-hotel-profile',
  imports: [FormsModule, MatProgressSpinner],
  standalone: true,
  templateUrl: './manage-hotel-profile.component.html',
  styleUrl: './manage-hotel-profile.component.scss'
})
export class ManageHotelProfileComponent implements OnInit {
  service = inject(HotelsService);
  constructor(private route: ActivatedRoute, private matDialog: MatDialog) { }

  photos: File[] = [];

  hotel!: Hotel;

  isHotelReqFinished = false;

  ngOnInit(): void {
    this.service.profileDashBoard$.subscribe(
      {
        next: (value) => {
          this.hotel = value;
          this.isHotelReqFinished = true;
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: message
            }
          });
        },
      }
    );
    this.service.getHotelProfile();
  }



  editProfile() {
    const formData = new FormData();
    formData.append('HotelName', this.hotel.hotelName);
    formData.append('Address', this.hotel.address);
    formData.append('Description', this.hotel.description);
    formData.append('ContactEmail', this.hotel.contactEmail);
    formData.append('ContactPhone', this.hotel.contactPhone);
    console.log(this.hotel.photoUrls);

    this.photos.map(
      (e) => {
        formData.append('Photos', e);
      }
    );
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.editProfile(formData, this.hotel.hotelID).subscribe({
      next: (value) => {
        ref.close();
        this.hotel = value;
        this.matDialog.open(AlertDialogComponent, {
          data: {
            title: 'TripLink',
            message: 'Profile Updated Successfully!',
            method: () => {
              inject(Router).navigate(['/hotel/profile']);
            }
          }
        });
      },
      error: (err) => {
        ref.close();
        let message = '';
        err['error']['errors'].map((e: string) => message += e + '\n');
        this.matDialog.open(AlertDialogComponent, {
          data: {
            title: 'Error',
            message: message
          }
        });
      },
    });
  }

  toFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }

  addPhotosToForm(event: Event) {
    this.photos = [];
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
      }
    }
    console.log('number of photos : ' + this.photos.length);
  }

}
