import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../_helpers/loader.service';
import { UserService } from '../_services/users.service';
import { AuthService } from '../_services/auth.service';
import { Dashboard } from '../_models/dashboard';

declare var gtag: Function;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    errorMessage = '';
    loading: boolean = false;
    user: any = null;
    dashboard: Dashboard | null = null;
    showLogoutModal: boolean = false;

  constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private userService: UserService, private authService: AuthService){}
  
  ngOnInit(): void {
    this.userService.getUserDashboard().subscribe({
      next: data => {
        this.dashboard = Dashboard.fromJson(data);
        // console.log(this.dashboard)
        this.user = this.dashboard.user;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        // console.log(err.error)
        this.authService.logout();
      }
    });
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  logout(): void {
    this.closeModal('modal-logout');
    this.authService.logout();
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) {
        backdrop.remove();
      }
    }
    this.showLogoutModal = false;
  }
}