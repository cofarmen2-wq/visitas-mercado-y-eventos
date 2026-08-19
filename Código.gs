function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Relevamiento TIPO')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var fecha = new Date();
    var fechaFormatted = Utilities.formatDate(fecha, "GMT-3", "dd/MM/yyyy HH:mm:ss");
    
    // Mapeo de Columnas A -> H:
    // A: Fecha/Hora | B: Modo | C: Datos Personales | D: Empresa
    // E: Sector | F: Anfitrión / Propietario | G: Observaciones | H: Bultos / Cantidad
    sheet.appendRow([
      fechaFormatted,
      data.modo || 'normal',
      data.datosPersonales || '',
      data.empresa || '',
      data.sector || '',
      data.anfitrion || '',
      data.observaciones || '',
      data.bultos || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function obtenerDatos() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName("MAESTRO-");
    if (!hoja) return { "ERROR": "No se encontró la pestaña MAESTRO-" };

    var datos = hoja.getDataRange().getValues();
    var encabezados = datos[0];
    var resultado = { ordenSectores: [], datosSectores: {} };

    for (var col = 0; col < encabezados.length; col++) {
      var tipo = encabezados[col] ? encabezados[col].toString().trim() : "";
      if (tipo !== "") {
        resultado.ordenSectores.push(tipo);
        resultado.datosSectores[tipo] = [];
        for (var fila = 1; fila < datos.length; fila++) {
          var celda = datos[fila][col] ? datos[fila][col].toString().trim() : "";
          if (celda !== "") {
            resultado.datosSectores[tipo].push(celda);
          }
        }
      }
    }
    return resultado;
  } catch (e) {
    return { "ERROR": e.message };
  }
}

function guardarTodo(datosFinales, nombreGuardia) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName("REGISTRO") || ss.insertSheet("REGISTRO");
  var filasParaExcel = [];
  var fecha = new Date();
  var filasHtml = ""; 

  datosFinales.forEach(function(item) {
    var enL = item.enEnciende || "SI";
    var grab = item.apto || "SI";
    var obs = item.obs || "";

    filasParaExcel.push([nombreGuardia, fecha, item.tipo, item.equipo, enL, grab, obs]);

    if (enE === "NO" || apto === "NO" || obs.trim() !== "") {
      filasHtml += '<tr style="border-bottom: 1px solid #ddd;">' +
                   '<td style="padding: 10px; border: 1px solid #ddd;"><b>' + item.tipo + '</b></td>' +
                   '<td style="padding: 10px; border: 1px solid #ddd;">' + item.equipo + '</td>' +
                   '<td style="padding: 10px; border: 1px solid #ddd; text-align:center; color: ' + (enL === "NO" ? "red" : "green") + ';"><b>' + enL + '</b></td>' +
                   '<td style="padding: 10px; border: 1px solid #ddd; text-align:center; color: ' + (grab === "NO" ? "red" : "green") + ';"><b>' + grab + '</b></td>' +
                   '<td style="padding: 10px; border: 1px solid #ddd; font-style: italic;">' + (obs || "-") + '</td>' +
                   '</tr>';
    }
  });
  
  if (filasParaExcel.length > 0) {
    hoja.getRange(hoja.getLastRow() + 1, 1, filasParaExcel.length, 7).setValues(filasParaExcel);
    
    if (filasHtml !== "") {
      var destinatario = "PORTERIACOOPERATIVA2017@GMAIL.COM"; 
      var asunto = "⚠️ NOVEDADES RELEVAMIENTO - " + nombreGuardia;
      var cuerpoHtml = '<div style="font-family:Arial;max-width:800px;border:1px solid #334155;">' +
                       '<div style="background-color:#334155;color:white;padding:20px;text-align:center;">' +
                       '<h2 style="margin:0;"> INFORME DE NOVEDADES</h2><p>Responsable: ' + nombreGuardia + '</p></div>' +
                       '<div style="padding:20px;"><table style="width:100%;border-collapse:collapse;">' +
                       '<thead><tr style="background-color:#eee;"><th>Sector</th><th>Cámara</th><th>Línea</th><th>Graba</th><th>Obs</th></tr></thead>' +
                       '<tbody>' + filasHtml + '</tbody></table></div></div>';
      MailApp.sendEmail({ to: destinatario, subject: asunto, htmlBody: cuerpoHtml });
    }
  }
  return "OK";
}
