import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-geo-coordinates',
  imports: [CommonModule],
  templateUrl: './geo-coordinates.component.html',
  styleUrl: './geo-coordinates.component.scss',
})
export class GeoCoordinatesComponent implements OnInit {
  latitude: number = 32.78;
  longitude: number = 96.8;

  @Output() latitudeChange = new EventEmitter<number>();
  @Output() longitudeChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.updateLatitude(this.latitude.toString());
    this.updateLongitude(this.longitude.toString());
  }

  updateLatitude(value: string) {
    console.log('updateLatitude');
    this.latitude = Number(value);
    this.latitudeChange.emit(this.latitude);
  }

  updateLongitude(value: string) {
    console.log('updateLongitude');
    this.longitude = Number(value);
    this.longitudeChange.emit(this.longitude);
  }
}
