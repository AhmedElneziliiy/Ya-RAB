import { inject } from "@angular/core";
import { AuthService } from "./auth-service/Services/Auth/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const redirectToDashboardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const user = authService.userValue;
  if (user && user.token && user.role) {
    authService.redirectToDashboard(user.role);
    return false;
  }
  return true;
};