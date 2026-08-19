// =========================================================================
const html5QrCode = new Html5Qrcode("reader");

const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbxeRqX9w4SUUu2yGzNre3hVAr-RGTxXO8_rZCxUcOWe9G376fqhlIS43c45-SvanGni/exec';

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
    "Administracion": [
        { nombre: "Martin Marcelo", contacto: "5492615320950" },
        { nombre: "Bustos Marcos", contacto: "5492615320950" },
        { nombre: "Videla Javier", contacto: "5492615320950" },
        { nombre: "Agüero Antonio", contacto: "5492615320950" },
        { nombre: "Velez Daniel", contacto: "N/A" }
    ],
    "Gerencia": [
        { nombre: "Funes Cristian", contacto: "5492615320950" },
        { nombre: "Pablo Iacobucci", contacto: "5492614168508" },
        { nombre: "Ganem Victoria", contacto: "549261551344" },
        { nombre: "Martin Marcelo", contacto: "5492615320950" }
    ],
    "Consejo": [{ nombre: "Ganem Victoria", contacto: "5492615513444" }],
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
        { nombre: "Reina Julia", contacto: "5492615320950" },
        { nombre: "Sepulveda Marcela", contacto: "5492615320950" },
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
        { nombre: "Garay Diego", contacto: "5492615320950" },
        { nombre: "Fernandez Jose Luis", contacto: "5492615320950" },
        { nombre: "Dominguez Diego", contacto: "5492615320950" },
        { nombre: "Peroso Vanesa", contacto: "5492615320950" }
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

// Inicialización de selectores
document.addEventListener('DOMContentLoaded', () => {
    cargarSectores();
    
    // Evento para procesar el input directo del escáner
    document.getElementById('escaneoRaw').addEventListener('change', function(e) {
        procesarLectura(e.target.value);
    });
    
    // Cargar nombre del evento si estaba guardado
    const eventoPrevio = localStorage.getItem('nombreEventoFijo');
    if(eventoPrevio) {
        document.getElementById('nombreEvento').value = eventoPrevio;
    }
});

function cargarSectores() {
    const selectSector = document.getElementById('sector');
    selectSector.innerHTML = '<option value="">Seleccione un sector...</option>';
    
    Object.keys(maestroSectores).forEach(sec => {
        const option = document.createElement('option');
        option.value = sec;
        option.textContent = sec;
        selectSector.appendChild(option);
    });
}

function actualizarAnfitriones() {
    const sector = document.getElementById('sector').value;
    const selectAnfitrion = document.getElementById('anfitrion');
    selectAnfitrion.innerHTML = '<option value="">Seleccione anfitrión...</option>';

    if (sector && maestroSectores[sector]) {
        maestroSectores[sector].forEach(p => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = p.nombre;
            selectAnfitrion.appendChild(option);
        });
    }
}

// Control de Modos
function cambiarModoApp(modo) {
    const body = document.body;
    const groupBultos = document.getElementById('groupBultos');
    const panelEvento = document.getElementById('panelEventoConfig');
    const lblAnfitrion = document.getElementById('lblAnfitrion');
    const inputEmpresa = document.getElementById('empresa');
    const selectSector = document.getElementById('sector');
    const selectAnfitrion = document.getElementById('anfitrion');
    const inputObs = document.getElementById('observaciones');

    body.className = '';

    if (modo === 'mercadolibre') {
        body.classList.add('modo-mercadolibre');
        groupBultos.style.display = 'block';
        panelEvento.style.display = 'none';
        
        lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-check"></i> Propietario';
        inputEmpresa.value = 'Mercado libre';
        
    } else if (modo === 'evento') {
        body.classList.add('modo-evento');
        groupBultos.style.display = 'none';
        panelEvento.style.display = 'block';
        
        lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-tie"></i> Anfitrión';
        
        // Selección por defecto para eventos
        selectSector.value = 'EVENTO';
        actualizarAnfitriones();
        selectAnfitrion.value = 'EVENTO';
        
        const eventoGuardado = localStorage.getItem('nombreEventoFijo');
        if (eventoGuardado) {
            inputObs.value = eventoGuardado;
        }

    } else { // Normal
        body.classList.add('modo-normal');
        groupBultos.style.display = 'none';
        panelEvento.style.display = 'none';
        lblAnfitrion.innerHTML = '<i class="fa-solid fa-user-tie"></i> Anfitrión / Quien Recibe';
        inputEmpresa.value = '';
    }
}

// Gestión de Nombre de Evento
function guardarNombreEvento() {
    const nombre = document.getElementById('nombreEvento').value;
    if (nombre) {
        localStorage.setItem('nombreEventoFijo', nombre);
        document.getElementById('observaciones').value = nombre;
        alert('Nombre del evento guardado correctamente.');
    } else {
        alert('Ingrese un nombre de evento válido.');
    }
}

function borrarNombreEvento() {
    localStorage.removeItem('nombreEventoFijo');
    document.getElementById('nombreEvento').value = '';
    if (document.getElementById('modoApp').value === 'evento') {
        document.getElementById('observaciones').value = '';
    }
}

// Procesar lectura del PDF417 / DNI
function procesarLectura(cadena) {
    if (!cadena) return;
    
    let partes = cadena.split('"');
    let datos = "";
    
    if (partes.length >= 5) {
        let apellido = partes[1] || "";
        let nombre = partes[2] || "";
        let dni = partes[4] || "";
        datos = `${apellido} ${nombre} - DNI: ${dni}`.trim();
    } else {
        partes = cadena.split('@');
        if (partes.length >= 5) {
            let apellido = partes[1] || "";
            let nombre = partes[2] || "";
            let dni = partes[4] || "";
            datos = `${apellido} ${nombre} - DNI: ${dni}`.trim();
        } else {
            datos = cadena;
        }
    }
    
    document.getElementById('datosPersonales').value = datos;
    document.getElementById('scannerStatus').textContent = 'Lectura correcta';
}

// Cámara QR
function iniciarEscaneo() {
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
            procesarLectura(decodedText);
            html5QrCode.stop();
        },
        (errorMessage) => {}
    ).catch(err => console.error(err));
}

// Registrar Ingreso (Envío a Google Apps Script)
function registrarIngreso() {
    const modo = document.getElementById('modoApp').value;
    const datos = document.getElementById('datosPersonales').value;
    const empresa = document.getElementById('empresa').value;
    const sector = document.getElementById('sector').value;
    const anfitrion = document.getElementById('anfitrion').value;
    const cantidadBultos = document.getElementById('cantidadBultos').value;
    const observaciones = document.getElementById('observaciones').value;

    if (!datos || !sector || !anfitrion) {
        alert('Complete los campos requeridos (Escaneo, Sector y Anfitrión).');
        return;
    }

    const payload = {
        modo: modo,
        datosPersonales: datos,
        empresa: empresa,
        sector: sector,
        anfitrion: anfitrion,
        bultos: modo === 'mercadolibre' ? cantidadBultos : '',
        observaciones: observaciones
    };

    fetch(URL_API_GOOGLE, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('Ingreso registrado correctamente.');
        limpiarFormulario();
    })
    .catch(error => {
        console.error('Error al guardar:', error);
        alert('Error al intentar registrar el ingreso.');
    });
}

function limpiarFormulario() {
    document.getElementById('escaneoRaw').value = '';
    document.getElementById('datosPersonales').value = '';
    document.getElementById('scannerStatus').textContent = 'Lector Listo';
    
    const modo = document.getElementById('modoApp').value;
    if (modo !== 'mercadolibre') {
        document.getElementById('empresa').value = '';
    }
    if (modo !== 'evento') {
        document.getElementById('sector').value = '';
        document.getElementById('anfitrion').value = '';
        document.getElementById('observaciones').value = '';
    } else {
        const eventoGuardado = localStorage.getItem('nombreEventoFijo');
        document.getElementById('observaciones').value = eventoGuardado || '';
    }
    
    document.getElementById('cantidadBultos').value = '1';
    document.getElementById('escaneoRaw').focus();
}
