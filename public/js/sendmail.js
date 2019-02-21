var fs = require('fs');
var nodemailer = require("nodemailer");
var ejs = require("ejs");

// Servicio utilizado por nodemailer
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'observaciudadania17@gmail.com',
        pass: 'proyectaobserva'
    }
});

var mail = {};

// Funcion para enviar mails
mail.send_mail = function(data, res){
    console.log(__dirname.split("public")[0] + data.view);
	ejs.renderFile(__dirname.split("public")[0] + data.view , { data: data.data }, function (err, html) {
        if(err) { console.log(err);
        } else {
            var mainOptions = {
                from: 'no-reply@example.com',
                to: data.mails,
                subject: data.subject,
                html: html
            };
            transporter.sendMail(mainOptions, function (errs, info) {
                if(errs) { console.log(errs);
                } else {
                    console.log('Mensaje enviado a: ' + data.mails);
                }
            });
        }
    });
};

//exportamos el objeto
module.exports = mail;