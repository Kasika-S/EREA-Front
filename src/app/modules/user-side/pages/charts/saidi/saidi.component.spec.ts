import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidiComponent } from './saidi.component';

describe('SaidiComponent', () => {
  let component: SaidiComponent;
  let fixture: ComponentFixture<SaidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaidiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
