import { Component, inject } from '@angular/core';
import { HotelRegistration } from '../register-interfaces';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth-service.service';

@Component({
  selector: 'app-hotel-register',
  imports: [FormsModule],
  templateUrl: './hotel-register.component.html',
  styleUrl: './hotel-register.component.scss'
})
export class HotelRegisterComponent {

  service = inject(AuthService);
  onSubmit() {
    this.service.register(this.model, 'hotel')
  }
  model: HotelRegistration = {
    firstName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    hotelAddress: '',
    hotelName: '',
    rating: 0,
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  };
}
