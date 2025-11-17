import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAvailabilitiesComponent } from './product-availabilities.component';

describe('ProductAvailabilitiesComponent', () => {
  let component: ProductAvailabilitiesComponent;
  let fixture: ComponentFixture<ProductAvailabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAvailabilitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductAvailabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
