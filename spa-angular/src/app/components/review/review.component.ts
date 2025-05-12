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
  reviewUrl = 'http://localhost:3000/api/review';
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
    this.http.get<any[]>(this.reviewUrl).subscribe((data) => {
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
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
    
      this.http.post(this.reviewUrl, this.reviewForm.value, { headers }).subscribe({
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
    this.http.get<any>(`${this.reviewUrl}/${id}`).subscribe({
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
      this.http.put(`${this.reviewUrl}/${this.editReviewId}`, this.reviewForm.value, { headers }).subscribe({
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
  if (confirm('Apakah Anda yakin ingin menghapus review ini?')) {
  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  this.http.delete(`${this.reviewUrl}/${id}`, { headers }).subscribe({
    next: () => {
      this.getReviews();
      console.log(`Review dengan ID ${id} berhasil dihapus`);
    },
    error: (err) => {
      console.error('Error deleting review:', err);
    }
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
