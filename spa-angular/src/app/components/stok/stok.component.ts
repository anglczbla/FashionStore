import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-stok',
  standalone: true,
  templateUrl: './stok.component.html',
  styleUrls: ['./stok.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class StokComponent implements OnInit {
  stokForm: FormGroup;
  stoks: any[] = [];
  products: any[] = [];
  isSubmitting = false;
  isLoading = true;
  editStokId: string | null = null;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  apiStokUrl = 'http://localhost:3000/api/stok';
  apiUrl = 'http://localhost:3000/api/products';

  constructor() {
    this.stokForm = this.fb.group({
      products_id: ['', Validators.required],
      jumlah: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getStoks();
    this.getProducts();
  }

  getStoks(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiStokUrl).subscribe({
      next: (data) => {
        this.stoks = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat stok:', err);
        this.isLoading = false;
      }
    });
  }

  getProducts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Gagal memuat produk:', err);
      }
    });
  }

  addStok(): void {
    if (this.stokForm.valid) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(this.apiStokUrl, this.stokForm.value, { headers }).subscribe({
        next: () => {
          this.getStoks();
          this.stokForm.reset();
          this.isSubmitting = false;
          this.closeModal('tambahStokModal');
        },
        error: (err) => {
          console.error('Gagal menambahkan stok:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteStok(id: string): void {
    if (confirm('Yakin ingin menghapus stok ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiStokUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.getStoks();
        },
        error: (err) => {
          console.error('Gagal menghapus stok:', err);
        }
      });
    }
  }

  getStokById(id: string): void {
    this.editStokId = id;
    this.http.get<any>(`${this.apiStokUrl}/${id}`).subscribe({
      next: (data) => {
        this.stokForm.patchValue({
          products_id: data.products_id?._id || data.products_id,
          jumlah: data.jumlah
        });
        this.openModal('editStokModal');
      },
      error: (err) => {
        console.error('Gagal memuat stok:', err);
      }
    });
  }

  updateStok(): void {
    if (this.editStokId && this.stokForm.valid) {
      this.isSubmitting = true;
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.put(`${this.apiStokUrl}/${this.editStokId}`, this.stokForm.value, { headers }).subscribe({
        next: () => {
          this.getStoks();
          this.editStokId = null;
          this.stokForm.reset();
          this.isSubmitting = false;
          this.closeModal('editStokModal');
        },
        error: (err) => {
          console.error('Gagal mengupdate stok:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
