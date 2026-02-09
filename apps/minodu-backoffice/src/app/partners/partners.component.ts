import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PartnersService } from '../_services/partners.service';
import { Partner } from '../_models/partners';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css'
})
export class PartnersComponent implements OnInit {
  partners: Partner[] = [];
  loading = true;
  errorMessage = '';
  isEditMode = false;
  isSubmitting = false;
  isFormSubmitted = false;
  isAdded = false;
  isUpdated = false;
  isDeleting = false;
  partnerToDelete: Partner | null = null;
  currentPartnerId: number | null = null;

  addPartnerForm: FormGroup;

  constructor(
    private partnersService: PartnersService,
    private formBuilder: FormBuilder
  ) {
    this.addPartnerForm = this.formBuilder.group({
      name: ['', Validators.required],
      adresse: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-()]+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading = true;
    this.partnersService.getPartners().subscribe({
      next: (data) => {
        this.partners = data.map((item: any) => Partner.fromJson(item));
        this.loading = false;
        // console.log(this.partners);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des partenaires.';
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentPartnerId = null;
    this.addPartnerForm.reset();
    this.isFormSubmitted = false;
    this.isAdded = false;
    this.isUpdated = false;
    this.errorMessage = '';
  }

  editPartner(partner: Partner): void {
    this.isEditMode = true;
    this.currentPartnerId = partner.id;
    this.addPartnerForm.patchValue({
      name: partner.name,
      adresse: partner.adresse,
      phone: partner.phone
    });
    this.isFormSubmitted = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    if (this.addPartnerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      const name = this.addPartnerForm.get('name')!.value;
      const adresse = this.addPartnerForm.get('adresse')!.value;
      const phone = this.addPartnerForm.get('phone')!.value;

      if (this.isEditMode && this.currentPartnerId) {
        this.partnersService.updatePartner(this.currentPartnerId, name, adresse, phone).subscribe({
          next: () => {
            this.isUpdated = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-partner');
              this.loadPartners();
            }, 1200);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
          }
        });
      } else {
        this.partnersService.addPartner(name, adresse, phone).subscribe({
          next: () => {
            this.isAdded = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-partner');
              this.loadPartners();
            }, 1200);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout.';
          }
        });
      }
    }
  }

  confirmDelete(partner: Partner): void {
    this.partnerToDelete = partner;
  }

  deletePartner(): void {
    if (this.partnerToDelete) {
      this.isDeleting = true;
      this.partnersService.deletePartner(this.partnerToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.partnerToDelete = null;
          this.closeModal('modal-delete');
          this.loadPartners();
        },
        error: (err) => {
          this.isDeleting = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la suppression.';
        }
      });
    }
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
  }

  resetForm(): void {
    setTimeout(() => {
      this.isFormSubmitted = false;
      this.isSubmitting = false;
      this.isEditMode = false;
      this.currentPartnerId = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addPartnerForm.reset();
    }, 1200);
  }

  getModalTitle(): string {
    return this.isEditMode ? 'Modifier le partenaire' : 'Nouveau partenaire';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Ajouter';
  }
}