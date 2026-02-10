import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDemandsComponent } from './product-demands.component';

describe('ProductDemandsComponent', () => {
  let component: ProductDemandsComponent;
  let fixture: ComponentFixture<ProductDemandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDemandsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
