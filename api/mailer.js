const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/*
console.log(process.env.DEV_EMAIL_HOST);
console.log(process.env.DEV_EMAIL_PORT);
console.log(process.env.DEV_EMAIL_USER);
console.log(process.env.DEV_EMAIL_PASSWORD);
*/

const nodemailer = require('nodemailer');
const fs = require('fs');

function sendConfirmation(mail, userId) {
  let transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email', //process.env.DEV_EMAIL_HOST,
    port: 587, //process.env.DEV_EMAIL_PORT, //	25 or 465 or 587 or 2525
    auth: {
      user: 'berneice.crist1@ethereal.email', //process.env.DEV_EMAIL_USER,
      pass: 'EbcgFftJ2cHy8by8Ab' //process.env.DEV_EMAIL_PASSWORD
    }
  });

  const html = fs.readFileSync(__dirname + '/html-mails/confirm-mail-1.html').toString() +
               '<a href="https://www.comgecey.org/user/' + userId + '">Confirmar</a>' +
               fs.readFileSync(__dirname + '/html-mails/confirm-mail-2.html').toString();
  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: mail,
    subject: 'Confirmar correo',
    text: 'Confirmar correo',
    html: html
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

function sendPaymentNotification(name) {
  let transport = nodemailer.createTransport({
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT, 
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASSWORD
    }
  });

  const text = 'El usuario ' + name + " acaba de subir/actualizar su comprobante de pago."
  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: 'contacto@comgecey.org',
    subject: 'Comprobante de pago recibido',
    text: text
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

function sendConvConfirmation(mail, conv_name) {
  let transport = nodemailer.createTransport({
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASSWORD
    }
  });

  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: mail,
    subject: `Inscripción en proceso - Convocatoria ${conv_name}`,
    text: '',
    html: fs.readFileSync(__dirname + '/html-mails/suscInProcess.html').toString(),
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

function sendNewSuscriberToAdmin(mail, conv_name) {
  let transport = nodemailer.createTransport({
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASSWORD
    }
  });

  const html = '<div><h1>Nuevo Postulante<h1>' +
               `<h2>Convocatoria ${conv_name}<h2>` +
               '<p>Ingresa a la plataforma Comgecey para revisar la información ' +
               'del nuevo postulante para la certificación.</p>' +
               '<a href="https://app.comgecey.org/signin">Ir a la plataforma</a>' +
               '</div>';
  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: mail,
    subject: 'Nuevo Postulante',
    text: '',
    html: html
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

function sendWelcomeSuscriber(mail, conv_name) {
  let transport = nodemailer.createTransport({
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASSWORD
    }
  });

  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: mail,
    subject: `Aviso de aceptación - Convocatoria ${conv_name}`,
    text: '',
    html: fs.readFileSync(__dirname + '/html-mails/docsConfirmed.html').toString(),
    attachments: [
      {
        filename: 'programa-de-estudio.pdf',
        path: './api/mailAttachments/programa-de-estudio.pdf'
      }
    ]
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

function sendPwd(mail, pwd) {
  let transport = nodemailer.createTransport({
    host: process.env.DEV_EMAIL_HOST,
    port: process.env.DEV_EMAIL_PORT,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASSWORD
    }
  });

  const html = fs.readFileSync(__dirname + '/html-mails/pwd-recovery-1.html').toString() +
               '<h1>' + pwd + '</h1>' +
               fs.readFileSync(__dirname + '/html-mails/pwd-recovery-2.html').toString();
  const message = {
    from: 'Comgecey <no-responder@comgecey.org>',
    to: mail,
    subject: 'Recuperación de Contraseña',
    text: 'Recuperación de Contraseña',
    html: html
  }

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

module.exports = {
  sendConfirmation,
  sendPaymentNotification,
  sendConvConfirmation,
  sendNewSuscriberToAdmin,
  sendWelcomeSuscriber,
  sendPwd
};
