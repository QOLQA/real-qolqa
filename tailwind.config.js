/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",  // Apunta específicamente a tu carpeta de código fuente
    "./*.html",              // Apunta a la raíz de tu proyecto
    "index.html"    // Si tienes archivos HTML en public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}