import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordViewModalComponent } from './record-view-modal.component';

describe('RecordViewModalComponent', () => {
  let component: RecordViewModalComponent;
  let fixture: ComponentFixture<RecordViewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordViewModalComponent]
    });
    fixture = TestBed.createComponent(RecordViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
