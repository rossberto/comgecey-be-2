const PDFDocument = require('pdfkit');
const fs = require('fs');
//const cncmg_quality = require('cncmg_quality.png');

function inputFormat(fontSize, string) {
  const values = string.split('  ');

  //const maxLength = values.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
  const totalLength = values.reduce((a,b) =>  a + b).length;
  const totalFreeSpace = 95 * 12 / fontSize -totalLength;

  values.forEach((value, index) => {
    values[index] = ' '.repeat(totalFreeSpace/(2 * values.length + 2)) + value + ' '.repeat(totalFreeSpace/(2 * values.length + 2));
  });

  let output = '';
  values.forEach((value, index) => {
    output += value;
    if (index < (values.length - 1)) {
      output += ' ';
    }
  });

  return output;
}

function dateFormat(date) {
  let stringDate = date.getFullYear().toString();

  if (date.getMonth() < 9) {
    stringDate += '-0' + (date.getMonth() + 1).toString()
  } else {
    stringDate += '-' + (date.getMonth() + 1).toString()
  }

  if (date.getDate() < 9) {
    stringDate += '-0' + (date.getDate()).toString()
  } else {
    stringDate += '-' + (date.getDate()).toString()
  }


  return  stringDate;
}

function generateForm(userData) {
  // Create a document
  const doc = new PDFDocument;

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(fs.createWriteStream('documentos/solicitudes/solicitud-' + userData.id + '.pdf'));

  /***********************************/
  /************** HEADER *************/
  /***********************************/
  doc.image('api/inscriptionPdf/cncmg_quality.png', 70, 25, {width: 150});

  doc.fontSize(18);
  doc.text('SOLICITUD DE CERTIFICACIÓN EN MEDICINA GENERAL', 245, 60, {
    align: 'center'
  });

  /***********************************/
  /***** FICHA DE IDENTIFICACIÓN *****/
  /***********************************/
  //lineOffset = 0;
  const lineStart = 70; //+ lineOffset;
  const lineEnd = 620 - lineStart;

  const firstSectionY = 130;
  const spaceBetweenSections = 92;
  const spaceBetweenRows = 32;
  const spaceBetweenTextLine = 2;

  doc.fontSize(16);
  doc.text('Ficha de Identificación', 70, firstSectionY);

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text( inputFormat(12, userData.father_lname + '  ' + userData.mother_lname + '  ' + userData.name),
            70, firstSectionY + 20, {
              align: 'center'
            });

  doc.moveTo(lineStart, firstSectionY + spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Apellido Paterno' + '  ' + 'Apellido Materno' + '  ' + 'Nombre'),
            70, firstSectionY + spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.font('Helvetica-Bold').fontSize(12);
  doc.text(inputFormat( 12, dateFormat(userData.birthdate) + '  ' + userData.birth_city + ', ' + userData.birth_state + '  ' + userData.phone),
                        70, firstSectionY + spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });

  doc.moveTo(lineStart, firstSectionY + 2*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 2*spaceBetweenRows)      // draw a line
     .stroke();
  doc.font('Helvetica').fontSize(10);
  doc.text( inputFormat(10, 'Fecha de Nacimiento' + '  ' + 'Lugar de Nacimiento' + '  ' + 'Teléfono'),
            70, firstSectionY + 2*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  /***********************************/
  /*****   DOMICILIO PARTICULAR  *****/
  /***********************************/
  doc.fontSize(16);
  doc.text('Domicilio Particular', 70, firstSectionY + spaceBetweenSections);

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, userData.street + '  ' + userData.number + '  ' + userData.town),
                        70, firstSectionY + spaceBetweenSections + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + spaceBetweenSections + spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + spaceBetweenSections + spaceBetweenRows)      // draw a line
     .stroke();
  doc.font('Helvetica').fontSize(10);
  doc.text( inputFormat(10, 'Calle' + '  ' + 'Número' + '  ' + 'Colonia'),
            70, firstSectionY + spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, userData.city + '  ' + userData.state + '  ' + userData.zip_code),
                        70, firstSectionY + spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + spaceBetweenSections + 2*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + spaceBetweenSections + 2*spaceBetweenRows)      // draw a line
     .stroke();
  doc.font('Helvetica').fontSize(10);
  doc.text( inputFormat(10, 'Ciudad' + '  ' + 'Estado' + '  ' + 'CP'),
            70, firstSectionY + spaceBetweenSections + 2*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  //
  /***********************************/
  /*****   DOMICILIO PARTICULAR  *****/
  /***********************************/
  doc.fontSize(16);
  doc.text('Domicilio de Correspondencia', 70, firstSectionY + 2*spaceBetweenSections);

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, userData.mail_street + '  ' + userData.mail_number + '  ' + userData.mail_town),
                        70, firstSectionY + 2*spaceBetweenSections + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 2*spaceBetweenSections + spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 2*spaceBetweenSections + spaceBetweenRows)      // draw a line
     .stroke();
  doc.font('Helvetica').fontSize(10);
  doc.text( inputFormat(10, 'Calle' + '  ' + 'Número' + '  ' + 'Colonia'),
            70, firstSectionY + 2*spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, userData.mail_city + '  ' + userData.mail_state + '  ' + userData.mail_zip_code + '  ' + userData.email),
                        70, firstSectionY + 2*spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 2*spaceBetweenSections + 2*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 2*spaceBetweenSections + 2*spaceBetweenRows)      // draw a line
     .stroke();
  doc.font('Helvetica').fontSize(10);
  doc.text( inputFormat(10, 'Ciudad' + '  ' + 'Estado' + '  ' + 'Código Postal' + '  ' + 'Email'),
            70, firstSectionY + 2*spaceBetweenSections + 2*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  /***********************************/
  /***** INFORMACIÓN PROFESIONAL *****/
  /***********************************/
  doc.fontSize(16);
  doc.text('Información Profesional', 70, firstSectionY + 3*spaceBetweenSections);

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text( userData.school,
            70, firstSectionY + 3*spaceBetweenSections + 20, {
              align: 'center'
            });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( 'Escuela o facultad donde estudió la licenciatura y universidad a la que pertenece',
            70, firstSectionY + 3*spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, dateFormat(userData.start_date_school)+ '  ' + dateFormat(userData.finish_date_school)),
                        70, firstSectionY + 3*spaceBetweenSections + spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 2*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 2*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Fecha de inicio' + '  ' + 'Fecha de terminación'),
            70, firstSectionY + 3*spaceBetweenSections + 2*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text( userData.internship,
            70, firstSectionY + 3*spaceBetweenSections + 2*spaceBetweenRows + spaceBetweenTextLine + 20, {
              align: 'center'
            });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 3*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 3*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( 'Sitio donde realizó el internado (localidad y nombre del hospital e institución a la que pertenece)',
            70, firstSectionY + 3*spaceBetweenSections + 3*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, dateFormat(userData.start_date_internship)+ '  ' + dateFormat(userData.finish_date_internship)),
                        70, firstSectionY + 3*spaceBetweenSections + 3*spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 4*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 4*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Fecha de inicio' + '  ' + 'Fecha de terminación'),
            70, firstSectionY + 3*spaceBetweenSections + 4*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text( userData.social_service,
            70, firstSectionY + 3*spaceBetweenSections + 4*spaceBetweenRows + spaceBetweenTextLine + 20, {
              align: 'center'
            });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 5*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 5*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( 'Sitio en donde realizó el servicio social (coloque el nombre de la localidad e institución)',
            70, firstSectionY + 3*spaceBetweenSections + 5*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, dateFormat(userData.start_date_social)+ '  ' + dateFormat(userData.finish_date_social)),
                        70, firstSectionY + 3*spaceBetweenSections + 5*spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 6*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 6*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Fecha de inicio' + '  ' + 'Fecha de terminación'),
            70, firstSectionY + 3*spaceBetweenSections + 6*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, dateFormat(userData.exam_date)+ '  ' + userData.exam_type),
                        70, firstSectionY + 3*spaceBetweenSections + 6*spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 7*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 7*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Fecha en que presentó su examen profesional' + '  ' + 'Tipo de examen (oral y/o escrito)'),
                        70, firstSectionY + 3*spaceBetweenSections + 7*spaceBetweenRows + spaceBetweenTextLine, {
                          align: 'center'
                        });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text( userData.thesis,
            70, firstSectionY + 3*spaceBetweenSections + 7*spaceBetweenRows + spaceBetweenTextLine + 20, {
              align: 'center'
            });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 8*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 8*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( 'Tesis recepcional (anote el nombre si realizó tesis)',
            70, firstSectionY + 3*spaceBetweenSections + 8*spaceBetweenRows + spaceBetweenTextLine, {
              align: 'center'
            });

  doc.fontSize(12);
  doc.font('Helvetica-Bold').text(inputFormat( 12, userData.professional_id + '  ' + dateFormat(userData.professional_id_date)+ '  ' + userData.book + '  ' + userData.ssa),
                        70, firstSectionY + 3*spaceBetweenSections + 8*spaceBetweenRows + spaceBetweenTextLine + 20, {
                          align: 'center'
                        });
  doc.moveTo(lineStart, firstSectionY + 3*spaceBetweenSections + 9*spaceBetweenRows)    // set the current point
     .lineTo(lineEnd, firstSectionY + 3*spaceBetweenSections + 9*spaceBetweenRows)      // draw a line
     .stroke();
  doc.fontSize(10);
  doc.font('Helvetica').text( inputFormat(10, 'Número de cédula profesional' + '  ' + 'Fecha de expedición' + '  ' + 'Libro y fojas num.' + '  ' + 'Registro en la SSA'),
                        70, firstSectionY + 3*spaceBetweenSections + 9*spaceBetweenRows + spaceBetweenTextLine, {
                          align: 'center'
                        });

  doc.addPage();

  /***********************************/
  /************** HEADER *************/
  /***********************************/
  doc.image('api/inscriptionPdf/cncmg_quality.png', 70, 25, {width: 150});

  doc.fontSize(18);
  doc.text('SOLICITUD DE CERTIFICACIÓN EN MEDICINA GENERAL', 245, 60, {
    align: 'center'
  });

  doc.fontSize(10);
  const date = new Date();

  const year = date.getFullYear().toString();

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
           'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const month = months[date.getMonth()];

  const day = date.getDate().toString();

  doc.text(day + ' de ' + month + ' del ' + year, 70, 150, {
    align: 'right'
  });

  doc.moveDown();

  doc.fontSize(14);
  doc.text('H. COMITÉ DE CERTIFICACIÓN DEL CONSEJO NACIONAL DE CERTIFICACIÓN EN MEDICINA GENERAL, A.C.', 70, 200, {
    align: 'justify'
  });
  doc.text('Presente.')

  doc.moveDown();

  const nombreCompleto = userData.name + ' ' + userData.father_lname + ' ' + userData.mother_lname;

  const H_1 = `El (La) que suscribe, ${nombreCompleto}, indica:\nRequiero muy atentamente ` +
               'se acepte mi solicitud para someterme al proceso de Certificación en ' +
               'Medicina General que realiza el Consejo, conforme a la Convocatoria ' +
               'expedida para tal efecto.';

  const H_2 = 'Expreso que esta solicitud es voluntaria, por lo que anexo a mi solicitud ' +
              'la documentación comprobatoria acerca de los estudios realizados y de mi ' +
              'actividad profesional, los cuales son copias fotostáticas de los originales ' +
              'que obran en mi poder, y acepto sean investigados y calificados por los ' +
              'Comités correspondientes.';

  const H_3 = 'Asimismo, de resultar certificado, me comprometo a respetar los lineamientos ' +
              'del Consejo y a cumplir con el requisito de Renovación de la Vigencia del ' +
              'Certificado cada 5 años, como la mejor manera de garantizar a la sociedad ' +
              'mi competencia académica y profesional.';

  const H_4 = 'Acepto cubrir la cuota que solicita el Consejo y que la misma no se me ' +
              'reintegrará en caso de no resultar certificado.';

  doc.fontSize(12);

  doc.text(H_1, {
    align: 'justify'
  });
  doc.moveDown();
  doc.text(H_2, {
    align: 'justify'
  });
  doc.moveDown();
  doc.text(H_3, {
    align: 'justify'
  });
  doc.moveDown();
  doc.text(H_4, {
    align: 'justify'
  });


  doc.text('A T E N T A M E N T E', 70, 600, {
    align: 'center'
  });


  doc.text('______________________________', 70, 650, {
    align: 'center'
  });
  doc.font('Helvetica-Bold').text(nombreCompleto, 70, 670, {
    align: 'center'
  });


  // Finalize PDF file
  doc.end();
}

module.exports = generateForm;
