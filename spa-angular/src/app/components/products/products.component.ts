import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = []; // Menyimpan data produk
  productsForm!: FormGroup; // Form input produk
  apiUrl = 'http://localhost:3000/products'; // Ganti dengan URL API kamu
  editProductId: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      nama: ['', Validators.required],
      deskripsi: ['', Validators.required],
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

  submitProduct(): void {
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
}
