import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  payments: any[] = [];
  orders: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editPaymentId: string | null = null;

  apiPaymentsUrl = 'http://localhost:3000/api/payments';
  apiOrdersUrl = 'http://localhost:3000/api/orders';

  paymentForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.paymentForm = this.fb.group({
      country: ['Indonesia', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      province: ['South Sumatra', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
      saveInfo: [false],

      // payment
      orders_id: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      status: ['', Validators.required],
      paymentDate: [new Date()],
    });
  }

  provinces: string[] = [
    'Aceh',
    'Bali',
    'Banten',
    'Bengkulu',
    'DI Yogyakarta',
    'DKI Jakarta',
    'Gorontalo',
    'Jambi',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Kalimantan Barat',
    'Kalimantan Selatan',
    'Kalimantan Tengah',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Kepulauan Bangka Belitung',
    'Kepulauan Riau',
    'Lampung',
    'Maluku',
    'Maluku Utara',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Papua',
    'Papua Barat',
    'Papua Pegunungan',
    'Papua Barat Daya',
    'Papua Tengah',
    'Papua Selatan',
    'Riau',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tengah',
    'Sulawesi Tenggara',
    'Sulawesi Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Sumatera Utara',
  ];

  ngOnInit(): void {
    this.getPayments();
    this.getOrders();
  }

  getPayments(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiPaymentsUrl).subscribe({
      next: (data) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
        alert('Failed to fetch payment. Please try again later.');
        this.isLoading = false;
      },
    });
  }

  getOrders(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiOrdersUrl).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching orders data:', err);
        alert('Failed to fetch orders. Please try again later.');
        this.isLoading = false;
      },
    });
  }

  addPayment(): void {
    if (this.paymentForm.valid) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiPaymentsUrl, this.paymentForm.value, { headers })
        .subscribe({
          next: () => {
            this.getPayments();
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful',
              text: 'Payment data has been successfully saved.',
            });
            this.paymentForm.reset();
            this.isSubmitting = false;
            this.closeModal('addPaymentModal');
          },
          error: (err) => {
            console.error('Error adding payment:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deletePayment(id: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiPaymentsUrl}/${id}`, { headers }).subscribe({
        next: () => this.getPayments(),
        error: (err) => console.error('Error deleting payment:', err),
      });
    }
  }

  getPaymentById(id: string): void {
    this.editPaymentId = id;
    this.http.get<any>(`${this.apiPaymentsUrl}/${id}`).subscribe({
      next: (data) => {
        this.paymentForm.patchValue(data);
        this.openModal('editPaymentModal');
      },
      error: (err) => console.error('Error fetching payment by ID:', err),
    });
  }

  updatePayment(): void {
    if (this.paymentForm.valid && this.editPaymentId) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiPaymentsUrl}/${this.editPaymentId}`,
          this.paymentForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            this.getPayments();
            this.isSubmitting = false;
            this.closeModal('editPaymentModal');
          },
          error: (err) => {
            console.error('Error updating payment:', err);
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
