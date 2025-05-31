import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RajaOngkirService {
  private apiUrl = 'https://api.rajaongkir.com/starter/cost';
  private apiKey = ''; // Ganti dengan API key Anda

  constructor(private http: HttpClient) {}

  cekOngkir(origin: string, destination: string, weight: number, courier: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'key': this.apiKey
    });

    const body = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('weight', weight.toString())
      .set('courier', courier);

    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }
}
