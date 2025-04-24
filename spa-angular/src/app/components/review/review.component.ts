import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Interface untuk tipe data review
interface Review {
  _id?: string;
  nama: string;
  orders_id: string;
  pesan: string;
  rating: number;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];               // Menyimpan semua review
  reviewForm!: FormGroup;              // Form untuk input dan edit review
  apiUrl = 'http://localhost:3000/review'; // Ganti dengan endpoint review kamu
  editReviewId: string | null = null;  // Menyimpan id saat edit
  isLoading = false;                   // Loading state

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      nama: ['', Validators.required],
      orders_id: ['', Validators.required],
      pesan: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.getReviews();
  }

  // Mengambil semua review dari server
  getReviews(): void {
    this.isLoading = true;
    this.http.get<Review[]>(this.apiUrl).subscribe({
      next: data => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: () => {
        alert('Gagal mengambil data review.');
        this.isLoading = false;
      }
    });
  }

  // Submit form review baru
  submitReview(): void {
    if (this.reviewForm.valid) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post<Review>(this.apiUrl, this.reviewForm.value, { headers }).subscribe({
        next: () => {
          alert('Review berhasil ditambahkan!');
          this.getReviews();
          this.reviewForm.reset();
        },
        error: () => {
          alert('Gagal menambahkan review.');
        }
      });
    } else {
      alert('Form tidak valid. Pastikan semua field terisi dan rating antara 1–5.');
    }
  }

  // Edit review dengan mengisi kembali form
  editReview(review: Review): void {
    this.editReviewId = review._id || null;
    this.reviewForm.patchValue({
      nama: review.nama,
      orders_id: review.orders_id,
      pesan: review.pesan,
      rating: review.rating
    });
  }

  // Update review yang telah diedit
  updateReview(): void {
    if (this.reviewForm.valid && this.editReviewId) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.put(`${this.apiUrl}/${this.editReviewId}`, this.reviewForm.value, { headers }).subscribe({
        next: () => {
          alert('Review berhasil diperbarui!');
          this.getReviews();
          this.reviewForm.reset();
          this.editReviewId = null;
        },
        error: () => {
          alert('Gagal memperbarui review.');
        }
      });
    } else {
      alert('Form tidak valid atau belum memilih review yang ingin diedit.');
    }
  }

  // Menghapus review berdasarkan ID
  deleteReview(id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          alert('Review berhasil dihapus.');
          this.getReviews();
        },
        error: () => {
          alert('Gagal menghapus review.');
        }
      });
    }
  }
}
