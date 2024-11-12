import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetroleumComponent } from './petroleum.component';

describe('PetroleumComponent', () => {
  let component: PetroleumComponent;
  let fixture: ComponentFixture<PetroleumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetroleumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetroleumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
