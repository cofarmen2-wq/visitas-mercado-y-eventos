// Servir la interfaz web
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Relevamiento de Equipos - Flujo Guiado')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Obtener estructura desde MAESTRO-
function getEstructuraEquipos() {
  var ss = SpreadsheetApp.openById('1zjdotDKs5wl1Uf1TRcalj4IunR-1tSLI_BY8dNkPlss');
  var sheetMaestro = ss.getSheetByName('MAESTRO-');
  
  if (!sheetMaestro) return [];
  
  var lastRow = sheetMaestro.getLastRow();
  var lastColumn = sheetMaestro.getLastColumn();
  
  if (lastRow < 1 || lastColumn < 1) return [];
  
  var datos = sheetMaestro.getRange(1, 1, lastRow, lastColumn).getValues();
  var estructura = [];
  
  for (var col = 0; col < lastColumn; col++) {
    var tipo = datos[0][col];
    
    if (tipo !== null && tipo.toString().trim() !== "") {
      var listaEquipos = [];
      for (var row = 1; row < lastRow; row++) {
        var nombreEquipo = datos[row][col];
        if (nombreEquipo !== null && nombreEquipo.toString().trim() !== "") {
          listaEquipos.push(nombreEquipo.toString().trim());
        }
      }
      if (listaEquipos.length > 0) {
        estructura.push({
          tipo: tipo.toString().trim(),
          equipos: listaEquipos
        });
      }
    }
  }
  
  return estructura;
}

// Guardar relevamiento completo y enviar correo con perfil ejecutivo/gerencial
function guardarRelevamientoCompleto(datosGuardar) {
  try {
    var ss = SpreadsheetApp.openById('1zjdotDKs5wl1Uf1TRcalj4IunR-1tSLI_BY8dNkPlss');
    var sheetRegistro = ss.getSheetByName('REGISTRO');
    
    if (!sheetRegistro) {
      throw new Error("No se encontró la pestaña 'REGISTRO'");
    }
    
    var fechaActual = new Date();
    var fechaFormateada = Utilities.formatDate(fechaActual, ss.getSpreadsheetTimeZone(), "dd/MM/yyyy HH:mm");
    
    var filasNuevas = [];
    var conteoPorTipo = datosGuardar.conteoPorTipo; // Objeto { Tipo: Cantidad }
    var listaObservados = datosGuardar.equiposObservados; // Lista con fallas u observaciones
    
    // 1. Registrar filas en la hoja REGISTRO
    datosGuardar.todosLosEquipos.forEach(function(item) {
      filasNuevas.push([
        fechaFormateada,
        item.tipo || "",
        item.equipo || "",
        item.enciende || "N/A",
        item.apto || "N/A",
        item.observaciones || ""
      ]);
    });
    
    if (filasNuevas.length > 0) {
      sheetRegistro.getRange(
        sheetRegistro.getLastRow() + 1, 
        1, 
        filasNuevas.length, 
        filasNuevas[0].length
      ).setValues(filasNuevas);
    }
    
    // 2. Construcción de filas HTML para resumen de equipos por tipo
    var totalEquipos = 0;
    var filasResumenHtml = "";
    for (var tipoKey in conteoPorTipo) {
      var cant = conteoPorTipo[tipoKey];
      totalEquipos += cant;
      filasResumenHtml += '<tr>' +
        '<td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155;"><strong>' + tipoKey + '</strong></td>' +
        '<td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b; text-align: center; font-weight: 600;">' + cant + '</td>' +
      '</tr>';
    }

    // 3. Construcción de filas HTML para novedades / observaciones
    var filasObservacionesHtml = "";
    if (listaObservados.length > 0) {
      listaObservados.forEach(function(obs) {
        var estadoBadge = "";
        if (obs.enciende === 'NO') {
          estadoBadge = '<span style="background-color: #fef2f2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">🚫 NO ENCIENDE</span>';
        } else if (obs.apto === 'NO') {
          estadoBadge = '<span style="background-color: #fff7ed; color: #c2410c; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">⚠️ NO APTO</span>';
        } else {
          estadoBadge = '<span style="background-color: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">📝 CON NOTA</span>';
        }

        filasObservacionesHtml += '<tr>' +
          '<td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #1e293b;"><strong>' + obs.equipo + '</strong><br><span style="font-size: 11px; color: #64748b;">' + obs.tipo + '</span></td>' +
          '<td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: center;">' + estadoBadge + '</td>' +
          '<td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #475569;">' + (obs.observaciones || "<em>Sin detalle de observación</em>") + '</td>' +
        '</tr>';
      });
    } else {
      filasObservacionesHtml = '<tr><td colspan="3" style="padding: 16px; text-align: center; color: #166534; background-color: #f0fdf4; font-size: 13px; font-weight: 600;">✅ Todos los equipos evaluados se encuentran operativos y aptos.</td></tr>';
    }

    // 4. Plantilla de Correo HTML Profesional
    var cuerpoHtml = 
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
      '</head>' +
      '<body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: \'Segoe UI\', Helvetica, Arial, sans-serif; color: #1e293b;">' +
        '<div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">' +
          
          '<!-- Encabezado -->' +
          '<div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 32px; color: #ffffff;">' +
            '<h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">📊 INFORME EJECUTIVO DE RELEVAMIENTO</h1>' +
            '<p style="margin: 6px 0 0 0; font-size: 13px; color: #93c5fd;">Estado operativo e inventario técnico de equipos</p>' +
          '</div>' +

          '<!-- Cuerpo Principal -->' +
          '<div style="padding: 28px 32px;">' +
            
            '<!-- Tarjeta Metadatos -->' +
            '<div style="background-color: #f1f5f9; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; display: table; width: 100%; box-sizing: border-box;">' +
              '<div style="display: table-cell; vertical-align: middle; font-size: 13px; color: #475569;">' +
                '📅 <strong>Fecha/Hora:</strong> ' + fechaFormateada + '<br>' +
                '📦 <strong>Total Evaluado:</strong> ' + totalEquipos + ' unidades' +
              '</div>' +
              '<div style="display: table-cell; vertical-align: middle; text-align: right; font-size: 13px; color: #475569;">' +
                '⚠️ <strong>Novedades:</strong> ' + listaObservados.length + ' caso(s)' +
              '</div>' +
            '</div>' +

            '<!-- Sección 1: Cantidad por Tipo -->' +
            '<h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">' +
              '📋 1. RESUMEN DE EQUIPOS POR TIPO' +
            '</h3>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">' +
              '<thead>' +
                '<tr style="background-color: #f8fafc;">' +
                  '<th style="text-align: left; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; font-size: 12px; color: #64748b; text-transform: uppercase;">Tipo de Equipo</th>' +
                  '<th style="text-align: center; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; font-size: 12px; color: #64748b; text-transform: uppercase; width: 100px;">Cantidad</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                filasResumenHtml +
              '</tbody>' +
            '</table>' +

            '<!-- Sección 2: Detalle de Observaciones -->' +
            '<h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">' +
              '🚨 2. DETALLE DE NOVEDADES Y OBSERVACIONES' +
            '</h3>' +
            '<table style="width: 100%; border-collapse: collapse;">' +
              '<thead>' +
                '<tr style="background-color: #f8fafc;">' +
                  '<th style="text-align: left; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; font-size: 12px; color: #64748b; text-transform: uppercase;">Equipo</th>' +
                  '<th style="text-align: center; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; font-size: 12px; color: #64748b; text-transform: uppercase; width: 130px;">Condición</th>' +
                  '<th style="text-align: left; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; font-size: 12px; color: #64748b; text-transform: uppercase;">Observación registrada</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                filasObservacionesHtml +
              '</tbody>' +
            '</table>' +

          '</div>' +

          '<!-- Pie de página -->' +
          '<div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; font-size: 12px; color: #94a3b8;">' +
            'Este reporte fue generado automáticamente desde el Sistema Control de Relevamiento.' +
          '</div>' +

        '</div>' +
      '</body>' +
      '</html>';

    var destinatario = "porteriacooperativa2017@gmail.com";
    var asunto = "📊 Reporte  de Relevamiento - " + fechaFormateada;
    
    MailApp.sendEmail({
      to: destinatario,
      subject: asunto,
      htmlBody: cuerpoHtml
    });
    
    return { exito: true, mensaje: "Relevamiento guardado e informe enviado correctamente." };
  } catch (error) {
    return { exito: false, mensaje: error.toString() };
  }
}