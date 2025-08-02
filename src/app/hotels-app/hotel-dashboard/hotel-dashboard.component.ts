import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { HotelsService } from '../hotels-service.service';
import { HotelDashBoard } from '../interfaces/hotel-dashboard';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../../landing-app/Components/auth-service.service';

@Component({
  selector: 'app-hotel-dashboard',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './hotel-dashboard.component.html',
  styleUrl: './hotel-dashboard.component.scss'
})
export class HotelDashboardComponent implements OnInit {

  constructor(private matDialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  authService = inject(AuthService);



  service = inject(HotelsService);

  isHotelReqFinished = false;

  private map: L.Map | undefined;

  hotelDashBoard!: HotelDashBoard;



  ngOnInit() {
    this.service.hotelDashBoard$.subscribe(
      {
        next: async (value) => {
          this.hotelDashBoard = value;
          this.isHotelReqFinished = true;
          if (isPlatformBrowser(this.platformId)) {
            const L = await import('leaflet');

            try {
              const res = await fetch(`https://us1.locationiq.com/v1/search?key=pk.bc35f990c1e814b1b565b73a70a93e5d&q=${this.hotelDashBoard.hotel?.address}&format=json`);
              const data = await res.json();
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);

              const map = L.map('map').setView([lat, lon], 13);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              }).addTo(map);

              L.marker([lat, lon]).addTo(map)
                .bindPopup(this.hotelDashBoard.hotel?.address || 'Hotel Location')
                .openPopup();

            } catch (error) {
              console.error("Failed to initialize map:", error);
            }
          }

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
    this.service.getHotelDashBoard();
  }

  logout() {
    this.authService.logout();
  }
}
