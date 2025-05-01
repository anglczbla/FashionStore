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
export class ProductsanakComponent implements OnInit {
  products: any[] = []; // Menyimpan data produk
   productsForm!: FormGroup; // Form input produk
   apiUrl = 'http://localhost:3000/products'; // Ganti dengan URL API kamu
   editProductId: string | null = null;
   isSubmitting = false;
   isLoading = true;
   editProductsId: string | null = null;
 
   constructor(private fb: FormBuilder, private http: HttpClient) {}
 
   ngOnInit(): void {
     this.productsForm = this.fb.group({
       nama: [''],
       deskripsi: [''],
       harga: [''],
       kategori: [''],
       brand: [''],
       size: [''],
       foto:['']
     });
 
     this.getProducts();
   }
 
   getProducts(): void {
     this.http.get<any[]>(this.apiUrl).subscribe(data => {
       this.products = data;
     });
   }
 
   addProduct(): void {
     if (this.productsForm.valid) {
       const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
       this.http.post(this.apiUrl, this.productsForm.value, { headers }).subscribe(() => {
         this.getProducts();
         this.productsForm.reset();
       });
     }
   }
 
   editProduct(product: any): void {
     this.editProductId = product._id;
     this.productsForm.patchValue({
       name: product.name,
       price: product.price,
       description: product.description,
       image: product.image
     });
   }
 
   getProductById(id: string): void {
     this.editProductId = id;
     this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
       next: (data) => {
         this.productsForm.patchValue(data);
         this.openModal('editProductsModal');
       },
       error: (err) => {
         console.error('Error fetching order by ID:', err);
       },
     });
   }
 
   updateProduct(): void {
     if (this.productsForm.valid && this.editProductId) {
       const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
       this.http.put(`${this.apiUrl}/${this.editProductId}`, this.productsForm.value, { headers }).subscribe(() => {
         this.getProducts();
         this.productsForm.reset();
         this.editProductId = null;
       });
     }
   }
 
   deleteProduct(id: string): void {
     this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
       this.getProducts();
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
