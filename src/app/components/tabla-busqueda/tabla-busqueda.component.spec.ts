import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaComponent } from './tabla-busqueda.component';

describe('TablaBusquedaComponent', () => {
  let component: TablaBusquedaComponent;
  let fixture: ComponentFixture<TablaBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
