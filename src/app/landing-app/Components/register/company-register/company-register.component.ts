import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyRegistration } from '../register-interfaces';
import { AuthService } from '../../auth-service.service';

@Component({
  selector: 'app-company-register',
  imports: [FormsModule],
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.scss'
})
export class CompanyRegisterComponent {
  service = inject(AuthService);
  model: CompanyRegistration = {
    address: '',
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    email: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
    password: '',
    phoneNumber: '',
  };
  onSubmit() {
    this.service.register(this.model, 'tourismcompany')
  }
}
