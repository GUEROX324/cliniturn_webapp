import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultoriosListComponent } from './consultorios-list.component';

describe('ConsultoriosListComponent', () => {
  let component: ConsultoriosListComponent;
  let fixture: ComponentFixture<ConsultoriosListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultoriosListComponent]
    });
    fixture = TestBed.createComponent(ConsultoriosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
