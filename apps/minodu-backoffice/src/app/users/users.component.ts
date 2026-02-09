import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../_models/users';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/users.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

declare const bootstrap: any;


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  editUserForm: FormGroup;
  editUserId: number|null = null;
  isEditMode: boolean = false;
  editUserError: string = '';
  editUserSuccess: string = '';
  isEditSubmitting: boolean = false;
  errorMessage = '';
  loading: boolean = false;
  users: User [] | null = null;
  showContactsOnly: boolean = false;

  constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private userService: UserService, private fb: FormBuilder, private authService: AuthService) {
    this.editUserForm = this.fb.group({
      fullName: ['', Validators.required],
      gender: [''],
      phone: ['', Validators.required],
      password: [''],
      isContactPerson: [false]
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des utilisateurs.';
        //this.authService.logout();
      }
    });
  }

  getFilteredUsers(): User[] {
    if (!this.users) return [];
    if (this.showContactsOnly) {
      return this.users.filter(user => user.isContactPerson === true || user.isContactPerson === 'true');
    }
    return this.users;
  }

  openEditModal(user: any, event?: Event) {
    if (event) event.preventDefault();
    this.isEditMode = true;
    this.editUserId = user.id;
    this.editUserForm.patchValue({
      fullName: user.fullname,
      gender: user.gender ?? '',
      phone: user.phone,
      isContactPerson: user.isContactPerson ?? false
    });
    // En mode édition, le champ password n'est pas requis
    this.editUserForm.get('password')?.clearValidators();
    this.editUserForm.get('password')?.updateValueAndValidity();
    this.editUserError = '';
    this.editUserSuccess = '';
    this.isEditSubmitting = false;
    // Ouvre la modale Bootstrap
    const modal = document.getElementById('editUserModal');
    if (modal) {
      // @ts-ignore
      const bsModal = new window.bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  openAddModal(event?: Event) {
    if (event) event.preventDefault();
    this.isEditMode = false;
    this.editUserId = null;
    this.editUserForm.reset();
    // En mode création, le champ password est requis
    this.editUserForm.get('password')?.setValidators([Validators.required]);
    this.editUserForm.get('password')?.updateValueAndValidity();
    this.editUserError = '';
    this.editUserSuccess = '';
    this.isEditSubmitting = false;
    // Ouvre la modale Bootstrap
    const modal = document.getElementById('editUserModal');
    if (modal) {
      // @ts-ignore
      const bsModal = new window.bootstrap.Modal(modal);
      bsModal.show();
    }
  }
  

  closeModal() {
    const modalEl = document.getElementById('editUserModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  submitEditUser() {
    if (this.editUserForm.invalid) return;
    this.isEditSubmitting = true;
    this.editUserError = '';
    this.editUserSuccess = '';
    
    if (this.isEditMode) {
      // Mode édition
      if (!this.editUserId) return;
      const { fullName, gender, phone, isContactPerson } = this.editUserForm.value;
      this.userService.updateUser(this.editUserId, { fullName, gender, phone, isContactPerson: String(isContactPerson) })
        .subscribe({
          next: () => {
            this.editUserSuccess = "Utilisateur modifié avec succès.";
            this.isEditSubmitting = false;
            // Fermer la modale après un court délai et rafraîchir la liste
            setTimeout(() => {
              const modal = document.getElementById('editUserModal');
              if (modal) {
                // @ts-ignore
                const bsModal = window.bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
              }
              this.getUsers();
            }, 1200);
          },
          error: err => {
            this.editUserError = err?.error?.message || 'Erreur lors de la modification.';
            this.isEditSubmitting = false;
          }
        });
    } else {
      // Mode création
      const { fullName, phone, gender, password, isContactPerson } = this.editUserForm.value;
      this.userService.createUser({ fullName, phone, gender, password, isContactPerson: String(isContactPerson) })
        .subscribe({
          next: () => {
            this.editUserSuccess = "Utilisateur créé avec succès.";
            this.isEditSubmitting = false;
            // Fermer la modale après un court délai et rafraîchir la liste
            setTimeout(() => {
              const modal = document.getElementById('editUserModal');
              if (modal) {
                // @ts-ignore
                const bsModal = window.bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
              }
              this.getUsers();
            }, 1200);
          },
          error: err => {
            this.editUserError = err?.error?.message || 'Erreur lors de la création.';
            this.isEditSubmitting = false;
          }
        });
    }
  }
   

  confirmDelete(user: any, event?: Event) {
    if (event) event.preventDefault();
    // TODO: Ajoute la logique de suppression ici (modale de confirmation, appel service, etc.)
  }
}
