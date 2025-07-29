import { Component, inject, OnInit } from '@angular/core';
import { Package } from '../interfaces/package';
import { CompanyService } from '../services/company.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TourismCompanyNavbarComponent } from "../tourism-company-navbar/tourism-company-navbar.component";
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeletePackageComponent } from '../dashboard/delete-package/delete-package.component';

@Component({
  selector: 'app-show-packages',
  imports: [MatProgressSpinnerModule, RouterLink],
  templateUrl: './show-packages.component.html',
  styleUrl: './show-packages.component.scss'
})
export class ShowPackagesComponent implements OnInit {
  openDeleteDialog(id: string) {
    this.matDialog.open(DeletePackageComponent, {
      data: {
        id: id,
      }
    });
  }
  isPackagesReqFinished = false;
  packages: Package[] = [];

  service = inject(CompanyService);

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.service.packages$.subscribe({
      next: (val) => {
        this.packages = val;
        this.isPackagesReqFinished = true;
      },
      error: (err) => {
        console.error('Error fetching packages:', err);
      }
    });
    this.service.getCompanyPackages();
  }
}
