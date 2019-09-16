import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ngx-smart-table';
import { PopUpManager } from '../../../managers/popUpManager';
import { Elemento } from '../../../@core/data/models/acta_recibido/elemento';
import { TipoBien } from '../../../@core/data/models/acta_recibido/tipo_bien';
import { SoporteActa } from '../../../@core/data/models/acta_recibido/soporte_acta';
import { ActaRecibidoHelper } from '../../../helpers/acta_recibido/actaRecibidoHelper';

@Component({
  selector: 'ngx-tabla-entradas',
  templateUrl: './tabla-entradas.component.html',
  styleUrls: ['./tabla-entradas.component.scss'],
})
export class TablaEntradasComponent implements OnInit {

  source: LocalDataSource;
  elementos: Array<Elemento>;

  @Input() actaRecibidoId: string;

  settings = {
    hideSubHeader: true,
    noDataMessage: 'No se encontraron elementos asociados.',
    actions: {
      columnTitle: 'Seleccionar',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      SoporteActa: {
        title: 'Factura',
        valuePrepareFunction: (value: any) => {
          return value.Consecutivo;
        },
      },
      TipoBien: {
        title: 'Tipo de Bien',
        valuePrepareFunction: (value: any) => {
          return value.Nombre;
        },
      },
      SubgrupoCatalogoId: {
        title: 'Subgrupo',
      },
      Nombre: {
        title: 'Descripcion',
      },
      Cantidad: {
        title: 'Cantidad',
      },
      Marca: {
        title: 'Marca',
      },
      Serie: {
        title: 'Serie',
      },
      UnidadMedida: {
        title: 'Unidad de Medida',
      },
      ValorUnitario: {
        title: 'Valor Unitario',
      },
      ValorCantidad: {
        title: 'Valor por Cantidad',
      },
      Descuento: {
        title: 'Descuento',
      },
      PorcentajeIvaId: {
        title: '%IVA',
      },
      ValorIva: {
        title: 'Valor IVA',
      },
      ValorTotal: {
        title: 'Valor Total',
      },
    },
  };

  constructor(private actaRecibidoHelper: ActaRecibidoHelper, private pUpManager: PopUpManager) {
    this.source = new LocalDataSource();
    this.elementos = new Array<Elemento>();
  }

  loadElementos(): void {
    this.actaRecibidoHelper.getElementosActa(this.actaRecibidoId).subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        for (const datos in Object.keys(data)) {
          if (data.hasOwnProperty(datos)) {
            const elemento = new Elemento;
            const tipoBien = new TipoBien;
            const soporteActa = new SoporteActa;
            elemento.Nombre = data[datos].Nombre;
            elemento.Cantidad = data[datos].Cantidad;
            elemento.Marca = data[datos].Marca;
            elemento.Serie = data[datos].Serie;
            elemento.UnidadMedida = data[datos].UnidadMedida;
            elemento.ValorUnitario = data[datos].ValorUnitario;
//            elemento.ValorCantidad = data[datos].ValorUnitario * data[datos].Cantidad;
            elemento.Subtotal = data[datos].Subtotal;
            elemento.Descuento = data[datos].Descuento;
            elemento.ValorTotal = data[datos].ValorTotal;
            elemento.PorcentajeIvaId = data[datos].PorcentajeIvaId;
            elemento.ValorIva = data[datos].ValorIva;
            elemento.ValorFinal = data[datos].ValorFinal;
            elemento.Descuento = data[datos].Descuento;
            elemento.Verificado = data[datos].Verificado;
            tipoBien.Id = data[datos].TipoBienId.Id;
            tipoBien.Nombre = data[datos].TipoBienId.Nombre;
            elemento.TipoBienId = tipoBien;
            soporteActa.Consecutivo = data[datos].SoporteActaId.Consecutivo;
            elemento.SoporteActaId = soporteActa;
            elemento.SubgrupoCatalogoId = data[datos].SubgrupoCatalogoId;
            this.elementos.push(elemento);
          }
        }
        this.source.load(this.elementos);
      }
    });
  }

  ngOnInit() {
    this.loadElementos();
  }

}