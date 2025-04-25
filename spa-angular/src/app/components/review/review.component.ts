import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ReviewComponent implements OnInit {
  reviews: any[] = [];
  reviewForm!: FormGroup;
  orders: any[] = [];
  editReviewId: string | null = null;
  isSubmitting = false;
  apiUrl = 'http://localhost:3000/reviews';
  orderApiUrl = 'http://localhost:3000/orders'; // Ganti sesuai URL API order kamu

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      nama: [''],
      orders_id: [''],
      pesan: [''],
      rating: [''],
    });

    this.getReviews();
    this.getOrders();
  }

  getReviews(): void {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.reviews = data;
    });
  }

  getOrders(): void {
    this.http.get<any[]>(this.orderApiUrl).subscribe((data) => {
      this.orders = data;
    });
  }

  addReview(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post(this.apiUrl, this.reviewForm.value, { headers }).subscribe({
        next: () => {
          this.getReviews();
          this.reviewForm.reset();
          this.isSubmitting = false;
          this.closeModal('tambahReviewModal');
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  getReviewById(id: string): void {
    this.editReviewId = id;
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        this.reviewForm.patchValue(data);
        this.openModal('editReviewModal');
      },
      error: (err) => {
        console.error('Gagal mengambil review:', err);
      },
    });
  }

  updateReview(): void {
    if (this.reviewForm.valid && this.editReviewId) {
      this.isSubmitting = true;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.put(`${this.apiUrl}/${this.editReviewId}`, this.reviewForm.value, { headers }).subscribe({
        next: () => {
          this.getReviews();
          this.reviewForm.reset();
          this.editReviewId = null;
          this.isSubmitting = false;
          this.closeModal('editReviewModal');
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  deleteReview(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.getReviews();
    });
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
