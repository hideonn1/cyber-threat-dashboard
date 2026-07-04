# Consola de Inteligencia de Amenazas - Threat Intel

Este repositorio contiene la implementación del panel operativo de ciberseguridad desarrollado para la asignatura de Programación Frontend en INACAP, correspondiente a la tercera evaluación. La aplicación actúa como una consola centralizada de inteligencia de amenazas (Threat Intelligence Console), diseñada para analistas de seguridad de la información. Integra feeds en tiempo real tanto nacionales (CSIRT Chile / ANCI) como internacionales (CISA KEV, The Hacker News) bajo una interfaz interactiva y optimizada para el monitoreo táctico.

## Características Principales

- **Monitoreo de Alertas Nacionales (ANCI/CSIRT)**: Módulo que recupera alertas emitidas por la Agencia Nacional de Ciberseguridad de Chile, permitiendo el filtrado interactivo por nivel de clasificación del Traffic Light Protocol (TLP: RED, AMBER, GREEN, WHITE) y búsquedas avanzadas por código o título de alerta.
- **Base de Datos Global de Vulnerabilidades (CISA KEV)**: Integración directa con el catálogo Known Exploited Vulnerabilities de CISA (EE. UU.), organizando cronológicamente las vulnerabilidades explotadas de manera activa e incluyendo un buscador optimizado por CVE-ID, proveedor (vendor) y producto.
- **Despachos de Noticias Globales (The Hacker News)**: Canal RSS de noticias internacionales sobre incidentes y vectores de ataque emergentes, procesado localmente mediante un convertidor JSON.
- **Localización y Multilenguaje (i18n)**: Soporte completo para operación bilingüe (español e inglés). Las preferencias se persisten de forma automática en el navegador mediante cookies del lado del cliente.
- **Arquitectura de Resiliencia (Modo de Contingencia Local)**: En caso de que el endpoint del servidor nacional no esté disponible o exista un fallo de enlace de red, la consola entra en modo de respaldo local, mostrando un estado controlado de alerta fuera de línea e instrucciones de mitigación de conectividad.
- **Métricas de Análisis**: Panel superior que expone métricas críticas consolidadas, incluyendo el ratio de phishing/fraude en las amenazas detectadas y el tiempo transcurrido desde la última sincronización con los diversos servicios.

## Pila Tecnológica

- **Framework**: React 19.2.7
- **Lenguaje**: TypeScript 6.0
- **Servidor de Desarrollo y Compilación**: Vite 8.1.1 con soporte para recarga en caliente (HMR)
- **Estilos**: Tailwind CSS v4.3.2 utilizando el compilador nativo `@tailwindcss/vite` e integrando fuentes personalizadas (JetBrains Mono y Outfit)
- **Gestión de Preferencias**: `js-cookie` 3.0.8 para la persistencia de cookies del idioma
- **Linter**: ESLint 10.6.0 con reglas recomendadas para TypeScript y React

## Estructura del Proyecto

El código fuente está estructurado bajo una arquitectura modular orientada a características (features):

- **src/components/**: Componentes de interfaz compartidos como la barra de navegación, el pie de página y los selectores de idioma.
- **src/features/dashboard/**: Componentes del contenedor principal, cálculo de métricas, definición del contexto de datos (`IntelDataContext`) y proveedor (`IntelDataProvider`).
- **src/features/threats/**: Módulo encargado de la presentación y filtrado de las alertas nacionales provenientes de la ANCI.
- **src/features/global/**: Visualización del catálogo KEV de la CISA.
- **src/features/news/**: Procesamiento y presentación de las últimas noticias de ciberseguridad a nivel mundial.
- **src/i18n/**: Motor de traducción local, provisto a través de React Context, con soporte para llaves tipadas de traducción.
- **src/lib/**: Funciones de utilidad general, incluyendo la función optimizada de petición HTTP `fetchJson`.

<details>
  <summary><b>Ver estructura completa del proyecto</b></summary>

```text
cyber-threat-dashboard
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── hero.png
│   │   └── vite.svg
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── Navbar.tsx
│   │   └── TranslatedText.tsx
│   ├── features
│   │   ├── dashboard
│   │   │   ├── AnalystMetricsPanel.tsx
│   │   │   ├── IntelDataProvider.tsx
│   │   │   ├── TacticalConsole.tsx
│   │   │   ├── TacticalTabs.tsx
│   │   │   ├── computeMetrics.ts
│   │   │   ├── intelDataContext.ts
│   │   │   ├── types.ts
│   │   │   └── useIntelData.ts
│   │   ├── global
│   │   │   ├── components
│   │   │   │   └── CisaKevPanel.tsx
│   │   │   └── types.ts
│   │   ├── news
│   │   │   ├── components
│   │   │   │   └── GlobalIntelPanel.tsx
│   │   │   └── types.ts
│   │   ├── preferences
│   │   └── threats
│   │       ├── ThreatsContainer.tsx
│   │       ├── components
│   │       │   └── AlertCard.tsx
│   │       ├── hooks
│   │       └── types.ts
│   ├── i18n
│   │   ├── LanguageProvider.tsx
│   │   ├── languageContext.ts
│   │   ├── messages.ts
│   │   ├── translateContent.ts
│   │   ├── types.ts
│   │   └── useLanguage.ts
│   ├── index.css
│   ├── lib
│   │   └── fetchJson.ts
│   └── main.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

</details>

## Configuración de Proxy de Desarrollo

Para eludir limitaciones de Cross-Origin Resource Sharing (CORS) durante la fase de desarrollo, el servidor de Vite se encuentra configurado como proxy inverso para los siguientes endpoints externos:

- `/api` -> Redirige a `https://anci.gob.cl`
- `/global-threats` -> Redirige a `https://www.cisa.gov` (reescribiendo la ruta base a `/sites/default/files/feeds` para el acceso al archivo JSON)
- `/rss2-json` -> Redirige a `https://api.rss2json.com` para la conversión del feed RSS a formato JSON
- `/gtx` -> Redirige a `https://translate.googleapis.com` para la gestión del cliente de traducción

La configuración detallada puede localizarse en el archivo `vite.config.ts`.

## Instrucciones de Instalación y Uso

### Prerrequisitos

Se requiere contar con Node.js en su versión LTS y el gestor de paquetes npm instalados en el sistema operativo.

### Instalación de Dependencias

Ejecute el siguiente comando en la raíz del proyecto para descargar e instalar los módulos necesarios:

```bash
npm install
```

### Servidor de Desarrollo

Inicie la aplicación en el entorno de desarrollo local ejecutando:

```bash
npm run dev
```

Esto levantará el servidor local de Vite, generalmente en `http://localhost:5173`, habilitando además las redirecciones de proxy especificadas.

### Compilación de Produccion

Para generar el build optimizado de la aplicación listo para producción, ejecute:

```bash
npm run build
```

Los archivos estáticos resultantes serán depositados en el directorio `/dist/`.

### Verificaciones y Calidad

Para evaluar el cumplimiento de las normas de estilo y convenciones del código, puede ejecutar:

```bash
npm run lint
```

Para validar los tipos de TypeScript sin emitir código compilado, utilice:

```bash
npm run tsc
```
