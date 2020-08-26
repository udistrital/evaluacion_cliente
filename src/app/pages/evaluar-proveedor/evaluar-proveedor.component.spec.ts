import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarProveedorComponent } from './evaluar-proveedor.component';

describe('EvaluarProveedorComponent', () => {
  let component: EvaluarProveedorComponent;
  let fixture: ComponentFixture<EvaluarProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluarProveedorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
