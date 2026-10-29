/**
 * CATÁLOGO EDITABLE — cambia los precios, imágenes y nombres aquí.
 * Imagen faltante: guarda un archivo dentro de img/productos/ y pon su ruta.
 * Para activar belleza u hogar: cambia proximamente a false.
 * Todos los precios de esta primera entrega son DEMOSTRATIVOS.
 */
export const PRODUCTOS = [
  {
    id:'arena-tuki',nombre:'Arena para gato TUKI',marca:'TUKI',categoria:'mascotas',tipo:'Arenas para gatos',
    descripcion:'Arena sanitaria de alta absorción, control de olores, efecto aglomerante y bajo polvo.',
    imagen:'img/productos/tuki-arena-10kg.png',real:true,destacado:true,etiqueta:'Más buscado',
    variantes:[
      {id:'10kg',nombre:'Bolsa de 10 kg',precio:34.90,imagen:'img/productos/tuki-arena-10kg.png'},
      {id:'25kg',nombre:'Bolsa de 25 kg',precio:74.90,imagen:'img/productos/tuki-arena-25kg.png',palaGratis:true}
    ]
  },
  {
    id:'arena-granulada',nombre:'Arena granulada para gatos',marca:'TUKI',categoria:'mascotas',tipo:'Arenas para gatos',
    descripcion:'Presentación granulada para el arenero de tu gato. Imagen de demostración.',
    imagen:'img/productos/arena-granulada-demo.jpg',destacado:true,etiqueta:'Para tu michi',
    variantes:[{id:'10kg',nombre:'Bolsa de 10 kg',precio:29.90},{id:'25kg',nombre:'Bolsa de 25 kg',precio:68.90,palaGratis:true}]
  },
  {
    id:'arena-carbon',nombre:'Arena con carbón activado',marca:'TUKI',categoria:'mascotas',tipo:'Arenas para gatos',
    descripcion:'Opción con carbón activado para ayudar en el control de olores. Presentación ilustrativa.',
    imagen:'img/productos/arena-carbon-demo.jpg',destacado:true,etiqueta:'Novedad',
    variantes:[{id:'10kg',nombre:'Bolsa de 10 kg',precio:39.90},{id:'25kg',nombre:'Bolsa de 25 kg',precio:87.90,palaGratis:true}]
  },
  {
    id:'arena-perlas',nombre:'Arena con perlas',marca:'TUKI',categoria:'mascotas',tipo:'Arenas para gatos',
    descripcion:'Arena sanitaria con perlas. Producto y disponibilidad por confirmar.',
    imagen:'img/productos/arena-granulada-demo.jpg',etiqueta:'Especial',
    variantes:[{id:'10kg',nombre:'Bolsa de 10 kg',precio:42.90},{id:'25kg',nombre:'Bolsa de 25 kg',precio:89.90,palaGratis:true}]
  },
  {
    id:'efectivon',nombre:'Shampoo Efectivon',marca:'Efectivon',categoria:'mascotas',tipo:'Shampoos',
    descripcion:'Shampoo para la higiene habitual de perros y gatos. Envase referencial, confirmar presentación y uso con el proveedor.',
    imagen:'img/productos/shampoo-efectivon-demo.jpg',destacado:true,
    variantes:[{id:'perro',nombre:'Para perros · demo 500 ml',precio:24.90},{id:'gato',nombre:'Para gatos · demo 500 ml',precio:24.90}]
  },
  {
    id:'sanol',nombre:'Shampoo medicado Sanol',marca:'Sanol',categoria:'mascotas',tipo:'Shampoos',
    descripcion:'Línea medicada de higiene animal. Consulta indicaciones veterinarias y presentación real antes de utilizar.',
    imagen:'img/productos/shampoo-sanol-demo.jpg',destacado:true,
    variantes:[{id:'perro',nombre:'Para perros · demo 250 ml',precio:31.90},{id:'gato',nombre:'Para gatos · demo 250 ml',precio:31.90}]
  },
  {
    id:'pipeta-cachorro',nombre:'Pipetas antipulgas para cachorros',marca:'Línea de mascotas',categoria:'mascotas',tipo:'Antipulgas',
    descripcion:'Tratamiento antipulgas para cachorros. La elección depende de edad, peso y recomendación veterinaria.',
    imagen:'img/productos/pipetas-demo.jpg',destacado:false,
    variantes:[{id:'consulta',nombre:'Presentación por confirmar',precio:32.90}]
  },
  {
    id:'pipeta-adulto',nombre:'Pipetas antipulgas para adultos',marca:'Línea de mascotas',categoria:'mascotas',tipo:'Antipulgas',
    descripcion:'Antipulgas para perros adultos; consultar peso y producto exacto antes de comprar.',
    imagen:'img/productos/pipetas-demo.jpg',destacado:true,
    variantes:[{id:'consulta',nombre:'Presentación por confirmar',precio:36.90}]
  },
  {
    id:'plan-dog-gato',nombre:'Pipetas Plan Dog para gatos',marca:'Plan Dog',categoria:'mascotas',tipo:'Antipulgas',
    descripcion:'Pipetas antipulgas para gatos. Confirmar indicaciones y dosis según peso y edad.',
    imagen:'img/productos/pipetas-demo.jpg',destacado:false,
    variantes:[{id:'consulta',nombre:'Presentación por confirmar',precio:34.90}]
  },
  {
    id:'basta-jean',nombre:'Basta de pantalón jean',marca:'Servicio TUKI',categoria:'lavanderia',tipo:'Costura y ajustes',
    descripcion:'Ajuste de basta para pantalón jean. Medida y precio final se confirman por WhatsApp.',
    imagen:'img/productos/costura-jean.svg',destacado:true,
    variantes:[{id:'unidad',nombre:'1 servicio',precio:12.00}]
  },
  {
    id:'cierre-jean',nombre:'Cambio de cierre',marca:'Servicio TUKI',categoria:'lavanderia',tipo:'Costura y ajustes',
    descripcion:'Cambio de cierre en pantalón o short; consulta si aplica a falda, drill o tela.',
    imagen:'img/productos/cierre-jean.svg',
    variantes:[{id:'unidad',nombre:'1 servicio',precio:18.00}]
  },
  {
    id:'lavado',nombre:'Servicio de lavandería',marca:'Servicio TUKI',categoria:'lavanderia',tipo:'Cuidado de prendas',
    descripcion:'Servicio de lavandería bajo coordinación. El importe es solo demostrativo.',
    imagen:'img/productos/lavado.svg',
    variantes:[{id:'consulta',nombre:'Servicio referencial',precio:20.00}]
  },
  {
    id:'planchado',nombre:'Planchado de prendas',marca:'Servicio TUKI',categoria:'lavanderia',tipo:'Cuidado de prendas',
    descripcion:'Planchado y acabado de prendas. Precio sujeto a cantidad y tipo de prenda.',
    imagen:'img/productos/planchado.svg',
    variantes:[{id:'consulta',nombre:'Servicio referencial',precio:10.00}]
  },
  {
    id:'aceite-cocina',nombre:'Aceite vegetal TUKI · concepto',marca:'TUKI',categoria:'hogar',tipo:'Aceites y cocina',
    descripcion:'Línea de cocina proyectada. Esta imagen es un concepto y no un producto disponible.',
    imagen:'img/productos/aceite-demo.svg',proximamente:true,
    variantes:[{id:'1lt',nombre:'Concepto 1 L',precio:0}]
  },
  {
    id:'aceite-oliva',nombre:'Aceite de oliva · concepto',marca:'TUKI',categoria:'hogar',tipo:'Aceites y cocina',
    descripcion:'Producto de muestra para una futura línea de hogar y cocina.',
    imagen:'img/productos/aceite-demo.svg',proximamente:true,
    variantes:[{id:'500ml',nombre:'Concepto 500 ml',precio:0}]
  },
  {
    id:'nevora-serum',nombre:'NÉVORA Sérum facial',marca:'NÉVORA',categoria:'belleza',tipo:'Cuidado facial',
    descripcion:'Futura línea de cuidado de la piel. Concepto visual, composición no definida.',
    imagen:'img/productos/nevora-serum-demo.svg',proximamente:true,etiqueta:'Próximamente',
    variantes:[{id:'demo',nombre:'Presentación por definir',precio:0}]
  },
  {
    id:'nevora-crema',nombre:'NÉVORA Crema hidratante',marca:'NÉVORA',categoria:'belleza',tipo:'Cuidado facial',
    descripcion:'Concepto de crema de hidratación facial; formulación y lanzamiento por definir.',
    imagen:'img/productos/nevora-crema-demo.svg',proximamente:true,etiqueta:'Próximamente',
    variantes:[{id:'demo',nombre:'Presentación por definir',precio:0}]
  }
];
