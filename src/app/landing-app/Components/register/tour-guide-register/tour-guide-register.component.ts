import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TourGuideRegistration } from '../register-interfaces';
import { AuthService } from '../../auth-service.service';

@Component({
  selector: 'app-tour-guide-register',
  imports: [FormsModule],
  templateUrl: './tour-guide-register.component.html',
  styleUrl: './tour-guide-register.component.scss'
})
export class TourGuideRegisterComponent {
  service = inject(AuthService);
  onSubmit() {
    this.service.register(this.model, 'tourguide')
  }
  model: TourGuideRegistration = {
    address: '',
    areasCovered: '',
    contactEmail: '',
    contactPhone: '',
    email: '',
    firstName: '',
    guideName: '',
    languages: '',
    lastName: '',
    licenseNumber: '',
    password: '',
    phoneNumber: '',
    pricePerHour: 0,
  };
}
