// src/data/hospedajes.js
// Datos de hospedajes de San Francisco, Valle Grande, Jujuy
// Reemplazá las coordenadas y datos con la información real de cada lugar.

const hospedajes = [
  {
    id: "001",
    nombre: "Hostería El Nogal",
    categoria: "hostería",
    descripcion:
      "Rodeada de arboles y nubes , esta acogedora hostería ofrece una experiencia única en plena Yunga jujeña. Sus habitaciones luminosas combinan confort y naturaleza. Ideal para familias y parejas que buscan tranquilidad y contacto con el entorno selvático.",
    descripcion_corta: "hospedaje tranquilo.",
    telefono: "+54 3886-526596",
    whatsapp: "54 3886-526596",
    direccion: "Ruta Provincial 83 Km 12, San Francisco, Valle Grande, Jujuy",
    coordenadas: {
      lat: -23.621722,
      lng:  -64.952003,


    },
    capacidad: 20,
    precio_desde: 18000,
    moneda: "ARS",
    servicios: [
      "wifi",
      "estacionamiento",
      "desayuno",      
      "quincho",        
    ],
    categorias_turismo: ["naturaleza", "familia", "descanso"],
    imagenes: [
      "/img/001/foto1.jpg",
      "/img/001/foto2.jpg",
      "/img/001/foto3.jpg",
    ],
    imagen_portada: "/img/001/portada.jpg",
    // Color placeholder mientras no hay fotos reales
    color_placeholder: "from-selva-700 to-tierra-700",
    activo: true,
  },
  {
    id: "002",
    nombre: "Complejo Cabañas Río Bermejo",
    categoria: "cabaña",
    descripcion:
      "Complejo de cabañas equipadas rodeadas de vegetación subtropical, a metros del Río Bermejo. Cada cabaña cuenta con cocina, baño privado, galería con hamacas y parrilla individual. Perfecto para grupos, familias o parejas que quieren privacidad y contacto directo con la naturaleza.",
    descripcion_corta: "Cabañas equipadas con galería y parrilla individual al borde del río.",
    telefono: "+54 388 400-0002",
    whatsapp: "5438840000002",
    direccion: "Acceso al Río Bermejo s/n, San Francisco, Valle Grande, Jujuy",
    coordenadas: {
      lat: -23.9550,
      lng: -65.0650,
    },
    capacidad: 30,
    precio_desde: 22000,
    moneda: "ARS",
    servicios: [
      "estacionamiento",
      "quincho",
      "parrilla_individual",
      "cocina_equipada",
      "acceso_rio",
      "admite_mascotas",
    ],
    categorias_turismo: ["aventura", "pesca", "familia", "naturaleza"],
    imagenes: [
      "/img/002/foto1.jpg",
      "/img/002/foto2.jpg",
      "/img/002/foto3.jpg",
    ],
    imagen_portada: "/img/002/portada.jpg",
    color_placeholder: "from-cielo-700 to-selva-700",
    activo: true,
  },
  {
    id: "003",
    nombre: "Casa de Huéspedes Doña Rosa",
    categoria: "b&b",
    descripcion:
      "Casa familiar en el corazón de San Francisco con más de 20 años recibiendo viajeros. Doña Rosa ofrece habitaciones limpias y cómodas con desayuno casero incluido: productos de la región, panes artesanales y mermeladas del lugar. El trato personal y los precios accesibles la hacen ideal para mochileros y viajeros solitarios.",
    descripcion_corta: "Casa familiar céntrica con desayuno casero y trato personalizado.",
    telefono: "+54 388 400-0003",
    whatsapp: "5438840000003",
    direccion: "Calle Principal 245, San Francisco, Valle Grande, Jujuy",
    coordenadas: {
      lat: -23.9510,
      lng: -65.0700,
    },
    capacidad: 10,
    precio_desde: 9000,
    moneda: "ARS",
    servicios: [
      "wifi",
      "desayuno",
      "estacionamiento",
    ],
    categorias_turismo: ["mochilero", "cultural", "familia"],
    imagenes: [
      "/img/003/foto1.jpg",
      "/img/003/foto2.jpg",
    ],
    imagen_portada: "/img/003/portada.jpg",
    color_placeholder: "from-barro-600 to-tierra-800",
    activo: true,
  },
]

export default hospedajes
