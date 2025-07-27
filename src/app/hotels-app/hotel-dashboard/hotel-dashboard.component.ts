import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { HotelsService } from '../hotels-service.service';
import { HotelDashBoard } from '../interfaces/hotel-dashboard';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-hotel-dashboard',
  imports: [MatProgressSpinner, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './hotel-dashboard.component.html',
  styleUrl: './hotel-dashboard.component.scss'
})
export class HotelDashboardComponent implements OnInit, AfterViewInit {

  constructor(private matDialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');

      let lat = 0;
      let lon = 0;

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.hotelDashBoard.hotel?.address}`)
        .then(res => res.json())
        .then(data => {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);

        });

      const map = L.map('map').setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    }
  }

  service = inject(HotelsService);

  isHotelReqFinished = false;

  private map: L.Map | undefined;

  hotelDashBoard!: HotelDashBoard;
  ngOnInit(): void {
    this.service.hotelDashBoard$.subscribe(
      {
        next: (value) => {
          this.hotelDashBoard = value;
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
    this.service.getHotelDashBoard();
  }
}
