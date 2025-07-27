import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HotelNavbarComponent } from "../hotel-navbar/hotel-navbar.component";

@Component({
  selector: 'app-hotel-component',
  imports: [RouterOutlet, HotelNavbarComponent],
  standalone: true,
  templateUrl: './hotel-component.component.html',
  styleUrl: './hotel-component.component.scss'
})
export class HotelComponent {

}
