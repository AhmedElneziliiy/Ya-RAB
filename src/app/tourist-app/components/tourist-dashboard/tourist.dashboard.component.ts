import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBookingComponent } from './delete-booking/delete-booking.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Booking, Tourist } from '../tourist';
import { TouristService } from '../../tourist.service';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [MatProgressSpinner, CommonModule, NavbarComponent, RouterLink],
  templateUrl: './tourist.dashboard.component.html',
  styleUrl: './tourist.dashboard.component.scss',
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class TouristDashboardComponent implements OnInit {

  tourist!: Tourist;

  isTouristReq = false;

  filteredBookings!: Booking[];

  filteredStatus = '';

  constructor(private matDialog: MatDialog, private service: TouristService, private el: ElementRef, private renderer: Renderer2) { }



  ngOnInit(): void {
    this.service.touristDashBoard$.subscribe(
      {
        next: (value) => {
          console.log('in here!');
          this.isTouristReq = true;
          this.tourist = value;
          this.filteredBookings = [];
          this.filteredStatus = 'Pending';
          this.filteredBookings = this.tourist.bookings.filter(
            (e) => e.status === this.filteredStatus
          );
        },
      }
    );
    this.service.getTourist();
  }

  openDeleteDialog(id: string) {
    this.matDialog.open(DeleteBookingComponent, {
      data: { id: id }
    });
  }

  print(item: Booking) {
    console.log(item.bookingID)
  }

  filterBookings(status: string) {
    this.filteredStatus = status;
    this.filteredBookings = [];
    this.tourist.bookings.map((e) => {
      if (e.status == status) {
        this.filteredBookings.push(e);
      }
    });
    console.log(`list with ${status} is ${this.filteredBookings}`);

  }
}
