# Chris Fitness — Calculadora de Calorías y Macros

Web estática (HTML/CSS/JS puro, sin frameworks ni build) que calcula calorías y macros personalizados a partir de edad, peso, altura, actividad y objetivo, genera ideas de menú al instante, y dirige al usuario a WhatsApp para un plan 100% personalizado. No almacena ningún dato del usuario — todo el cálculo ocurre en su propio navegador.

## Estructura

```
/
├── index.html      → estructura de la página
├── style.css       → estilos (tema claro, acento naranja Chris Fitness)
├── meals.js        → base de alimentos + generador de menús
├── script.js       → lógica de cálculo de calorías/macros
└── README.md
```

No requiere `npm install` ni proceso de build. Es HTML/CSS/JS plano.

## Cómo funciona

1. El usuario mete edad, peso, altura, sexo, actividad y objetivo (con el slider de ritmo semanal).
2. Se calculan sus calorías de mantenimiento (Harris-Benedict) y objetivo según su meta, más sus macros (proteína por kg de peso corporal).
3. Se generan 3 ideas de menú (desayuno/comida/cena) que encajan con esos macros, usando una base de alimentos reales. El usuario puede regenerar otras opciones si quiere.
4. Al final, un botón le lleva directo a tu WhatsApp para pedir un plan 100% personalizado.

Nada de esto se envía a ningún servidor — todo el cálculo y la generación de menús ocurre en el navegador del propio usuario, así que no hay datos que almacenar ni gestionar.

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
- **Cambiar tu enlace de WhatsApp**: en `index.html`, busca `wa.me/message/` (aparece dos veces, en el `href` del botón) y sustituye por tu enlace.
- **Añadir o quitar alimentos del menú**: en `meals.js`, dentro de `FOODS` (comida/cena) y `BREAKFAST_FOODS` (desayuno). Cada alimento lleva sus macros por 100g y una ración mínima/máxima realista.
