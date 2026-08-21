const html5QrCode = new Html5Qrcode("reader");
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbxeRqX9w4SUUu2yGzNre3hVAr-RGTxX08_rZCxUcOWe9G376fqhlIS43c45-SvanGni/exec';

let contactoAnfitrionActual = "";
let listaPreinvitados = [];

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
  "Consejo": [{ nombre: "Ganem Victoria", contacto: "549261551344" }],
  "Funsad": [{ nombre: "Ganem Victoria", contacto: "549261551344" }],
  "Lobby": [
    { nombre: "Sanchez Alejandro", contacto: "5492615158389" },
    { nombre: "Ganem Victoria", contacto: "549261551344" },
    { nombre: "Escudero Carina", contacto: "5492615320950" }
  ],
  "Operador Logistico nave 2": [
    { nombre: "Constantino Adriana", contacto: "5492615320950" },
    { nombre: "Valdez Liliana", contacto: "5492616757808" }
  ],
  "Comercial": [
    { nombre: "Molina Andres", contacto: "5492615320950" },
    { nombre: "Tescari Maria Jose", contacto: "5492615320950" },
    { nombre: "Sepulveda Marcela", contacto: "5492615320950" },
    { nombre: "Frigerio Carolina", contacto: "5492615320950" },
    { nombre: "Sanabria Juan", contacto: "5492615320950" },
    { nombre: "Perez Agustin", contacto: "5492615320950" }
  ],
  "Cajas": [
    { nombre: "Arce José", contacto: "5492615320950" },
    { nombre: "Ponce Matias", contacto: "5492615320950" }
  ],
  "Administración osep": [
    { nombre: "Pelayes Sergio", contacto: "5492615320950" },
    { nombre: "Oropel Walter", contacto: "55492615320950" },
    { nombre: "Merenda Gastón", contacto: "55492615320950" },
    { nombre: "Garay Diego", contacto: "5492615320950" },
    { nombre: "Fernandez Jose Luis", contacto: "5492615320950" },
    { nombre: "Dominguez Diego", contacto: "5492615320950" },
    { nombre: "Perozo Vannesa", contacto: "5492615320950" }
  ],
  "Recepción Nave 1": [
    { nombre: "Paris Sebastian", contacto: "5492615320950" },
    { nombre: "Guerra Emanuel", contacto: "N/A" },
    { nombre: "Pubill Franco", contacto: "N/A" },
    { nombre: "Fernandez Leonardo", contacto: "N/A" },
    { nombre: "Marzonetto Emiliano", contacto: "N/A" }
  ],
  "Recepción Nave 2": [
    { nombre: "Moran Federico", contacto: "N/A" },
    { nombre: "Montenegro Victor", contacto: "N/A" },
    { nombre: "Herrera Luis", contacto: "N/A" }
  ],
  "Créditos": [
    { nombre: "Rovatti Dario", contacto: "5492615320950" },
    { nombre: "Agüero Rocio", contacto: "N/A" },
    { nombre: "Andreoni Anabela", contacto: "N/A" }
  ],
  "Sistemas": [
    { nombre: "Lujan Omar", contacto: "5492615320950" },
    { nombre: "Puebla Adrian", contacto: "5492615320950" },
    { nombre: "Placci Martin", contacto: "5492615320950" }
  ],
  "Devolución a Proveedor y/o donaciones": [{ nombre: "Alvarez Cecilia", contacto: "5492615320950" }],
  "EVENTO": [{ nombre: "EVENTO", contacto: "N/A" }],
  "Recepcion Técnica": [
    { nombre: "Daniel Ríos", contacto: "5492615320950" },
    { nombre: "Cecilia Nadal", contacto: "5492615320950" },
    { nombre: "Carina Escudero", contacto: "5492615320950" },
    { nombre: "Natalia Bustos", contacto: "5492612128450" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  cargarSectores();
  cargarPreinvitados();

  const escaneoRaw = document.getElementById('escaneoRaw');
  if (escaneoRaw) {
    escaneoRaw.addEventListener('change', (e) => procesarLectura(e.target.value));
  }

  const selectAnfitrion = document.getElementById('anfitrion');
  const inputManual = document.getElementById('anfitrionManual');
  if (selectAnfitrion) {
    selectAnfitrion.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === "MANUAL" || val === "NUEVO_MANUAL") {
        if (inputManual) {
          inputManual.style.display = "block";
          inputManual.placeholder = "Escriba Apellido y Nombre...";
          inputManual.focus();
        }
        contactoAnfitrionActual = "N/A";
      } else {
        if (inputManual) {
          inputManual.style.display = "none";
          inputManual.value = "";
        }
        const selectedOption = e.target.options[e.target.selectedIndex];
        contactoAnfitrionActual = selectedOption ? (selectedOption.dataset.contacto || "N/A") : "";
        
        // Autocompletar datos personales cuando se selecciona en Modo Preinvitados
        const modoSelect = document.getElementById('modoApp');
        if (modoSelect && modoSelect.value === 'preinvitados' && val) {
          const datosInput = document.getElementById('datosPersonales');
          if (datosInput) datosInput.value = val;
        }
      }
    });
  }

  const selectModo = document.getElementById('modoApp');
  if (selectModo) {
    selectModo.addEventListener('change', (e) => cambiarModoApp(e.target.value));
    cambiarModoApp(selectModo.value);
  }
});

async function cargarPreinvitados() {
  try {
    const res = await fetch(`${URL_API_GOOGLE}?tipo=preinvitados`);
    listaPreinvitados = await res.json();
    
    // Si la app está en modo preinvitados al momento de cargar, refresca el desplegable
    const modoSelect = document.getElementById('modoApp');
    if (modoSelect && modoSelect.value === 'preinvitados') {
      poblarDesplegablePreinvitados();
    }
  } catch (err) {
    console.error("Error al cargar lista de preinvitados", err);
  }
}

function poblarDesplegablePreinvitados() {
  const selectAnfitrion = document.getElementById('anfitrion');
  if (!selectAnfitrion) return;

  selectAnfitrion.innerHTML = '<option value="">Filtrar o seleccionar Apellido y Nombre...</option>';
  if (Array.isArray(listaPreinvitados)) {
    listaPreinvitados.slice().sort().forEach(nombre => {
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      option.dataset.contacto = "N/A";
      selectAnfitrion.appendChild(option);
    });
  }
  const optionNuevo = document.createElement('option');
  optionNuevo.value = "NUEVO_MANUAL";
  optionNuevo.textContent = "✏️ + Agregar Preinvitado no listado...";
  selectAnfitrion.appendChild(optionNuevo);
}

function cargarSectores() {
  const selectSector = document.getElementById('sector');
  if (!selectSector) return;
  selectSector.innerHTML = '<option value="">Seleccione un sector...</option>';
  Object.keys(maestroSectores).forEach(sec => {
    const option = document.createElement('option');
    option.value = sec;
    option.textContent = sec;
    selectSector.appendChild(option);
  });
}

function cargarTodosLosAnfitriones() {
  const selectAnfitrion = document.getElementById('anfitrion');
  if (!selectAnfitrion) return;
  selectAnfitrion.innerHTML = '<option value="">Seleccione propietario/destinatario...</option>';
  let mapaPersonal = new Map();
  Object.keys(maestroSectores).forEach(sec => {
    maestroSectores[sec].forEach(p => {
      if (p.nombre !== "Atención Mostrador" && p.nombre !== "EVENTO" && !mapaPersonal.has(p.nombre)) {
        mapaPersonal.set(p.nombre, p.contacto);
      }
    });
  });
  const personalOrdenado = Array.from(mapaPersonal.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  personalOrdenado.forEach(([nombre, contacto]) => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    option.dataset.contacto = contacto;
    selectAnfitrion.appendChild(option);
  });
  const optionManual = document.createElement('option');
  optionManual.value = "MANUAL";
  optionManual.textContent = "✏️ Otro / Escribir manualmente...";
  selectAnfitrion.appendChild(optionManual);
}

function actualizarAnfitriones() {
  const sector = document.getElementById('sector').value;
  const selectAnfitrion = document.getElementById('anfitrion');
  if (!selectAnfitrion) return;
  selectAnfitrion.innerHTML = '<option value="">Seleccione anfitrión...</option>';
  if (sector && maestroSectores[sector]) {
    maestroSectores[sector].forEach(p => {
      const option = document.createElement('option');
      option.value = p.nombre;
      option.textContent = p.nombre;
      option.dataset.contacto = p.contacto;
      selectAnfitrion.appendChild(option);
    });
  }
}

function cambiarModoApp(modo) {
  const root = document.documentElement;
  const body = document.body;
  const container = document.querySelector('.app-container');
  const groupSector = document.getElementById('groupSector');
  const groupBultos = document.getElementById('groupBultos');
  const groupDatosPersonales = document.getElementById('groupDatosPersonales');
  const panelEvento = document.getElementById('panelEventoConfig');
  const lblAnfitrion = document.getElementById('lblAnfitrion');
  const inputEmpresa = document.getElementById('empresa');
  const selectSector = document.getElementById('sector');
  const selectAnfitrion = document.getElementById('anfitrion');
  const inputManual = document.getElementById('anfitrionManual');
  const btnWA = document.getElementById('btnWhatsApp');

  const clasesAnteriores = ['modo-normal', 'modo-mercadolibre', 'modo-evento', 'modo-preinvitados'];
  root.classList.remove(...clasesAnteriores);
  body.classList.remove(...clasesAnteriores);
  if (container) container.classList.remove(...clasesAnteriores);

  const nuevaClase = 'modo-' + modo;
  root.classList.add(nuevaClase);
  body.classList.add(nuevaClase);
  if (container) container.classList.add(nuevaClase);

  if (inputManual) inputManual.style.display = 'none';

  if (modo === 'preinvitados') {
    if (groupSector) groupSector.style.display = 'none';
    if (groupBultos) groupBultos.style.display = 'none';
    if (groupDatosPersonales) groupDatosPersonales.style.display = 'none';
    if (panelEvento) panelEvento.style.display = 'none';

    if (lblAnfitrion) lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-check"></i> Buscar o Seleccionar Preinvitado';
    if (inputEmpresa) inputEmpresa.value = 'Preinvitado';

    poblarDesplegablePreinvitados();
    if (btnWA) btnWA.style.display = 'none';

  } else {
    if (groupDatosPersonales) groupDatosPersonales.style.display = 'block';

    if (modo === 'mercadolibre') {
      if (groupSector) groupSector.style.display = 'none';
      if (groupBultos) groupBultos.style.display = 'block';
      if (panelEvento) panelEvento.style.display = 'none';
      if (lblAnfitrion) lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-check"></i> Propietario / Destinatario';
      if (inputEmpresa) inputEmpresa.value = 'Mercado Libre';
      if (selectSector) selectSector.value = 'Guardia';
      cargarTodosLosAnfitriones();
      if (btnWA) btnWA.style.display = 'inline-block';
    } else if (modo === 'evento') {
      if (groupSector) groupSector.style.display = 'block';
      if (groupBultos) groupBultos.style.display = 'none';
      if (panelEvento) panelEvento.style.display = 'block';
      if (lblAnfitrion) lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-tie"></i> Anfitrión';
      if (inputEmpresa) inputEmpresa.value = 'Visita';
      if (selectSector) {
        selectSector.value = 'EVENTO';
        actualizarAnfitriones();
      }
      if (selectAnfitrion) selectAnfitrion.value = 'EVENTO';
      if (btnWA) btnWA.style.display = 'none';
    } else {
      // Modo Normal
      if (groupSector) groupSector.style.display = 'block';
      if (groupBultos) groupBultos.style.display = 'none';
      if (panelEvento) panelEvento.style.display = 'none';
      if (lblAnfitrion) lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-tie"></i> Anfitrión / Quien Recibe';
      if (inputEmpresa) inputEmpresa.value = '';
      if (selectSector) {
        selectSector.value = '';
        actualizarAnfitriones();
      }
      if (btnWA) btnWA.style.display = 'inline-block';
    }
  }
}

function guardarNombreEvento() {
  const nombre = document.getElementById('nombreEvento').value;
  if (nombre) {
    localStorage.setItem('nombreEventoFijo', nombre);
    document.getElementById('observaciones').value = nombre;
    alert('Nombre del evento fijado correctamente.');
  } else {
    alert('Ingrese un nombre para el evento.');
  }
}

function borrarNombreEvento() {
  localStorage.removeItem('nombreEventoFijo');
  document.getElementById('nombreEvento').value = '';
  if (document.getElementById('modoApp').value === 'evento') {
    document.getElementById('observaciones').value = '';
  }
}

function procesarLectura(cadena) {
  if (!cadena) return;
  let partes = cadena.split('"');
  let datos = "";
  if (partes.length >= 5) {
    datos = `${partes[1] || ""} ${partes[2] || ""} - DNI: ${partes[4] || ""}`.trim();
  } else {
    partes = cadena.split('@');
    if (partes.length >= 5) {
      datos = `${partes[1] || ""} ${partes[2] || ""} - DNI: ${partes[4] || ""}`.trim();
    } else {
      datos = cadena;
    }
  }
  document.getElementById('datosPersonales').value = datos;
  document.getElementById('scannerStatus').textContent = 'Lectura realizada';
}

function iniciarEscaneo() {
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      procesarLectura(decodedText);
      html5QrCode.stop();
    },
    () => {}
  ).catch(err => console.error(err));
}

function enviarWhatsApp() {
  const modo = document.getElementById('modoApp').value;
  const datos = document.getElementById('datosPersonales').value;
  const empresa = document.getElementById('empresa').value;
  const sector = document.getElementById('sector').value;
  const anfitrion = obtenerNombreAnfitrion();
  const bultos = document.getElementById('cantidadBultos') ? document.getElementById('cantidadBultos').value : '1';

  if (!contactoAnfitrionActual || contactoAnfitrionActual === "N/A") {
    alert("El destinatario/anfitrión no posee número registrado.");
    return;
  }

  let mensaje = "";
  if (modo === 'mercadolibre') {
    mensaje = `📦 *¡Hola ${anfitrion}!* Llegó tu pedido, entregado por *${empresa}* (${bultos} bulto/s), que aguarda el retiro en *Puesto 1 de Seguridad*. 🛡️📍`;
  } else {
    mensaje = `👋 *Aviso de Visita - COFARMEN*\n\nHola *${anfitrion}*, se registró el ingreso de:\n👤 *Persona:* ${datos}\n🏢 *Empresa:* ${empresa}\n📍 *Sector:* ${sector}`;
  }
  window.open(`https://api.whatsapp.com/send?phone=${contactoAnfitrionActual}&text=${encodeURIComponent(mensaje)}`, '_blank');
}

function obtenerNombreAnfitrion() {
  const selectAnfitrion = document.getElementById('anfitrion');
  const inputManual = document.getElementById('anfitrionManual');
  if (!selectAnfitrion) return "";
  if (selectAnfitrion.value === "MANUAL" || selectAnfitrion.value === "NUEVO_MANUAL") {
    return inputManual ? inputManual.value.trim() : "";
  }
  return selectAnfitrion.value;
}

function registrarIngreso() {
  const modoSelect = document.getElementById('modoApp');
  const modo = modoSelect ? modoSelect.value : 'normal';
  
  let datos = document.getElementById('datosPersonales') ? document.getElementById('datosPersonales').value : '';
  const empresa = document.getElementById('empresa') ? document.getElementById('empresa').value : '';
  const sector = (modo === 'mercadolibre' || modo === 'preinvitados') ? 'Guardia' : (document.getElementById('sector') ? document.getElementById('sector').value : '');
  const anfitrion = obtenerNombreAnfitrion();
  const cantidadBultos = document.getElementById('cantidadBultos') ? document.getElementById('cantidadBultos').value : '';
  const observaciones = document.getElementById('observaciones') ? document.getElementById('observaciones').value : '';

  if (modo === 'preinvitados') {
    datos = anfitrion;
    const datosInput = document.getElementById('datosPersonales');
    if (datosInput) datosInput.value = datos;
  }

  if (!datos || !anfitrion) {
    alert('Por favor seleccione o ingrese Apellido y Nombre.');
    return;
  }

  const payload = {
    datosPersonales: datos,
    empresa: empresa,
    sector: sector,
    anfitrion: anfitrion,
    observaciones: observaciones,
    modo: modo,
    bultos: modo === 'mercadolibre' ? cantidadBultos : ''
  };

  fetch(URL_API_GOOGLE, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert('Ingreso registrado con éxito.');
    limpiarFormulario();
    if (modo === 'preinvitados') {
      cargarPreinvitados();
    }
  })
  .catch(error => alert('Error al guardar datos.'));
}

function limpiarFormulario() {
  const escaneoRaw = document.getElementById('escaneoRaw');
  if (escaneoRaw) escaneoRaw.value = '';

  const datosPersonales = document.getElementById('datosPersonales');
  if (datosPersonales) datosPersonales.value = '';

  const scannerStatus = document.getElementById('scannerStatus');
  if (scannerStatus) scannerStatus.textContent = 'Lector Listo';

  const modoSelect = document.getElementById('modoApp');
  const modo = modoSelect ? modoSelect.value : 'normal';

  if (modo !== 'mercadolibre' && modo !== 'preinvitados') {
    const empresa = document.getElementById('empresa');
    if (empresa) empresa.value = '';
  }

  if (modo !== 'evento') {
    const sector = document.getElementById('sector');
    if (sector) sector.value = '';
    const anfitrion = document.getElementById('anfitrion');
    if (anfitrion) anfitrion.value = '';
    const observaciones = document.getElementById('observaciones');
    if (observaciones) observaciones.value = '';
  } else {
    const observaciones = document.getElementById('observaciones');
    if (observaciones) observaciones.value = localStorage.getItem('nombreEventoFijo') || '';
  }

  const inputManual = document.getElementById('anfitrionManual');
  if (inputManual) {
    inputManual.value = '';
    inputManual.style.display = 'none';
  }

  const cantidadBultos = document.getElementById('cantidadBultos');
  if (cantidadBultos) cantidadBultos.value = '1';

  if (escaneoRaw) escaneoRaw.focus();
}
