# 🏔️ Hospedajes San Francisco · Jujuy

Directorio web de hospedajes turísticos para San Francisco, Valle Grande, Jujuy, Argentina.

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# → http://localhost:5173
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx       # Wrapper con Outlet
│   │   ├── Header.jsx       # Nav sticky con efecto scroll
│   │   └── Footer.jsx       # Pie de página
│   └── ui/                  # (se completa en PROMPT 2)
├── pages/
│   ├── HomePage.jsx         # Landing con hero y destacados
│   ├── HospedajesPage.jsx   # Listado con filtros
│   ├── HospedajeDetallePage.jsx  # Ficha completa
│   ├── MapaPage.jsx         # Mapa general (placeholder)
│   └── NotFoundPage.jsx     # 404
├── data/
│   └── hospedajes.json      # Base de datos local
├── hooks/
│   └── useHospedajes.js     # Lógica de filtros y acceso a datos
├── utils/
│   ├── serviciosConfig.js   # Config de íconos y labels
│   └── formatters.js        # Helpers: precio, WhatsApp, Maps
├── App.jsx                  # Router principal
├── main.jsx                 # Entry point
└── index.css                # Tailwind + clases personalizadas
```

## 🎨 Paleta de colores (Yunga Jujeña)

| Token         | Hex       | Uso                        |
|---------------|-----------|----------------------------|
| `tierra-500`  | `#8B5E3C` | Botones primarios, accents  |
| `yunga-500`   | `#3D6B4F` | Verde selva, botones 2°    |
| `cielo-500`   | `#6B9BAF` | Cielo andino               |
| `barro-400`   | `#C4956A` | Logo, highlights           |
| `noche`       | `#1A2332` | Header, footer, fondo dark |
| `arena`       | `#F5ECD7` | Fondo claro, textos dark   |

## 🗺️ Rutas

| Ruta              | Página                    |
|-------------------|---------------------------|
| `/`               | Home con hero y destacados |
| `/hospedajes`     | Listado con filtros        |
| `/hospedaje/:id`  | Detalle del hospedaje      |
| `/mapa`           | Mapa interactivo           |

## 📋 Prompts pendientes

- [ ] PROMPT 2 — Componente HospedajeCard mejorado
- [ ] PROMPT 3 — Panel de filtros avanzado
- [ ] PROMPT 4 — Galería de imágenes con lightbox
- [ ] PROMPT 5 — Mapa Leaflet con marcadores
- [ ] PROMPT 6 — Página detalle completa
- [ ] PROMPT 7 — Header optimizado
- [ ] PROMPT 8 — SEO y metadata
