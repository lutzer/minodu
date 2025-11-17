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
      isFormSubmitted = false;
      isUpdated = false;
      isSubmitting = false;

    constructor(private formBuilder: FormBuilder, private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private configurationService: ConfigurationService, private authService: AuthService){
      this.updateConfigurationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', null],
      address: ['', Validators.required],
      'whatsapp-link': ['', null],
      'station-link': ['', null],
      description: ['', Validators.required],
  });
    }

    ngOnInit(): void {
      this.configurationService.getConfiguration().subscribe({
            next: data => {
              this.configuration = Configuration.fromJson(data);
              this.loading = false;
              console.log(this.configuration)
            },
            error: err => {
              this.loading = false;
              this.errorMessage = err.error.message;
              console.log(err.error)
              this.authService.logout();
            }
        });
    }


  onSubmit(): void {
    const communityName = this.updateConfigurationForm.get('name')!.value;
    const location = this.updateConfigurationForm.get('location')!.value;
    const address = this.updateConfigurationForm.get('address')!.value;
    const whatsappLink = this.updateConfigurationForm.get('whatsapp-link')!.value;
    const stationLink = this.updateConfigurationForm.get('station-link')!.value;
    const description = this.updateConfigurationForm.get('description')!.value;

    this.isFormSubmitted = true;


    if (this.updateConfigurationForm.valid) {
        this.configurationService.updateConfiguration(communityName, location, address, whatsappLink, stationLink, description).subscribe({
          next: data => {
               window.scroll(0,0);
                this.isUpdated = true;
                setTimeout(() => {
                  this.isFormSubmitted = false;
                  this.isSubmitting = false;
                }, 3000);
                setTimeout(() => {
                  this.isUpdated = false;
                }, 5000);
          },
          error: err => {
            console.log(err.error)
            this.isFormSubmitted = true;
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
          }
        });
    }
  }
}
