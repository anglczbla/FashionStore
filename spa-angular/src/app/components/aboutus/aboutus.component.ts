import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-about',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css'],
})
export class AboutusComponent implements AfterViewInit {
  private map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // 🔧 Override default marker icons
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    // 🌍 Inisialisasi peta
    this.map = L.map('map').setView([-2.9898025, 104.7924201], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 10,
    }).addTo(this.map);

    // 📍 Tambahkan marker
    L.marker([-2.9898025, 104.7924201])
      .addTo(this.map)
      .bindPopup('<b>EleganceWear HQ</b><br>Jakarta, Indonesia')
      .openPopup();
  }
}
