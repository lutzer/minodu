import { Component, OnInit } from '@angular/core';
import { Configuration } from '../_models/configuration';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { ConfigurationService } from '../_services/configuration.service';
import { AuthService } from '../_services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent implements OnInit{
      errorMessage = '';
      loading: boolean = false;
      configuration: Configuration | null = null;
      updateConfigurationForm: FormGroup;
      changePasswordForm: FormGroup;
      isFormSubmitted = false;
      isUpdated = false;
      isSubmitting = false;
      showPasswordModal = false;
      showPassword = false;
      showPasswordConfirm = false;
      isChangingPassword = false;
      passwordChangeMessage = '';
      passwordChangeError = '';

    constructor(private formBuilder: FormBuilder, private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private configurationService: ConfigurationService, private authService: AuthService){
      this.updateConfigurationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', null],
      address: ['', Validators.required],
      'whatsapp-link': ['', null],
      'station-link': ['', null],
      description: ['', Validators.required],
  });

      this.changePasswordForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
      }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(group: FormGroup) {
      const password = group.get('password');
      const passwordConfirm = group.get('passwordConfirm');
      if (password && passwordConfirm && password.value !== passwordConfirm.value) {
        passwordConfirm.setErrors({ 'passwordMismatch': true });
        return { 'passwordMismatch': true };
      }
      return null;
    }

    ngOnInit(): void {
      this.configurationService.getConfiguration().subscribe({
            next: data => {
              this.configuration = Configuration.fromJson(data);
              this.loading = false;
              // console.log(this.configuration)
            },
            error: err => {
              this.loading = false;
              this.errorMessage = err.error.message;
              // console.log(err.error)
              this.authService.logout();
            }
        });
    }

    openPasswordModal(): void {
      this.showPasswordModal = true;
      this.changePasswordForm.reset();
      this.passwordChangeMessage = '';
      this.passwordChangeError = '';
      // Réinitialiser tous les états du formulaire principal pour éviter l'affichage des alertes
      this.isFormSubmitted = false;
      this.isUpdated = false;
      this.errorMessage = '';
    }

    closePasswordModal(): void {
      this.showPasswordModal = false;
      this.changePasswordForm.reset();
      this.passwordChangeMessage = '';
      this.passwordChangeError = '';
      this.showPassword = false;
      this.showPasswordConfirm = false;
    }

    togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
    }

    togglePasswordConfirmVisibility(): void {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }

    submitPasswordChange(): void {
      if (this.changePasswordForm.valid && !this.isChangingPassword) {
        this.isChangingPassword = true;
        this.passwordChangeError = '';
        const newPassword = this.changePasswordForm.get('password')!.value;

        this.authService.changePassword(newPassword).subscribe({
          next: data => {
            this.passwordChangeMessage = 'Votre mot de passe a été changé avec succès.';
            this.isChangingPassword = false;
            setTimeout(() => {
              this.closePasswordModal();
            }, 2000);
          },
          error: err => {
            this.passwordChangeError = err.error.message || 'Une erreur est survenue lors du changement du mot de passe.';
            this.isChangingPassword = false;
          }
        });
      }
    }

  onSubmit(): void {
    const communityName = this.updateConfigurationForm.get('name')!.value;
    const location = this.updateConfigurationForm.get('location')!.value;
    const address = this.updateConfigurationForm.get('address')!.value;
    const whatsappLink = this.updateConfigurationForm.get('whatsapp-link')!.value;
    const stationLink = this.updateConfigurationForm.get('station-link')!.value;
    const description = this.updateConfigurationForm.get('description')!.value;

    this.isFormSubmitted = true;
    this.isUpdated = false;
    this.errorMessage = '';
    this.isSubmitting = true;

    if (this.updateConfigurationForm.valid) {
        this.configurationService.updateConfiguration(communityName, location, address, whatsappLink, stationLink, description).subscribe({
          next: data => {
               window.scroll(0,0);
                this.isUpdated = true;
                this.isSubmitting = false;
                setTimeout(() => {
                  this.isFormSubmitted = false;
                }, 3000);
                setTimeout(() => {
                  this.isUpdated = false;
                }, 5000);
          },
          error: err => {
            // console.log(err.error)
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
          }
        });
    } else {
      this.isSubmitting = false;
    }
  }
}
