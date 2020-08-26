import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionPlantillasComponent } from './administracion-plantillas.component';

describe('AdministracionPlantillasComponent', () => {
  let component: AdministracionPlantillasComponent;
  let fixture: ComponentFixture<AdministracionPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionPlantillasComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
