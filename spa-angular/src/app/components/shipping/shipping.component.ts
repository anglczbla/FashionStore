import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { RajaOngkirService } from '../../rajaongkir.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent implements OnInit {
  shipping: any[] = [];
  payments: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editShippingId: string | null = null;

  apiShippingUrl = 'http://localhost:3000/api/shipping';
  apiPaymentsUrl = 'http://localhost:3000/api/payments';

  shippingForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

   constructor(private ongkirService: RajaOngkirService) {
    this.shippingForm = this.fb.group({
      payments_id: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      shippingDate: [new Date()],
      trackingNumber: [''],
      destination: ['', Validators.required],
      weight: [1000, [Validators.required, Validators.min(1)]],
      courier: ['jne', Validators.required],
      selectedService: ['', Validators.required] 
    });
  }
  services: any[] = [];
  loading: boolean = false;


  getOngkir() {
    this.shippingForm.patchValue({ selectedService: '' });

    const formValue = this.shippingForm.value;

    const origin = '501'; // Kota asal tetap
    const destination = formValue.destination;
    const weight = formValue.weight;
    const courier = formValue.courier;

    if (!destination || !weight || !courier) return;

    this.loading = true;
    this.services = [];
    this.shippingForm.patchValue({ selectedService: '' }); // reset saat load ulang

    this.ongkirService
      .cekOngkir(origin, destination, weight, courier)
      .subscribe({
        next: (data) => {
          console.log(data)
          this.services = data.rajaongkir.results[0].costs;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  ngOnInit(): void {
    this.getshipping();
    this.getPayments();
  }

  getshipping(): void {
    this.isLoading = true;
    
    this.http.get<any[]>(this.apiShippingUrl).subscribe({
      next: (data) => {
        this.shipping = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching shipping:', err);
        this.isLoading = false;
      },
    });
  }

  getPayments(): void {
    this.http.get<any[]>(this.apiPaymentsUrl).subscribe({
      next: (data) => {
        this.payments = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
      },
    });
  }

  addShipping(): void {
    if (this.shippingForm.valid) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiShippingUrl, this.shippingForm.value, { headers })
        .subscribe({
          next: () => {
            this.getshipping();
            this.shippingForm.reset();
            this.isSubmitting = false;
            this.closeModal('addShippingModal');
          },
          error: (err) => {
            console.error('Error adding shipping:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteShipping(id: string): void {
    if (confirm('Are you sure you want to delete this shipping record?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiShippingUrl}/${id}`, { headers }).subscribe({
        next: () => this.getshipping(),
        error: (err) => console.error('Error deleting shipping:', err),
      });
    }
  }

  getShippingById(id: string): void {
    this.editShippingId = id;
    this.http.get<any>(`${this.apiShippingUrl}/${id}`).subscribe({
      next: (data) => {
        this.shippingForm.patchValue(data);
        this.getOngkir();
        this.openModal('editShippingModal');
      },
      error: (err) => {
        console.error('Error fetching shipping by ID:', err);
      },
    });
  }

  updateShipping(): void {
    if (this.shippingForm.valid && this.editShippingId) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiShippingUrl}/${this.editShippingId}`,
          this.shippingForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            this.getshipping();
            this.isSubmitting = false;
            this.closeModal('editShippingModal');
          },
          error: (err) => {
            console.error('Error updating shipping:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
