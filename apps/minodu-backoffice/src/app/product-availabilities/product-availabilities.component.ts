import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductAvailabilitiesService } from '../_services/product-availabilities.service';
import { FarmersService } from '../_services/farmers.service';
import { ProductsService } from '../_services/products.service';
import { ProductAvailability } from '../_models/productAvailabilities';
import { Farmer } from '../_models/farmers';
import { Product } from '../_models/products';
import { User } from '../_models/users';

@Component({
  selector: 'app-product-availabilities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-availabilities.component.html',
  styleUrl: './product-availabilities.component.css'
})
export class ProductAvailabilitiesComponent implements OnInit {
  productAvailabilities: ProductAvailability[] = [];
  archivedAvailabilities: ProductAvailability[] = [];
  farmers: Farmer[] = [];
  users: User[] = [];
  products: Product[] = [];
  loading = true;
  loadingArchived = false;
  errorMessage = '';
  isEditMode = false;
  isSubmitting = false;
  isFormSubmitted = false;
  isAdded = false;
  isUpdated = false;
  isDeleting = false;
  isArchiving = false;
  availabilityToDelete: ProductAvailability | null = null;
  availabilityToArchive: ProductAvailability | null = null;
  currentAvailabilityId: number | null = null;
  activeTab: 'active' | 'archived' = 'active';

  addAvailabilityForm: FormGroup;

  constructor(
    private productAvailabilitiesService: ProductAvailabilitiesService,
    private farmersService: FarmersService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder
  ) {
    this.addAvailabilityForm = this.formBuilder.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      farmerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductAvailabilities();
    this.loadArchivedAvailabilities();
    this.loadFarmers();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map((item: any) => Product.fromJson(item));
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des produits.';
      }
    });
  }

  loadProductAvailabilities(): void {
    this.loading = true;
    this.productAvailabilitiesService.getProductAvailabilities().subscribe({
      next: (data) => {
        this.productAvailabilities = data.map((item: any) => ProductAvailability.fromJson(item));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des disponibilités.';
      }
    });
  }

  loadArchivedAvailabilities(): void {
    this.loadingArchived = true;
    this.productAvailabilitiesService.getArchivedProductAvailabilities().subscribe({
      next: (data) => {
        this.archivedAvailabilities = data.map((item: any) => ProductAvailability.fromJson(item));
        this.loadingArchived = false;
      },
      error: (err) => {
        this.loadingArchived = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des disponibilités archivées.';
      }
    });
  }

  switchTab(tab: 'active' | 'archived'): void {
    this.activeTab = tab;
    if (tab === 'archived' && this.archivedAvailabilities.length === 0) {
      this.loadArchivedAvailabilities();
    }
  }

  loadFarmers(): void {
    this.farmersService.getFarmers().subscribe({
      next: (data) => {
        this.users = data.map((item: any) => User.fromJson(item));
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des producteurs.';
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentAvailabilityId = null;
    this.addAvailabilityForm.reset();
    this.isFormSubmitted = false;
    this.isAdded = false;
    this.isUpdated = false;
    this.errorMessage = '';
  }

  editAvailability(availability: ProductAvailability): void {
    this.isEditMode = true;
    this.currentAvailabilityId = availability.id;
    this.addAvailabilityForm.patchValue({
      productId: availability.product.id,
      quantity: availability.quantity,
      farmerId: availability.user.id
    });
    this.isFormSubmitted = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    if (this.addAvailabilityForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      const productId = Number(this.addAvailabilityForm.get('productId')!.value);
      const quantity = Number(this.addAvailabilityForm.get('quantity')!.value);
      const farmerId = Number(this.addAvailabilityForm.get('farmerId')!.value);

      if (this.isEditMode && this.currentAvailabilityId) {
        this.productAvailabilitiesService.updateProductAvailability(this.currentAvailabilityId, quantity, farmerId, productId).subscribe({
          next: () => {
            this.isUpdated = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-availability');
              this.loadProductAvailabilities();
            }, 1200);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
          }
        });
      } else {
        this.productAvailabilitiesService.addProductAvailability(quantity, farmerId, productId).subscribe({
          next: () => {
            this.isAdded = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-availability');
              this.loadProductAvailabilities();
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

  confirmArchive(availability: ProductAvailability): void {
    this.availabilityToArchive = availability;
  }

  archiveAvailability(): void {
    if (this.availabilityToArchive) {
      this.isArchiving = true;
      this.productAvailabilitiesService.archiveProductAvailability(this.availabilityToArchive.id).subscribe({
        next: () => {
          this.isArchiving = false;
          this.availabilityToArchive = null;
          this.closeModal('modal-archive');
          this.loadProductAvailabilities();
          if (this.activeTab === 'archived') {
            this.loadArchivedAvailabilities();
          }
        },
        error: (err) => {
          this.isArchiving = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'archivage.';
        }
      });
    }
  }

  unarchiveAvailability(availability: ProductAvailability): void {
    this.productAvailabilitiesService.unarchiveProductAvailability(availability.id).subscribe({
      next: () => {
        this.loadArchivedAvailabilities();
        this.loadProductAvailabilities();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la désarchivage.';
      }
    });
  }

  confirmDelete(availability: ProductAvailability): void {
    this.availabilityToDelete = availability;
  }

  deleteAvailability(): void {
    if (this.availabilityToDelete) {
      this.isDeleting = true;
      this.productAvailabilitiesService.deleteProductAvailability(this.availabilityToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.availabilityToDelete = null;
          this.closeModal('modal-delete');
          if (this.activeTab === 'active') {
            this.loadProductAvailabilities();
          } else {
            this.loadArchivedAvailabilities();
          }
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
      this.currentAvailabilityId = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addAvailabilityForm.reset();
    }, 1200);
  }

  getModalTitle(): string {
    return this.isEditMode ? 'Modifier la disponibilité' : 'Nouvelle disponibilité';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Ajouter';
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '—';
  }

  getSelectedProductUnit(): string {
    const productId = this.addAvailabilityForm.get('productId')?.value;
    if (!productId) return '';
    const product = this.products.find(p => p.id === Number(productId));
    return product ? product.salesUnit : '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}