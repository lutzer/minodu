import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../_models/users';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_DOMAIN, TOKEN_KEY } from '../_helpers/constants';
import { ROLE } from '../_helpers/role.enum';
import { USER_STATUS } from '../_helpers/user_status.enum';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isFormSubmitted = false;
  isLoginSuccessful = false;
  errorMessage = '';
  user: User | null = null;


  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      phone: ['', Validators.required],
      password: ['', Validators.required]
    });
}
  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
ngOnInit(): void {
  if (this.authService.isAuthenticated()) {
     //Auth logics
      this.authService.getUser().subscribe({
        next: data => {
          this.user = User.fromJson(data);
          this.isLoginSuccessful = true;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.isFormSubmitted = true;
          this.isLoginSuccessful = false;
          this.errorMessage = err.error.message;
          this.router.navigate(['/home/logout'])
        }
      });
   
  }
}

onSubmit(): void {
  const phone = this.loginForm.get('phone')!.value;
  const password = this.loginForm.get('password')!.value;
  this.isFormSubmitted = true;

  if (this.loginForm.valid) {
    this.errorMessage = '';
    this.authService.login(phone, password).subscribe({
      next: data => {
        // console.log(data)
        if(data.role.name!=ROLE.ADMIN){
          this.errorMessage = "Connexion impossible : Vous ne disposez pas des autorisations nécessaires pour accéder à ce service!";
          return
        }
        if(data.status.name!=USER_STATUS.ACTIVATED){
          this.errorMessage = "Connexion impossible : Votre compte est inactif!";
          return
        }
        this.cookieService.set(TOKEN_KEY, data.access_token, { expires: 30, path: '/', domain: COOKIE_DOMAIN, secure: false });

        if (this.authService.isAuthenticated()){
            this.user = User.fromJson(data);
            this.isLoginSuccessful = true;
            window.location.href = "/admin";
        }else{
          this.errorMessage = "Problème d'authentification, veuillez réessayer.";
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });
  }
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}
}
