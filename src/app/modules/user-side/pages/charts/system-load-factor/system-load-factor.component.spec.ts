import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLoadFactorComponent } from './system-load-factor.component';

describe('SystemLoadFactorComponent', () => {
  let component: SystemLoadFactorComponent;
  let fixture: ComponentFixture<SystemLoadFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLoadFactorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemLoadFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
