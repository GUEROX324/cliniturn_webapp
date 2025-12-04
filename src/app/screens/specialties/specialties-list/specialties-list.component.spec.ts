import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesListComponent } from './specialties-list.component';

describe('SpecialtiesListComponent', () => {
  let component: SpecialtiesListComponent;
  let fixture: ComponentFixture<SpecialtiesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialtiesListComponent]
    });
    fixture = TestBed.createComponent(SpecialtiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
