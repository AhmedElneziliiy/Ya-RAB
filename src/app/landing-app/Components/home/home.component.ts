import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { HeroSectionComponent } from "./Components/hero-section/hero-section.component";
import { WhoUsComponentComponent } from "./Components/who-us-component/who-us-component.component";
import { TravellersGalleryComponent } from "./Components/travellers-gallery/travellers-gallery.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
