import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-products-pria',
  standalone: true,
  templateUrl: './products-pria.component.html',
  styleUrls: ['./products-pria.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsPriaComponent implements OnInit {
  products: any[] = []; // Menyimpan data produk
  productsForm!: FormGroup; // Form input produk
  apiUrl = 'http://localhost:3000/api/products'; // Ganti dengan URL API kamu
  editProductId: string | null = null;
  isSubmitting = false;
  isLoading = true;
  selectedFile: File | null = null;

  // Modal Order
  showOrderForm = false;

  // logic foto
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Handle Klik Produk → Buka Modal Order
  onProductClick(product: any): void {
    console.log('Product clicked:', product);
    this.selectedProduct = product;
    this.showOrderForm = true;
  }

  

  openOrderModal(product: any) {
    this.selectedProduct = product;
    this.orderQty = 1;
  }

  // FORM ORDER
  
  buyerName: string = '';
  selectedProduct: any = null;
  orderQty: number = 1; // inisialisasi nama pembeli

  submitOrder() {
    if (
      this.selectedProduct &&
      this.orderQty > 0 &&
      this.buyerName.trim() !== ''
    ) {
      const order = {
        nama: this.buyerName,
        order: new Date(),
        total: this.orderQty * this.selectedProduct.harga,
        jumlahOrder: this.orderQty,
        products_id: this.selectedProduct._id,
      };

      Swal.fire({
        title: 'Konfirmasi Order',
        html: `
          <strong>${this.selectedProduct.nama}</strong><br>
          Jumlah: ${order.jumlahOrder}<br>
          Total: Rp${order.total.toLocaleString()}
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Order Sekarang',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post('http://localhost:3000/api/orders', order).subscribe({
            next: (res) => {
              console.log('Order berhasil:', res);
              Swal.fire('Berhasil!', 'Pesanan Anda telah dibuat.', 'success');
              this.selectedProduct = null;
              this.orderQty = 1;
            },
            error: (err) => {
              console.error('Gagal mengirim order:', err);
              Swal.fire('Gagal!', 'Pesanan tidak dapat dikirim.', 'error');
            },
          });
        }
      });
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.productsForm = this.fb.group({
      nama: [''],
      deskripsi: [''],
      harga: [''],
      kategori: [''],
      brand: [''],
      size: [''],
      stok: [''],
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
          Swal.fire({
            icon: 'success',
            title: 'Products Success to added',
            text: 'Products data has been successfully saved.',
          });
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
            Swal.fire({
              icon: 'success',
              title: 'Products Success to update',
              text: 'Products data has been successfully saved.',
            });
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
          Swal.fire({
            icon: 'success',
            title: 'Products Success to delete',
            text: 'Products data has been successfully saved.',
          });
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
