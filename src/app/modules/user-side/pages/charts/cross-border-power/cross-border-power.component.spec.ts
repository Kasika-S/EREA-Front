import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossBorderPowerComponent } from './cross-border-power.component';

describe('CrossBorderPowerComponent', () => {
  let component: CrossBorderPowerComponent;
  let fixture: ComponentFixture<CrossBorderPowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossBorderPowerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrossBorderPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
