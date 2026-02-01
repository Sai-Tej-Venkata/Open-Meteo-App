import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoCoordinatesComponent } from './geo-coordinates.component';

describe('GeoCoordinatesComponent', () => {
  let component: GeoCoordinatesComponent;
  let fixture: ComponentFixture<GeoCoordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoCoordinatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoCoordinatesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
