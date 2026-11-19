import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaifiComponent } from './saifi.component';

describe('SaifiComponent', () => {
  let component: SaifiComponent;
  let fixture: ComponentFixture<SaifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaifiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
