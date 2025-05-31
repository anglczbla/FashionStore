import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RajaOngkirService {
  private apiUrl = 'http://localhost:3000/api/rajaOngkir/cekOngkir';

  constructor(private http: HttpClient) {}

  cekOngkir(origin: string, destination: string, weight: number, courier: string) {


    const body = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('courier', courier)
      .set('weight', weight)

    return this.http.post<any>(this.apiUrl, body.toString());
  }
}
