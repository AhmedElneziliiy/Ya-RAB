
import { Component, inject } from "@angular/core";
import { TouristRegistration } from "../register-interfaces";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../auth-service.service";

@Component({
  selector: 'app-tourist-registration',
  templateUrl: './tourist-register.component.html',
  imports: [FormsModule,],
  styleUrls: ['./tourist-register.component.scss']
})
export class TouristRegisterComponent {

  service = inject(AuthService);

  model: TouristRegistration = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    preferences: '',
    favoriteDestinations: ''
  };

  onSubmit() {
    this.service.register(this.model, 'tourist')
  }
}