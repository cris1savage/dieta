# Chris Fitness — Calculadora de Calorías y Macros

Web estática (HTML/CSS/JS puro, sin frameworks ni build) que calcula calorías y macros personalizados a partir de edad, peso, altura, actividad y objetivo, y captura el email del usuario para enviarle su plan completo.

## Estructura

```
/
├── index.html      → estructura de la página
├── style.css       → estilos (tema oscuro, acento naranja Chris Fitness)
├── script.js       → lógica de cálculo + envío de email
└── README.md
```

No requiere `npm install` ni proceso de build. Es HTML/CSS/JS plano.

## ⚠️ Antes de publicar: conecta el formulario de email

Ahora mismo el formulario de email funciona visualmente pero **no envía nada a ningún sitio** hasta que lo conectes:

1. Crea una cuenta gratis en **[formspree.io](https://formspree.io)** (plan gratis: 50 envíos/mes).
2. Crea un formulario nuevo. Te dará una URL tipo:
   `https://formspree.io/f/abcd1234`
3. Abre `script.js`, busca esta línea (cerca de la mitad del archivo):
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TU_ID_AQUI';
   ```
4. Sustituye `TU_ID_AQUI` por tu endpoint real.
5. Guarda y vuelve a subir el cambio (commit + push).

Cada vez que alguien complete el formulario, te llegará un email a la cuenta con la que creaste Formspree, con: email del usuario, objetivo, calorías, macros, peso, altura, edad y ritmo semanal elegido. Desde el panel de Formspree puedes exportarlo a CSV también.

> Si en el futuro quieres conectar esto a un CRM o a tu lista de email marketing (Mailchimp, Brevo, etc.), solo hay que cambiar esa URL por el endpoint correspondiente — el resto del código no cambia.

## Cómo subir esto a GitHub

Si nunca has usado GitHub desde terminal, sigue estos pasos exactos desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Calculadora de calorías y macros - Chris Fitness"
```

Luego, en [github.com](https://github.com), crea un repositorio nuevo (botón verde "New repository"). Ponle un nombre, por ejemplo `chris-fitness-calc`, y **no** marques la opción de añadir README (ya tienes uno). Cuando lo crees, GitHub te dará unos comandos parecidos a estos — cópialos de tu propia página, el usuario y nombre cambiarán:

```bash
git remote add origin https://github.com/TU_USUARIO/chris-fitness-calc.git
git branch -M main
git push -u origin main
```

## Cómo publicarlo en Vercel

1. Ve a [vercel.com](https://vercel.com) y entra con tu cuenta de GitHub.
2. Click en **"Add New" → "Project"**.
3. Selecciona el repositorio `chris-fitness-calc` que acabas de subir.
4. Vercel detectará que es un sitio estático automáticamente. No hace falta tocar ningún ajuste de "Framework Preset" ni "Build Command" — déjalo todo en blanco/por defecto.
5. Click en **"Deploy"**.
6. En menos de un minuto tendrás una URL pública tipo `chris-fitness-calc.vercel.app`.

Cada vez que hagas `git push` a la rama `main`, Vercel actualizará la web automáticamente sola.

### Dominio propio (opcional)

Si quieres usar tu propio dominio (ej. `calculadora.chrisfitness.com`), en el proyecto de Vercel ve a **Settings → Domains** y sigue las instrucciones para apuntar tu DNS.

## Editar contenido o fórmulas

- **Cambiar colores/tipografía**: todo está centralizado al inicio de `style.css` en la sección `:root` (variables de color).
- **Cambiar la fórmula de calorías**: función `calcBMR()` en `script.js` (actualmente Harris-Benedict).
- **Cambiar gramos de proteína/grasa por kg**: funciones `proteinPerKg()` y `fatPerKg()` en `script.js`.
- **Cambiar el rango del slider de ritmo semanal**: array `PACE_STEPS` en `script.js` (actualmente 0.0 a 1.0 kg/semana).
