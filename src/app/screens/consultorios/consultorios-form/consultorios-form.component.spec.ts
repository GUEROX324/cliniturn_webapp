import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultoriosFormComponent } from './consultorios-form.component';

describe('ConsultoriosFormComponent', () => {
  let component: ConsultoriosFormComponent;
  let fixture: ComponentFixture<ConsultoriosFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultoriosFormComponent]
    });
    fixture = TestBed.createComponent(ConsultoriosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
