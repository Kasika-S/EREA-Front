import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridConnectivityComponent } from './grid-connectivity.component';

describe('GridConnectivityComponent', () => {
  let component: GridConnectivityComponent;
  let fixture: ComponentFixture<GridConnectivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridConnectivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridConnectivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
