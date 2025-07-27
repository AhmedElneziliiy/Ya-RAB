import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../../shared/booking.service';
import { Hotel } from '../../interfaces/hotel';
import { HotelBooking } from '../../interfaces/hotel-booking';
import { Room } from '../../interfaces/room';
import { HotelsServiceService } from '../../Services/hotels-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../../../../shared-app/Components/navbar/navbar.component";

@Component({
  selector: 'app-hotel-booking',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent implements OnInit {
  hotel: Hotel | null = null;
  room: Room | null = null;
  booking: HotelBooking = {
    touristEmail: '',
    hotelID: '',
    roomID: '',
    bookingDate: '',
    totalPrice: 0
  };
  numberOfNights: number = 1;
  availableDates: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelsServiceService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.queryParamMap.get('hotelId');
    const roomId = this.route.snapshot.queryParamMap.get('roomId');
    if (hotelId && roomId) {
      this.booking.hotelID = hotelId;
      this.booking.roomID = roomId;
      this.loadHotelDetails(hotelId);
      this.loadRoomDetails(hotelId, roomId);
      this.generateFutureDates();
    } else {
      this.errorMessage = 'Invalid hotel or room ID.';
    }
  }

  loadHotelDetails(hotelId: string): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
      },
      error: (err) => {
        this.errorMessage = `Error loading hotel details: ${err.message}`;
      }
    });
  }

  loadRoomDetails(hotelId: string, roomId: string): void {
    this.hotelService.getHotelRooms(hotelId).subscribe({
      next: (rooms) => {
        this.room = rooms.find(r => r.roomId === roomId) || null;
        if (!this.room) {
          this.errorMessage = 'Room not found.';
        }
      },
      error: (err) => {
        this.errorMessage = `Error loading room details: ${err.message}`;
      }
    });
  }

  generateFutureDates(): void {
    const today = new Date('2025-07-20'); // Current date
    this.availableDates = [];
    for (let i = 1; i <= 30; i++) { // Next 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.availableDates.push(date.toISOString());
    }
  }

  calculateTotalPrice(): number {
    return this.room ? this.room.pricePerNight * this.numberOfNights : 0;
  }

  submitBooking(): void {
    if (!this.validateForm()) return;
    this.booking.totalPrice = this.calculateTotalPrice();
    this.bookingService.createHotelBooking(this.booking).subscribe({
      next: (response) => {
        this.successMessage = 'Booking created successfully!';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/hotel-reservation']), 2000);
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
    if (this.numberOfNights < 1) {
      this.errorMessage = 'Number of nights must be at least 1.';
      return false;
    }
    if (!this.room || !this.room.isAvailable) {
      this.errorMessage = 'Selected room is not available.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  goBack(): void {
    this.router.navigate(['/hotels-details', this.booking.hotelID]);
  }
}