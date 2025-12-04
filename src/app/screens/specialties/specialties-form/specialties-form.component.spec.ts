import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesFormComponent } from './specialties-form.component';

describe('SpecialtiesFormComponent', () => {
  let component: SpecialtiesFormComponent;
  let fixture: ComponentFixture<SpecialtiesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialtiesFormComponent]
    });
    fixture = TestBed.createComponent(SpecialtiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
