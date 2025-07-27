import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TourGuideBooking } from '../../../Hotels/main-page/interfaces/tour-guide-booking';
import { BookingService } from '../../../shared/booking.service';
import { TourGuide } from '../interfaces/tour-guide';
import { TourGuideService } from '../Services/tour-guide.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../../shared-app/Components/navbar/navbar.component';

@Component({
  selector: 'app-tour-guide-booking',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './tour-guide-booking.component.html',
  styleUrl: './tour-guide-booking.component.scss'
})
export class TourGuideBookingComponent implements OnInit {
  tourGuide: TourGuide | null = null;
  booking: TourGuideBooking = {
    touristEmail: '',
    tourGuideID: '',
    bookingDate: '',
    totalPrice: 0
  };
  numberOfHours: number = 1;
  availableDates: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourGuideService: TourGuideService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const guideId = this.route.snapshot.queryParamMap.get('guideId');
    if (guideId) {
      this.booking.tourGuideID = guideId;
      this.loadTourGuideDetails(guideId);
      this.generateFutureDates();
    } else {
      this.errorMessage = 'Invalid tour guide ID.';
    }
  }

  loadTourGuideDetails(guideId: string): void {
    this.tourGuideService.getTourGuideById(guideId).subscribe({
      next: (guide) => {
        this.tourGuide = guide;
      },
      error: (err) => {
        this.errorMessage = `Error loading tour guide details: ${err.message}`;
      }
    });
  }

  generateFutureDates(): void {
    const today = new Date('2025-07-20T05:39:00+03:00'); // Current date and time in EEST
    this.availableDates = [];
    for (let i = 1; i <= 30; i++) { // Next 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.availableDates.push(date.toISOString());
    }
  }

  calculateTotalPrice(): number {
    return this.tourGuide ? this.tourGuide.pricePerHour * this.numberOfHours : 0;
  }

  submitBooking(): void {
    if (!this.validateForm()) return;
    this.booking.totalPrice = this.calculateTotalPrice();
    this.bookingService.createTourGuideBooking(this.booking).subscribe({
      next: (response) => {
        this.successMessage = 'Booking created successfully!';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/tour-guides']), 2000);
      },
      error: (err) => {
        this.errorMessage = `Booking failed: ${err.message}`;
        this.successMessage = null;
      }
    });
  }

  validateForm(): boolean {
    if (!this.booking.touristEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.booking.touristEmail)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    if (!this.booking.bookingDate) {
      this.errorMessage = 'Please select a booking date.';
      return false;
    }
    if (this.numberOfHours < 1) {
      this.errorMessage = 'Number of hours must be at least 1.';
      return false;
    }
    if (!this.tourGuide || !this.tourGuide.isAvailable) {
      this.errorMessage = 'Selected tour guide is not available.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  goBack(): void {
    this.router.navigate(['/tour-guide-details', this.booking.tourGuideID]);
  }
}