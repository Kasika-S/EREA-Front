import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTariffsComponent } from './user-tariffs.component';

describe('UserTariffsComponent', () => {
  let component: UserTariffsComponent;
  let fixture: ComponentFixture<UserTariffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTariffsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
