# Consola de Inteligencia de Amenazas - Threat Intel

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

Este repositorio contiene la implementación del panel operativo de ciberseguridad desarrollado para la asignatura de Programación Frontend en INACAP, correspondiente a la tercera evaluación. La aplicación actúa como una consola centralizada de inteligencia de amenazas (Threat Intelligence Console), diseñada para analistas de seguridad de la información. Integra feeds en tiempo real tanto nacionales (CSIRT Chile / ANCI) como internacionales (CISA KEV, The Hacker News) bajo una interfaz interactiva y optimizada para el monitoreo táctico.

## Características Principales

- **Monitoreo de Alertas Nacionales (ANCI/CSIRT)**: Módulo que recupera alertas emitidas por la Agencia Nacional de Ciberseguridad de Chile, permitiendo el filtrado interactivo por nivel de clasificación del Traffic Light Protocol (TLP: RED, AMBER, GREEN, WHITE) y búsquedas avanzadas por código o título de alerta.
- **Base de Datos Global de Vulnerabilidades (CISA KEV)**: Integración directa con el catálogo Known Exploited Vulnerabilities de CISA (EE. UU.), organizando cronológicamente las vulnerabilidades explotadas de manera activa e incluyendo un buscador optimizado por CVE-ID, proveedor (vendor) y producto.
- **Despachos de Noticias Globales (The Hacker News)**: Canal RSS de noticias internacionales sobre incidentes y vectores de ataque emergentes, procesado nativamente extrayendo la metadata y el HTML desde el XML de origen.
- **Localización y Multilenguaje (i18n)**: Soporte completo para operación bilingüe (español e inglés). Las preferencias se persisten de forma automática en el navegador mediante cookies del lado del cliente.
- **Arquitectura de Resiliencia (Modo de Contingencia Local)**: En caso de que el endpoint del servidor nacional no esté disponible o exista un fallo de enlace de red, la consola entra en modo de respaldo local, cargando datos offline (`public/mock`) y mostrando un estado controlado de alerta fuera de línea.
- **Métricas de Análisis**: Panel superior que expone métricas críticas consolidadas, incluyendo el ratio de phishing/fraude en las amenazas detectadas y el tiempo transcurrido desde la última sincronización con los diversos servicios.

## Pila Tecnológica

- **Framework**: React 19.2.7
- **Lenguaje**: TypeScript 6.0
- **Servidor de Desarrollo y Compilación**: Vite 8.1.1 con soporte para recarga en caliente (HMR)
- **Estilos**: Tailwind CSS v4.3.2 utilizando el compilador nativo `@tailwindcss/vite` e integrando fuentes personalizadas (JetBrains Mono y Outfit)
- **Gestión de Preferencias**: `js-cookie` 3.0.8 para la persistencia de cookies del idioma
- **Linter**: ESLint 10.6.0 con reglas recomendadas para TypeScript y React

## Estructura del Proyecto y Arquitectura

El código fuente está estructurado bajo una arquitectura modular orientada a características (Feature-Sliced Design):

- **src/components/**: Componentes de interfaz transversales (UI core) como la barra de navegación, el pie de página y los selectores de idioma.
- **src/features/**: Módulos auto-contenidos divididos por dominio de negocio:
  - `dashboard`: Panel principal, cálculo de métricas y proveedor de datos global (`IntelDataContext`).
  - `global`: Visualización y manejo del catálogo KEV de CISA.
  - `news`: Procesamiento de RSS XML y panel global de despachos (The Hacker News).
  - `threats`: Presentación, filtrado y generación de reportes PDF de alertas nacionales ANCI.
- **src/i18n/**: Motor customizado de internacionalización (Traducción de estáticos + Google Translate on-the-fly con caché en localStorage).
- **src/lib/**: Utilidades core, como el cliente de red `fetchJson`.

<details>
  <summary><b>Ver árbol completo del repositorio</b></summary>

```text
cyber-threat-dashboard
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
├── vite.config.ts
├── public
│   ├── favicon.svg
│   ├── icons.svg
│   └── mock
│       └── anci-alerts.json
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── assets
    │   ├── hero.png
    │   └── vite.svg
    ├── components
    │   ├── Footer.tsx
    │   ├── LanguageToggle.tsx
    │   ├── Navbar.tsx
    │   └── TranslatedText.tsx
    ├── features
    │   ├── dashboard
    │   │   ├── AnalystMetricsPanel.tsx
    │   │   ├── IntelDataProvider.tsx
    │   │   ├── TacticalConsole.tsx
    │   │   ├── TacticalTabs.tsx
    │   │   ├── computeMetrics.ts
    │   │   ├── intelDataContext.ts
    │   │   ├── types.ts
    │   │   └── useIntelData.ts
    │   ├── global
    │   │   ├── components
    │   │   │   └── CisaKevPanel.tsx
    │   │   └── types.ts
    │   ├── news
    │   │   ├── components
    │   │   │   └── GlobalIntelPanel.tsx
    │   │   └── types.ts
    │   └── threats
    │       ├── ThreatsContainer.tsx
    │       ├── components
    │       │   └── AlertCard.tsx
    │       └── types.ts
    ├── i18n
    │   ├── LanguageProvider.tsx
    │   ├── languageContext.ts
    │   ├── messages.ts
    │   ├── translateContent.ts
    │   ├── types.ts
    │   └── useLanguage.ts
    └── lib
        └── fetchJson.ts
```

</details>

## Configuración de Proxy de Desarrollo y Producción

Para eludir limitaciones de Cross-Origin Resource Sharing (CORS) y conectar con fuentes de inteligencia externas, se emplea un sistema de proxys inversos (mediante `vite.config.ts` en local y `vercel.json` en producción):

- `/api` -> Redirige a `https://anci.gob.cl`
- `/global-threats` -> Redirige a `https://www.cisa.gov` (reescribiendo la ruta base a `/sites/default/files/feeds`)
- `/raw-rss` -> Redirige a `https://feeds.feedburner.com` para leer el feed XML crudo de THN
- `/gtx` -> Redirige a `https://translate.googleapis.com` para la gestión de la API de traducción

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

### Compilación de Producción

Para generar el build optimizado de la aplicación listo para despliegue (ej. en Vercel), ejecute:

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
