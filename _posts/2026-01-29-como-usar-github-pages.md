---
layout: post
title: "Cómo usar GitHub Pages en 5 minutos"
description: "Guía rápida para desplegar tu sitio web gratis con GitHub Pages"
date: 2026-01-29 14:00:00 -0600
categories: [Tutorial]
tags: [github, hosting, deploy, tutorial]
image: /assets/blog/github-pages.svg
reading_time: 5
author: admin
---

**GitHub Pages** es una forma gratuita y sencilla de hospedar sitios web estáticos directamente desde un repositorio de GitHub.

## Requisitos Previos

- Una cuenta de GitHub
- Conocimientos básicos de Git
- Un proyecto web (HTML, CSS, JS)

## Paso 1: Crear un Repositorio

```bash
# Crear directorio del proyecto
mkdir mi-sitio
cd mi-sitio

# Inicializar git
git init

# Crear archivo inicial
echo "<h1>Hola Mundo</h1>" > index.html
```

## Paso 2: Subir a GitHub

```bash
# Agregar archivos
git add .

# Commit inicial
git commit -m "Mi primer sitio"

# Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/mi-sitio.git

# Subir código
git push -u origin main
```

## Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. Busca **Pages** en el menú lateral
4. En **Source** selecciona **GitHub Actions**
5. ¡Listo! 🎉

## Paso 4: Acceder a tu sitio

Tu sitio estará disponible en:

```
https://TU-USUARIO.github.io/mi-sitio/
```

## Tips Avanzados

### Dominio Personalizado

Puedes usar tu propio dominio:

1. Crea un archivo `CNAME` con tu dominio
2. Configura los DNS de tu dominio

```
mi-dominio.com
```

### HTTPS Automático

GitHub Pages incluye SSL gratuito. Solo activa la opción **Enforce HTTPS** en Settings.

### Deploy Automático

Cada push a `main` despliega automáticamente tu sitio.

## Limitaciones

| Límite | Valor |
|--------|-------|
| Tamaño del sitio | 1 GB |
| Ancho de banda | 100 GB/mes |
| Builds por hora | 10 |

## Conclusión

GitHub Pages es perfecto para:

- ✅ Portafolios personales
- ✅ Documentación de proyectos
- ✅ Blogs estáticos
- ✅ Landing pages
- ✅ Proyectos de código abierto

---

¿Tienes preguntas? ¡Déjalas en los comentarios! 💬
