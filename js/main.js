// main.js

// 1. Consulta GraphQL exacta según tus typeDefs
const QUERY_MATERIAS = `
  query {
    materias {
      id
      nombre
    }
  }
`;

// Diccionario local para asociar iconos según el ID de la materia
const MAPA_ICONOS = {
  BDD1: "🗄️",
  REDES1: "🌐",
  ING1: "💻",
  SO1: "🐧",
  AC1: "🏗️",
  AC2: "📟"
};

// 2. Petición asíncrona al servidor Apollo
async function obtenerMaterias() {
  try {
    const response = await fetch("https://servidor-graphql-production.up.railway.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY_MATERIAS })
    });

    const resultado = await response.json();
    
    if (resultado.errors) {
      console.error("Errores de GraphQL:", resultado.errors);
      return [];
    }
    
    return resultado.data.materias;
  } catch (error) {
    console.error("Error crítico de red:", error);
    return [];
  }
}

// 3. Renderizado dinámico en el contenedor
function renderizarTarjetas(materias) {
  const contenedor = document.querySelector(".categoria-container");
  
  if (!contenedor) return;

  // Limpiamos el contenido inicial de carga
  contenedor.innerHTML = "";

  if (materias.length === 0) {
    contenedor.innerHTML = `<div class="alert alert-warning w-100 text-center">No se pudieron cargar las materias.</div>`;
    return;
  }

  // Generamos el HTML iterando los datos del servidor
  contenedor.innerHTML = materias.map(materia => {
    // Si el ID no existe en el mapa, usamos un icono por defecto
    const icono = MAPA_ICONOS[materia.id] || "📚";
    
    return `
      <a href="materia.html?id=${materia.id}" class="tarjeta-categoria" data-id="${materia.id}"> 
          <div class="icono-card">
              <span>${icono}</span>
          </div>
          <h2>${materia.nombre}</h2>
      </a>
    `;
  }).join("");
}

// 4. Inicialización al cargar la estructura del documento
document.addEventListener("DOMContentLoaded", async () => {
  const listaMaterias = await obtenerMaterias();
  renderizarTarjetas(listaMaterias);
});