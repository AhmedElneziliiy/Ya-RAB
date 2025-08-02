import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service.service';
import { User } from './user';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { title } from 'process';
@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  user!: User;

  service = inject(AuthService);

  isLoggingIn!: boolean;

  constructor(private matDialog: MatDialog, private router: Router) {
    this.user = {
      email: '',
      password: '',
    }
  }

  login() {

    let message = ``;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(this.user.email!)) {
      message += `Please enter a valid email address `;
    }

    if (this.user.password!.length < 6) {
      message += `\n\nPassword must be at least 6 characters long.`;
    }

    if (message != '') {
      this.matDialog.open(AlertDialogComponent, {
        data: {
          title: 'Error',
          message: message,
        }
      });
      return;
    }
    else {
      const ref = this.matDialog.open(LoadingDialogComponent, {
        disableClose: true,
      })

      this.service.login(this.user).subscribe({
        next: (value) => {
          ref.close();
          localStorage.setItem('email', this.user.email!);
          console.log(value);
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'TripLink',
              message: 'Login is successful!',
            }
          });
        },
        error: (err) => {
          ref.close();
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: 'Error Logging In,Try Again Later or check your connection then try'
            }
          });
        },
      });
      this.service.login(this.user);
    }
  }

  logUser() {
    console.log(this.user);
  }
}
