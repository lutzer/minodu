import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../_models/users';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
      errorMessage = '';
      loading: boolean = false;
      users: User [] | null = null;

  constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private userService: UserService, private authService: AuthService){}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
          next: data => {
            this.users = data;
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
