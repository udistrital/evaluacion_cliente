import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'nb-home',
    link: '/pages/dashboard',
  },
  // {
  //   title: 'Evaluaciones',
  //   icon: 'nb-edit',
  //   children: [
  //     {
  //       title: 'Evaluar Proveedor',
  //       link: '/pages/evaluar_proveedor/',
  //     },
  //   ],
  // },
  // {
  //   title: 'Evaluación',
  //   icon: 'nb-checkmark',
  //   children: [
  //     {
  //       title: 'Evaluación',
  //       link: '/pages/evaluacion/',
  //     },
  //   ],
  // },
  {
    title: 'Consulta Evaluación',
    icon: 'nb-search',
    children: [
      {
        title: 'Evaluación',
        link: '/pages/consulta_evaluacion/',
      },
    ],
  },
  // {
  //   title: 'Administración plantillas',
  //   icon: 'nb-compose',
  //   children: [
  //     {
  //       title: 'Administración de plantillas',
  //       link: '/pages/administracion_plantillas/',
  //     },
  //   ],
  // },
];
