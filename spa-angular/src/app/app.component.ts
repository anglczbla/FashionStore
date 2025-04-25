import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports:[
    RouterOutlet,
    HomeComponent,
    RouterModule
  ],
})
export class AppComponent {
  title = 'spa-angular';
  isLoggedIn: boolean = false; // Menyimpan status login
  constructor(private router: Router) { } // Menambahkan router pada konstruktor
  
  ngOnInit() {
    // Memeriksa apakah ada token di localStorage
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  onLogout() {
    // Menghapus token dari localStorage saat logout
    localStorage.removeItem('authToken');
    this.isLoggedIn = false; // Mengubah status login menjadi false
    this.router.navigate(['/auth']); // Arahkan ke halaman login setelah logout
  }
}



