import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaEvaluacionComponent } from './plantilla-evaluacion.component';

describe('PlantillaEvaluacionComponent', () => {
  let component: PlantillaEvaluacionComponent;
  let fixture: ComponentFixture<PlantillaEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillaEvaluacionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
