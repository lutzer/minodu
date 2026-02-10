import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductDemandsService } from '../_services/product-demands.service';
import { PartnersService } from '../_services/partners.service';
import { ProductsService } from '../_services/products.service';
import { ProductDemand } from '../_models/product-demands';
import { Partner } from '../_models/partners';
import { Product } from '../_models/products';

@Component({
  selector: 'app-product-demands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-demands.component.html',
  styleUrl: './product-demands.component.css'
})
export class ProductDemandsComponent implements OnInit {
  productDemands: ProductDemand[] = [];
  archivedDemands: ProductDemand[] = [];
  partners: Partner[] = [];
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
  demandToDelete: ProductDemand | null = null;
  demandToArchive: ProductDemand | null = null;
  currentDemandId: number | null = null;
  activeTab: 'active' | 'archived' = 'active';

  addDemandForm: FormGroup;

  constructor(
    private productDemandsService: ProductDemandsService,
    private partnersService: PartnersService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder
  ) {
    this.addDemandForm = this.formBuilder.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      partnerId: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductDemands();
    this.loadArchivedDemands();
    this.loadPartners();
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

  loadProductDemands(): void {
    this.loading = true;
    this.productDemandsService.getProductDemands().subscribe({
      next: (data) => {
        this.productDemands = data.map((item: any) => ProductDemand.fromJson(item));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des demandes.';
      }
    });
  }

  loadArchivedDemands(): void {
    this.loadingArchived = true;
    this.productDemandsService.getArchivedProductDemands().subscribe({
      next: (data) => {
        this.archivedDemands = data.map((item: any) => ProductDemand.fromJson(item));
        this.loadingArchived = false;
      },
      error: (err) => {
        this.loadingArchived = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des demandes archivées.';
      }
    });
  }

  switchTab(tab: 'active' | 'archived'): void {
    this.activeTab = tab;
    if (tab === 'archived' && this.archivedDemands.length === 0) {
      this.loadArchivedDemands();
    }
  }

  loadPartners(): void {
    this.partnersService.getPartners().subscribe({
      next: (data) => {
        this.partners = data.map((item: any) => Partner.fromJson(item));
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des partenaires.';
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentDemandId = null;
    this.addDemandForm.reset();
    this.isFormSubmitted = false;
    this.isAdded = false;
    this.isUpdated = false;
    this.errorMessage = '';
  }

  formatDateToInput(date: Date): string {
    return date.toISOString().split('T')[0]; // 👉 "2025-11-17"
  }


  editDemand(demand: ProductDemand): void {
    this.isEditMode = true;
    this.currentDemandId = demand.id;

    const deadlineString = this.formatDateToInput(demand.deadline);

    this.addDemandForm.patchValue({
      productId: demand.product.id,
      quantity: demand.quantity,
      partnerId: demand.partner.id,
      deadline: deadlineString  // 👉 STRING, pas Date
    });

    this.isFormSubmitted = false;
    this.errorMessage = '';
  }


  onSubmit(): void {
    this.isFormSubmitted = true;
    if (this.addDemandForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      const productId = Number(this.addDemandForm.get('productId')!.value);
      const quantity = Number(this.addDemandForm.get('quantity')!.value);
      const partnerId = Number(this.addDemandForm.get('partnerId')!.value);
      const deadline = this.addDemandForm.get('deadline')!.value;

      if (this.isEditMode && this.currentDemandId) {
        this.productDemandsService.updateProductDemand(this.currentDemandId, quantity, partnerId, productId, deadline).subscribe({
          next: () => {
            this.isUpdated = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-demand');
              this.loadProductDemands();
            }, 1200);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
          }
        });
      } else {
        this.productDemandsService.addProductDemand(quantity, partnerId, productId, deadline).subscribe({
          next: () => {
            this.isAdded = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-demand');
              this.loadProductDemands();
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

  confirmArchive(demand: ProductDemand): void {
    this.demandToArchive = demand;
  }

  archiveDemand(): void {
    if (this.demandToArchive) {
      this.isArchiving = true;
      this.productDemandsService.archiveProductDemand(this.demandToArchive.id).subscribe({
        next: () => {
          this.isArchiving = false;
          this.demandToArchive = null;
          this.closeModal('modal-archive');
          this.loadProductDemands();
          if (this.activeTab === 'archived') {
            this.loadArchivedDemands();
          }
        },
        error: (err) => {
          this.isArchiving = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'archivage.';
        }
      });
    }
  }

  unarchiveDemand(demand: ProductDemand): void {
    this.productDemandsService.unarchiveProductDemand(demand.id).subscribe({
      next: () => {
        this.loadArchivedDemands();
        this.loadProductDemands();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la désarchivage.';
      }
    });
  }

  confirmDelete(demand: ProductDemand): void {
    this.demandToDelete = demand;
  }

  deleteDemand(): void {
    if (this.demandToDelete) {
      this.isDeleting = true;
      this.productDemandsService.deleteProductDemand(this.demandToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.demandToDelete = null;
          this.closeModal('modal-delete');
          if (this.activeTab === 'active') {
            this.loadProductDemands();
          } else {
            this.loadArchivedDemands();
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
      this.currentDemandId = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addDemandForm.reset();
    }, 1200);
  }

  getModalTitle(): string {
    return this.isEditMode ? 'Modifier la demande' : 'Nouvelle demande';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Ajouter';
  }

  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR');
  // }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "-"; // évite Invalid Date

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // sécurité

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  }



  extractDateOnly(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getSelectedProductUnit(): string {
    const productId = this.addDemandForm.get('productId')?.value;
    if (!productId) return '';
    const product = this.products.find(p => p.id === Number(productId));
    return product ? product.salesUnit : '';
  }
}