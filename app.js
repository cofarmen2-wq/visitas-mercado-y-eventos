// URL de tu Web App desplegada en Google Apps Script
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbxeRqX9w4SUUu2yGzNre3hVAr-RGTxX08_rZCxUcOWe9G376fqh1IS43c45-SvanGni/exec';

let html5QrCode = null;
let qrScannerActivo = false;
let contactoAnfitrionActual = "";
let listaPreinvitadosGlobal = [];

// Directory completo de Sectores y Anfitriones
const maestroSectores = {
  'PLANTA LOGISTICA': [
    { nombre: 'MUGNECO ADRIAN', contacto: '5492615320950' },
    { nombre: 'Carbajo Rodrigo', contacto: '5492615320950' },
    { nombre: 'Di Lorenzo Diego', contacto: '5492615320950' }
  ],
  'CAPITAL HUMANO': [
    { nombre: 'Fernández Rubén', contacto: '5492615320950' },
    { nombre: 'Pablo Iacobucci', contacto: '5492614168508' },
    { nombre: 'Tissera Mariana', contacto: '5492615320950' }
  ],
  'Gerencia': [
    { nombre: 'Funes Cristian', contacto: '5492615320950' },
    { nombre: 'Pablo Iacobucci', contacto: '5492614168508' },
    { nombre: 'Ganem Victoria', contacto: '549261551344' },
    { nombre: 'Martin Marcelo', contacto: '5492615320950' }
  ],
  'Administracion': [
    { nombre: 'Martin Marcelo', contacto: '5492615320950' },
    { nombre: 'Bustos Marcos', contacto: '5492615320950' },
    { nombre: 'Videla Javier', contacto: '5492615320950' },
    { nombre: 'Agüero Antonio', contacto: '5492615320950' },
    { nombre: 'Velez Daniel', contacto: 'N/A' }
  ],
  'Consejo': [{ nombre: 'Ganem Victoria', contacto: '549261551344' }],
  'Funsad': [{ nombre: 'Ganem Victoria', contacto: '549261551344' }],
  'Lobby': [
    { nombre: 'Sanchez Alejandro', contacto: '5492615158389' },
    { nombre: 'Ganem Victoria', contacto: '549261551344' },
    { nombre: 'Escudero Carina', contacto: '5492615320950' }
  ],
  'Operador Logistico nave 2': [
    { nombre: 'Constantino Adriana', contacto: '5492615320950' },
    { nombre: 'Valdez Liliana', contacto: '5492616757808' }
  ],
  'Comercial': [
    { nombre: 'Molina Andres', contacto: '5492615320950' },
    { nombre: 'Tescari Maria Jose', contacto: '5492615320950' },
    { nombre: 'Reina Julia', contacto: '5492615320950' },
    { nombre: 'Sepulveda Marcela', contacto: '5492615320950' },
    { nombre: 'Sanabria Juan', contacto: '5492615320950' },
    { nombre: 'Perez Agustin', contacto: '5492615320950' }
  ],
  'Cajas': [
    { nombre: 'Arce José', contacto: '5492615320950' },
    { nombre: 'Ponce Matias', contacto: '5492615320950' }
  ],
  'Administración osep': [
    { nombre: 'Pelayes Sergio', contacto: '5492615320950' },
    { nombre: 'Oropel Walter', contacto: '5492615320950' },
    { nombre: 'Garay Diego', contacto: '5492615320950' },
    { nombre: 'Fernandez Jose Luis', contacto: '5492615320950' },
    { nombre: 'Dominguez Diego', contacto: '5492615320950' },
    { nombre: 'Peroso Vanesa', contacto: '5492615320950' }
  ],
  'Recepción Nave 1': [
    { nombre: 'Paris Sebastian', contacto: '5492615320950' },
    { nombre: 'Guerra Emanuel', contacto: 'N/A' },
    { nombre: 'Pubill Franco', contacto: 'N/A' },
    { nombre: 'Fernandez Leonardo', contacto: 'N/A' },
    { nombre: 'Marzonetto Emiliano', contacto: 'N/A' }
  ],
  'Recepción Nave 2': [
    { nombre: 'Moran Federico', contacto: 'N/A' },
    { nombre: 'Montenegro Victor', contacto: 'N/A' },
    { nombre: 'Herrera Luis', contacto: 'N/A' }
  ],
  'Créditos': [
    { nombre: 'Rovatti Dario', contacto: '5492615320950' },
    { nombre: 'Agüero Rocio', contacto: 'N/A' },
    { nombre: 'Andreoni Anabela', contacto: 'N/A' }
  ],
  'Sistemas': [
    { nombre: 'Lujan Omar', contacto: '5492615320950' },
    { nombre: 'Puebla Adrian', contacto: '5492615320950' },
    { nombre: 'Placci Martin', contacto: '5492615320950' }
  ],
  'Devolución a Proveedor y/o donaciones': [
    { nombre: 'Alvarez Cecilia', contacto: '5492615320950' }
  ],
  'Mostrador': [{ nombre: 'Atención Mostrador', contacto: 'N/A' }],
  'Recepcion Técnica': [
    { nombre: 'Daniel Ríos', contacto: '5492615320950' },
    { nombre: 'Cecilia Nadal', contacto: '5492615320950' },
    { nombre: 'Carina Escudero', contacto: '5492615320950' },
    { nombre: 'Natalia Bustos', contacto: '5492612128450' },
    { nombre: 'Jennifer Agüero', contacto: '5492615320950' }
  ],
  'Mantenimiento': [
    { nombre: 'Marsollier Ivan', contacto: '5492615320950' },
    { nombre: 'Brizuela Tomas', contacto: '5492615320950' }
  ],
  'Guardia': [{ nombre: 'Puesto 1', contacto: '5492615320950' }],
  'EVENTO': [{ nombre: 'EVENTO', contacto: 'N/A' }]
};

document.addEventListener("DOMContentLoaded", () => {
  cargarSectores();
  configurarEventos();
  obtenerPreinvitados();
});

// Carga los sectores en el desplegable
function cargarSectores() {
  const selectSector = document.getElementById("sector");
  if (!selectSector) return;
  selectSector.innerHTML = '<option value="">-- Seleccionar Sector --</option>';
  
  Object.keys(maestroSectores).forEach(sec => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    selectSector.appendChild(opt);
  });
}

// Configuración de escuchadores y dinámicas de la app
function configurarEventos() {
  const selectSector = document.getElementById("sector");
  const selectAnfitrion = document.getElementById("anfitrion");
  const modoApp = document.getElementById("modoApp");

  // Cambio de Sector
  if (selectSector) {
    selectSector.addEventListener("change", (e) => {
      const sector = e.target.value;
      selectAnfitrion.innerHTML = '<option value="">-- Seleccionar Anfitrión --</option>';
      contactoAnfitrionActual = "";
      
      const btnWA = document.getElementById("btnWhatsApp");
      if (btnWA) btnWA.style.display = "none";

      if (sector && maestroSectores[sector]) {
        maestroSectores[sector].forEach(p => {
          const opt = document.createElement("option");
          opt.value = p.nombre;
          opt.dataset.contacto = p.contacto;
          opt.textContent = p.nombre;
          selectAnfitrion.appendChild(opt);
        });
      }
    });
  }

  // Cambio de Anfitrión
  if (selectAnfitrion) {
    selectAnfitrion.addEventListener("change", (e) => {
      const opt = e.target.selectedOptions[0];
      contactoAnfitrionActual = opt ? opt.dataset.contacto || "" : "";
      
      const btnWA = document.getElementById("btnWhatsApp");
      if (btnWA) {
        btnWA.style.display = (contactoAnfitrionActual && contactoAnfitrionActual !== "N/A") ? "block" : "none";
      }
    });
  }

  // Cambio de Modo (Normal, Evento, Preinvitados)
  if (modoApp) {
    modoApp.addEventListener("change", (e) => {
      const modo = e.target.value;
      document.body.className = modo !== "normal" ? `modo-${modo}` : "";

      const panelEvento = document.getElementById("panelEventoConfig");
      const groupPre = document.getElementById("grouppreinvitados");

      if (panelEvento) panelEvento.classList.toggle("hidden", modo !== "evento");
      if (groupPre) groupPre.classList.toggle("hidden", modo !== "preinvitados");
    });
  }

  // Búsqueda de preinvitados en tiempo real
  const inputBuscarPre = document.getElementById("buscarPreinvitado");
  if (inputBuscarPre) {
    inputBuscarPre.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) return;

      const coincidencia = listaPreinvitadosGlobal.find(p => p.toLowerCase().includes(query));
      if (coincidencia) {
        document.getElementById("nombre").value = coincidencia;
      }
    });
  }

  // Eventos de botones
  document.getElementById("btnStartQR")?.addEventListener("click", iniciarCamara);
  document.getElementById("btnStopQR")?.addEventListener("click", detenerCamara);
  document.getElementById("formVisita")?.addEventListener("submit", guardarVisita);
  document.getElementById("btnWhatsApp")?.addEventListener("click", enviarWhatsApp);
}

// Lector de Cámara para DNI Argentino (PDF417) y Código QR
function iniciarCamara() {
  const status = document.getElementById("qrStatus");
  if (status) status.textContent = "Iniciando cámara...";

  html5QrCode = new Html5Qrcode("qr-reader");

  const config = {
    fps: 15,
    qrbox: { width: 280, height: 180 },
    aspectRatio: 1.0,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.PDF_417,
      Html5QrcodeSupportedFormats.CODE_128
    ]
  };

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    (decodedText) => {
      procesarCodigoEscaneado(decodedText);
      detenerCamara();
    },
    () => {
      if (status) status.textContent = "Apunta al código QR o DNI...";
    }
  ).then(() => {
    qrScannerActivo = true;
    document.getElementById("btnStartQR").style.display = "none";
    document.getElementById("btnStopQR").style.display = "inline-block";
  }).catch(err => {
    if (status) status.textContent = "Error al acceder a la cámara";
    console.error(err);
  });
}

function detenerCamara() {
  if (html5QrCode && qrScannerActivo) {
    html5QrCode.stop().then(() => {
      qrScannerActivo = false;
      document.getElementById("btnStartQR").style.display = "inline-block";
      document.getElementById("btnStopQR").style.display = "none";
      const status = document.getElementById("qrStatus");
      if (status) status.textContent = "Cámara inactiva";
    }).catch(err => console.error(err));
  }
}

// Decodificador de datos escaneados (DNI PDF417 o QR directo)
function procesarCodigoEscaneado(texto) {
  const status = document.getElementById("qrStatus");
  if (status) status.textContent = "¡Lectura Exitosa!";

  const partes = texto.split("@");
  if (partes.length >= 8) {
    // PDF417 de DNI Físico Argentino
    const apellido = partes[1] || "";
    const nombre = partes[2] || "";
    const dni = partes[4] || partes[1] || "";

    document.getElementById("dni").value = dni.trim();
    document.getElementById("nombre").value = `${nombre} ${apellido}`.trim();
  } else if (partes.length >= 2) {
    // Formatos de DNI reducidos
    document.getElementById("dni").value = (partes[0] || partes[1]).trim();
  } else {
    // Lectura de QR estándar
    document.getElementById("dni").value = texto.trim();
  }
}

// Obtener la lista de Preinvitados desde Apps Script mediante doGet
function obtenerPreinvitados() {
  fetch(`${URL_API_GOOGLE}?tipo=preinvitados`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        listaPreinvitadosGlobal = data;
      }
    })
    .catch(err => console.error("Error al obtener preinvitados:", err));
}

// Envío del registro de visita hacia Apps Script
function guardarVisita(e) {
  e.preventDefault();

  const modo = document.getElementById("modoApp")?.value || "normal";
  const datosPersonales = document.getElementById("nombre")?.value || "";

  const payload = {
    datosPersonales: datosPersonales,
    dni: document.getElementById("dni")?.value || "",
    empresa: document.getElementById("empresa")?.value || "",
    sector: document.getElementById("sector")?.value || "",
    anfitrion: document.getElementById("anfitrion")?.value || "",
    modo: modo,
    modoEvento: modo === "evento",
    observaciones: modo === "evento" ? (document.getElementById("nombreEvento")?.value || "") : "",
    esNuevoPreinvitado: modo === "preinvitados"
  };

  fetch(URL_API_GOOGLE, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    alert("¡Ingreso registrado correctamente!");
    document.getElementById("formVisita").reset();
    const btnWA = document.getElementById("btnWhatsApp");
    if (btnWA) btnWA.style.display = "none";
  }).catch(err => {
    alert("Error al intentar registrar el ingreso");
    console.error(err);
  });
}

// Redirección directa a WhatsApp Web / App
function enviarWhatsApp() {
  if (!contactoAnfitrionActual || contactoAnfitrionActual === "N/A") return;

  const nombre = document.getElementById("nombre")?.value || "Un visitante";
  const sector = document.getElementById("sector")?.value || "";
  const msj = encodeURIComponent(`Hola, ${nombre} ha llegado a recepción para el sector ${sector}.`);

  window.open(`https://wa.me/${contactoAnfitrionActual}?text=${msj}`, '_blank');
}
