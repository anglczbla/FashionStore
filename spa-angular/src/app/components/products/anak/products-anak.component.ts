import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-products-anak',
  standalone: true,
  templateUrl: './products-anak.component.html',
  styleUrls: ['./products-anak.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsAnakComponent implements OnInit {
  products: any[] = []; // Menyimpan data produk
  productsForm!: FormGroup; // Form input produk
  apiUrl = 'http://localhost:3000/api/products'; // Ganti dengan URL API kamu
  editProductId: string | null = null;
  isSubmitting = false;
  isLoading = true;
  editProductsId: string | null = null;
  selectedFile: File | null = null;

  // Modal Order
  selectedProduct: any = null;
  showOrderForm = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  // Handle Klik Produk → Buka Modal Order
  onProductClick(product: any): void {
    this.selectedProduct = product;
    this.showOrderForm = true;
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      nama: [''],
      deskripsi: [''],
      harga: [''],
      kategori: [''],
      brand: [''],
      size: [''],
      stok:['']
    });

    this.getProducts();
  }

  getProducts(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.products = data;
        console.log('Data Produk:', this.products);
        this.isLoading = false;
      },
      (err) => {
        console.error('Error fetching produk data:', err);
        this.isLoading = false;
      }
    );
  }

  // addProduct(): void {
  //   if (this.productsForm.valid) {
  //     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //     this.http.post(this.apiUrl, this.productsForm.value, { headers }).subscribe(() => {
  //       this.getProducts();
  //       this.productsForm.reset();
  //     });
  //   }
  // }
  addProduct(): void {
    if (this.productsForm.valid && this.selectedFile) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      formData.append('nama', this.productsForm.value.nama);
      formData.append('deskripsi', this.productsForm.value.deskripsi);
      formData.append('harga', this.productsForm.value.harga);
      formData.append('kategori', this.productsForm.value.kategori);
      formData.append('brand', this.productsForm.value.brand);
      formData.append('size', this.productsForm.value.size);
      formData.append('stok', this.productsForm.value.stok);
      formData.append('foto', this.selectedFile);

      this.http.post(this.apiUrl, formData, { headers }).subscribe({
        next: () => {
          this.getProducts();
          this.productsForm.reset();
          this.selectedFile = null;
          this.isSubmitting = false;
          const modalElement = document.getElementById(
            'tambahProdukModal'
          ) as HTMLElement;
          if (modalElement) {
            const modalInstance =
              bootstrap.Modal.getInstance(modalElement) ||
              new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        },
        error: (err) => {
          console.error('Gagal menambahkan produk:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  getProductById(id: string): void {
    this.editProductId = id;
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: (data: any) => {
        this.productsForm.patchValue({
          nama: data.nama,
          deskripsi: data.deskripsi,
          harga: data.harga,
          kategori: data.kategori,
          brand: data.brand,
          stok: data.stok,
          size: data.size,
        });

        const modalElement = document.getElementById(
          'editProdukModal'
        ) as HTMLElement;
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching produk data by ID:', err);
      },
    });
  }

  updateProduct(): void {
    if (this.productsForm.valid && this.editProductId) {
      const token = localStorage.getItem('authToken'); // Pastikan key-nya benar
      if (!token) {
        console.error('Token tidak ditemukan. Pengguna belum login.');
        return;
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .put(`${this.apiUrl}/${this.editProductId}`, this.productsForm.value, {
          headers,
        })
        .subscribe({
          next: () => {
            this.getProducts();
            this.productsForm.reset();
            this.editProductId = null;
            const modalElement = document.getElementById(
              'editProdukModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating produk:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token tidak ditemukan. Pengguna belum login.');
        return;
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.getProducts();
          console.log(`Produk dengan ID ${id} berhasil dihapus`);
        },
        error: (err) => {
          console.error('Error deleting produk:', err);
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
