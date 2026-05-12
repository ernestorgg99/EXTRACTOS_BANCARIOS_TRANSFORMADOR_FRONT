# Extractos Bancarios Transformador - Frontend

Aplicación web para transformar y comparar extractos bancarios con base de datos.

## 🚀 Despliegue

Esta aplicación está diseñada para ser desplegada en GitHub Pages.

### Estructura del repositorio

```
EXTRACTOS_BANCARIOS_TRANSFORMADOR_FRONT/
├── index.html          # Página principal
├── static/
│   ├── script.js       # Lógica principal y API
│   ├── transformations.js  # Transformaciones de datos
│   ├── utils.js        # Utilidades
│   ├── styles.css      # Estilos CSS
│   └── logos/          # Imágenes de bancos
└── README.md           # Este archivo
```

### Configuración

La aplicación consume una API backend desplegada en Railway:

- URL: `https://extractosbancariostransformadorbackend-production.up.railway.app`
- Endpoints:
  - `GET /api/status` - Verificar estado del servicio
  - `POST /api/check_duplicates` - Comparar movimientos con base de datos

### Despliegue en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona **Deploy from a branch**.
4. Elige la rama `main` y carpeta `/(root)`.
5. Guarda y espera el despliegue.

La aplicación estará disponible en `https://tu-usuario.github.io/EXTRACTOS_BANCARIOS_TRANSFORMADOR_FRONT/`.

### Funcionalidades

- Carga de archivos Excel/CSV
- Transformación de datos bancarios
- Comparación con base de datos para detectar duplicados
- Interfaz responsive con modo oscuro

### Dependencias

- XLSX.js para procesamiento de archivos
- Fetch API para comunicación con backend

### Notas

- Asegúrate de que el backend esté aprobado (`APPROVAL_STATUS=aprobado`) para que funcione.
- Los archivos estáticos se sirven desde rutas relativas.