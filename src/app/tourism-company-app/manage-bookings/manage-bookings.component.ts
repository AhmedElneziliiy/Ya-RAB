import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Booking } from '../interfaces/booking';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-bookings',
  imports: [RouterModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.scss',
  standalone: true,
})
export class ManageBookingsComponent implements OnInit {


  bookingService = inject(CompanyService);

  bookings: Booking[] = [];

  isBookingReqFinished = false;


  constructor(private route: ActivatedRoute, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.bookingService.bookings$.subscribe({
      next: (val) => {
        this.isBookingReqFinished = true;
        this.bookings = val;
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
      }
    });
    this.bookingService.getCompanyBookings();
  }
}
