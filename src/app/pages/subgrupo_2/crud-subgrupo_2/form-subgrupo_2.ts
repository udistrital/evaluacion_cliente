
export let FORM_SUBGRUPO_2 = {
    titulo: 'Subgrupo2',
    tipo_formulario: 'mini',
    btn: 'Guardar',
    alertas: true,
    modelo: 'Subgrupo2',
    campos: [
    {
        etiqueta: 'input',
        claseGrid: 'col-6',
        nombre: 'Id',
        label_i18n: 'id',
        placeholder_i18n: 'id',
        requerido: true,
        tipo: 'number',
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-6',
        nombre: 'Nombre',
        label_i18n: 'nombre',
        placeholder_i18n: 'nombre',
        requerido: true,
        tipo: 'text',
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-6',
        nombre: 'Descripcion',
        label_i18n: 'descripcion',
        placeholder_i18n: 'descripcion',
        requerido: true,
        tipo: 'text',
    },
    {
        etiqueta: 'checkbox',
        claseGrid: 'col-6',
        nombre: 'Activo',
        label_i18n: 'activo',
        placeholder_i18n: 'activo',
        requerido: true,
        tipo: 'checkbox',
    },
    {
        etiqueta: 'select',
        claseGrid: 'col-6',
        nombre: 'Subgrupo1',
        label_i18n: 'subgrupo_1',
        placeholder_i18n: 'subgrupo_1',
        requerido: true,
        tipo: 'Subgrupo1',
        // key: 'Name',
        opciones: [],
    },
    ],
};
