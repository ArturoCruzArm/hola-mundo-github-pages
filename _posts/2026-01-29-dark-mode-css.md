---
layout: post
title: "Implementar Dark Mode con CSS Variables"
description: "Aprende a crear un tema oscuro elegante usando solo CSS y un poco de JavaScript"
date: 2026-01-29 16:00:00 -0600
categories: [CSS]
tags: [css, dark-mode, variables, tema]
image: /assets/blog/dark-mode.svg
reading_time: 7
author: admin
---

El **modo oscuro** ya no es un lujo, es una necesidad. En este tutorial aprenderás a implementarlo de forma elegante.

## CSS Variables: La Base

Primero, definimos nuestras variables de color:

```css
:root {
  /* Tema Claro (default) */
  --color-bg: #ffffff;
  --color-text: #1e293b;
  --color-primary: #6366f1;
  --color-border: #e2e8f0;
}

[data-theme="dark"] {
  /* Tema Oscuro */
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  --color-primary: #818cf8;
  --color-border: #334155;
}
```

## Usar las Variables

```css
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease,
              color 0.3s ease;
}

.button {
  background: var(--color-primary);
  border: 1px solid var(--color-border);
}
```

## JavaScript para el Toggle

```javascript
const toggle = document.getElementById('themeToggle');

// Detectar preferencia del sistema
const prefersDark = window.matchMedia(
  '(prefers-color-scheme: dark)'
);

// Obtener tema guardado o usar preferencia
function getTheme() {
  return localStorage.getItem('theme')
    || (prefersDark.matches ? 'dark' : 'light');
}

// Aplicar tema
function setTheme(theme) {
  document.documentElement
    .setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  toggle.textContent = theme === 'dark'
    ? '☀️' : '🌙';
}

// Inicializar
setTheme(getTheme());

// Event listener
toggle.addEventListener('click', () => {
  const current = document.documentElement
    .getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});
```

## Respetar Preferencias del Sistema

```javascript
// Escuchar cambios en preferencia del sistema
prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
```

## Evitar Flash de Contenido

Para evitar que se vea el tema incorrecto al cargar:

```html
<head>
  <script>
    // Aplicar tema inmediatamente
    (function() {
      const theme = localStorage.getItem('theme')
        || (window.matchMedia('(prefers-color-scheme: dark)')
            .matches ? 'dark' : 'light');
      document.documentElement
        .setAttribute('data-theme', theme);
    })();
  </script>
</head>
```

## Imágenes Adaptativas

```css
/* Invertir imágenes en modo oscuro */
[data-theme="dark"] .invertible {
  filter: invert(1) hue-rotate(180deg);
}

/* O usar picture */
```

```html
<picture>
  <source
    srcset="logo-dark.png"
    media="(prefers-color-scheme: dark)">
  <img src="logo-light.png" alt="Logo">
</picture>
```

## Colores que Funcionan

| Uso | Claro | Oscuro |
|-----|-------|--------|
| Fondo | `#ffffff` | `#0f172a` |
| Texto | `#1e293b` | `#f1f5f9` |
| Muted | `#64748b` | `#94a3b8` |
| Border | `#e2e8f0` | `#334155` |
| Primary | `#6366f1` | `#818cf8` |

## Resultado Final

Con estas técnicas tendrás:

- ✅ Transiciones suaves
- ✅ Persistencia en localStorage
- ✅ Respeto a preferencias del sistema
- ✅ Sin flash de contenido
- ✅ Accesibilidad

---

¿Te gustó el artículo? ¡Compártelo! 🌙
