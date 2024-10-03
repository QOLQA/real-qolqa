// Variable para almacenar la función de desuscripción
export let unsubscribe = {
  value: null
};

// Función para limpiar los observadores anteriores
export const cleanUp = () => {
  if (unsubscribe.value) {
    unsubscribe.value(); // Desuscribe del store anterior
    unsubscribe.value = null;
  }
};

export const app = document.getElementById('app');

export const loadHTML = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const html = await response.text();
      app.innerHTML = html;
    } else {
      console.error(`Error al cargar ${filePath}: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error en la solicitud del archivo ${filePath}`);
  }
}
