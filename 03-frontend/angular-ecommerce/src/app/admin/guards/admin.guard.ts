import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // TODO: Implement proper authentication
    // For now, we'll use a simple flag. In a real application, 
    // this should check for proper authentication and admin role
    const isAdmin = true; // This should be replaced with actual auth logic

    if (isAdmin) {
      return true;
    }

    this.router.navigate(['/products']);
    return false;
  }
}