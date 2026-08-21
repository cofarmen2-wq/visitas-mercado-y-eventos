const html5QrCode = new Html5Qrcode("reader");
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbxeRqX9w4SUUu2yGzNre3hVAr-RGTxX08_rZCxUcOWe9G376fqh1IS43c45-SvanGni/exec';

let contactoAnfitrionActual = "";
let listaPreinvitados = [];
let qrScannerActivo = false;

const maestroSectores = {
  "Mostrador": [{ nombre: "Atención Mostrador", contacto: "N/A" }],
  "PLANTA LOGISTICA": [
    { nombre: "MUGNECO ADRIAN", contacto: "5492615320950" },
    { nombre: "Carbajo Rodrigo", contacto: "5492615320950" },
    { nombre: "Di Lorenzo Diego", contacto: "5492615320950" }
  ],
  "CAPITAL HUMANO": [
    { nombre: "Fernández Rubén", contacto: "5492615320950" },
    { nombre: "Pablo Iacobucci", contacto: "5492614168508" },
    { nombre: "Tissera Mariana", contacto: "5492615320950" }
  ],
  "Mantenimiento": [
    { nombre: "Marsollier Ivan", contacto: "5492615320950" },
    { nombre: "Brizuela Tomas", contacto: "5492615320950" }
  ],
  "Administracion": [
    { nombre: "Martin Marcelo", contacto: "5492615320950" },
    { nombre: "Bustos Marcos", contacto: "5492615320950" },
    { nombre: "Videla Javier", contacto: "5492615320950" },
    { nombre: "Raimundo Julieta", contacto: "5492615320950" },
    { nombre: "Agüero Antonio", contacto: "5492615320950" },
    { nombre: "Velez Daniel", contacto: "N/A" }
  ],
  "Gerencia": [
    { nombre: "Funes Cristian", contacto: "5492615320950" },
    { nombre: "Pablo Iacobucci", contacto: "5492614168508" },
    { nombre: "Ganem Victoria", contacto: "549261551344" },
    { nombre: "Martin Marcelo", contacto: "5492615320950" }
  ],
  "Consejo": [{ nombre: "Ganem Victoria", contacto: "549261551344" }]
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarSectores();
  configurarEventos();
});

function cargarSectores() {
  const selectSector = document.getElementById("sector");
  selectSector.innerHTML = '<option value="">-- Seleccionar Sector --</option>';
  Object.keys(maestroSectores).forEach(sec => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    selectSector.appendChild(opt);
  });
}

function configurarEventos() {
  document.getElementById("sector").addEventListener("change", (e) => {
    const sector = e.target.value;
    const selectAnfitrion = document.getElementById("anfitrion");
    selectAnfitrion.innerHTML = '<option value="">-- Seleccionar Anfitrión --</option>';
    contactoAnfitrionActual = "";
    
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

  document.getElementById("anfitrion").addEventListener("change", (e) => {
    const opt = e.target.selectedOptions[0];
    contactoAnfitrionActual = opt ? opt.dataset.contacto || "" : "";
    document.getElementById("btnWhatsApp").style.display = 
      (contactoAnfitrionActual && contactoAnfitrionActual !== "N/A") ? "block" : "none";
  });

  document.getElementById("modoApp").addEventListener("change", (e) => {
    const modo = e.target.value;
    document.documentElement.className = modo !== "normal" ? `modo-${modo}` : "";
    document.getElementById("panelEventoConfig").style.display = (modo === "evento") ? "block" : "none";
    document.getElementById("groupPreinvitados").style.display = (modo === "preinvitados") ? "block" : "none";
  });

  document.getElementById("btnStartQR").addEventListener("click", iniciarCamara);
  document.getElementById("btnStopQR").addEventListener("click", detenerCamara);
  document.getElementById("formVisita").addEventListener("submit", guardarVisita);
  document.getElementById("btnWhatsApp").addEventListener("click", enviarWhatsApp);
}

// Control Cámara
function iniciarCamara() {
  const status = document.getElementById("qrStatus");
  status.textContent = "Solicitando cámara...";
  
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 220, height: 220 } },
    (decodedText) => {
      document.getElementById("dni").value = decodedText;
      status.textContent = "¡Código escaneado!";
      detenerCamara();
    },
    (err) => {
      status.textContent = "Buscando QR/DNI...";
    }
  ).then(() => {
    qrScannerActivo = true;
    document.getElementById("btnStartQR").style.display = "none";
    document.getElementById("btnStopQR").style.display = "inline-block";
  }).catch(err => {
    status.textContent = "Error de acceso a la cámara";
    console.error(err);
  });
}

function detenerCamara() {
  if (qrScannerActivo) {
    html5QrCode.stop().then(() => {
      qrScannerActivo = false;
      document.getElementById("btnStartQR").style.display = "inline-block";
      document.getElementById("btnStopQR").style.display = "none";
      document.getElementById("qrStatus").textContent = "Cámara inactiva";
    }).catch(err => console.error(err));
  }
}

// Guardar Registro
function guardarVisita(e) {
  e.preventDefault();
  const datos = {
    dni: document.getElementById("dni").value,
    nombre: document.getElementById("nombre").value,
    sector: document.getElementById("sector").value,
    anfitrion: document.getElementById("anfitrion").value,
    bultos: document.getElementById("bultos").value,
    observaciones: document.getElementById("observaciones").value,
    modo: document.getElementById("modoApp").value,
    fecha: new Date().toLocaleString()
  };

  fetch(URL_API_GOOGLE, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(() => {
    alert("¡Registro guardado con éxito!");
    document.getElementById("formVisita").reset();
  }).catch(err => {
    alert("Error al registrar ingreso");
    console.error(err);
  });
}

// Envío WhatsApp
function enviarWhatsApp() {
  if (!contactoAnfitrionActual || contactoAnfitrionActual === "N/A") return;
  const nombre = document.getElementById("nombre").value || "Un visitante";
  const msj = encodeURIComponent(`Hola, ${nombre} ha llegado a recepción para visitarte.`);
  window.open(`https://wa.me/${contactoAnfitrionActual}?text=${msj}`, '_blank');
}
