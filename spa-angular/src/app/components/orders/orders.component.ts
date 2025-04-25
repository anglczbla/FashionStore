import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  products: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editOrderId: string | null = null;

  apiOrdersUrl = 'http://localhost:3000/api/orders'; // Set the correct API endpoint
  apiProductsUrl = 'http://localhost:3000/api/products'; // Set the correct API endpoint

  orderForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.orderForm = this.fb.group({
      nama: '',
      order: '',
      total: '',
      jumlahOrder: '',
      products_id: '',
    });
  }

  ngOnInit(): void {
    this.getOrders();
    this.getProducts();
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

  getProducts(): void {
    this.http.get<any[]>(this.apiProductsUrl).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products data:', err);
        alert('Failed to fetch products. Please try again later.');
      },
    });
  }

  addOrder(): void {
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(this.apiOrdersUrl, this.orderForm.value, { headers }).subscribe({
        next: (response) => {
          console.log('Order successfully added:', response);
          this.getOrders();
          this.orderForm.reset();
          this.isSubmitting = false;
          this.closeModal('tambahPemesananModal');
        },
        error: (err) => {
          console.error('Error adding order:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  deleteOrder(id: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      this.http.delete(`${this.apiOrdersUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.getOrders();
          console.log(`Order with ID ${id} successfully deleted`);
        },
        error: (err) => {
          console.error('Error deleting order:', err);
        },
      });
    }
  }

  getOrderById(id: string): void {
    this.editOrderId = id;
    this.http.get<any>(`${this.apiOrdersUrl}/${id}`).subscribe({
      next: (data) => {
        this.orderForm.patchValue(data);
        this.openModal('editPemesananModal');
      },
      error: (err) => {
        console.error('Error fetching order by ID:', err);
      },
    });
  }

  updateOrder(): void {
    if (this.orderForm.valid && this.editOrderId) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.put(`${this.apiOrdersUrl}/${this.editOrderId}`, this.orderForm.value, { headers }).subscribe({
        next: () => {
          this.getOrders();
          this.isSubmitting = false;
          this.closeModal('editPemesananModal');
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
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
