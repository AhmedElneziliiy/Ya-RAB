import { Component } from '@angular/core';
import { TourismCompanyNavbarComponent } from '../tourism-company-navbar/tourism-company-navbar.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-tourism-company',
    imports: [RouterModule, TourismCompanyNavbarComponent],
    styleUrl: 'tourism-company-component.scss',
    templateUrl: 'tourism-company-component.html'
})
export class TourismCompanyComponent {
}
