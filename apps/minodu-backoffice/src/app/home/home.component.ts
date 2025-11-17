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

  constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private userService: UserService, private authService: AuthService){}
  ngOnInit(): void {
    this.userService.getUserDashboard().subscribe({
      next: data => {
        this.dashboard = Dashboard.fromJson(data);
        console.log(this.dashboard)
        this.user = this.dashboard.user;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        console.log(err.error)
        this.authService.logout();
      }
    });
  }

}
