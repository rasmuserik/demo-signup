// # demo-signup
//
// This is just some quick and dirty code,
// for a simple service
// for signing up to access
// demo.biblioteksapp.dk
//
// This is very bad code, and the key-generation for the demo 
// and sign-up process is not secure at all.. 
// (it was quickly written while in the bus)
//
// I am curious who want to join the beta,
// and would also like to be able to contact
// people trying it out, 
// so please just get an email
// with your token via <http://biblioteksapp.dk>,
// rather than generating your own ;)

let mailgun = require('mailgun-js')({ 
  apiKey: process.env.MAILGUN_KEY, 
  domain: 'mg.solsort.com'
});
let mailcomposer = require('mailcomposer');

function mailDemoKey(addr) {
  let mail = mailcomposer({
    from: 'robot@solsort.com',
    to: addr,
    cc: 'rasmuserik@solsort.com',
    subject: 'BiblioteksApp.dk',
    text: `Hej,

tak for interessen,
den nuværende demo kan ses på:
http://demo.biblioteksapp.dk/
og har ikke adgangsbegrænsning.

Bemærk: det er en tidlig prototype,
og ting vil ændre sig meget.

Når næste udgave releases
som lukket beta,
får du også en mail
med adgang hertil.

Alt feedback er velkomment,
og kan sendes til
rasmuserik@solsort.com

Mange hilsner 
Rasmus Erik :)`,
    html: `Hej,<br>
<br>
tak for interessen,<br>
den nuværende demo kan ses på:<br>
<a href="http://demo.biblioteksapp.dk/">http://demo.biblioteksapp.dk/</a><br>
og har ikke adgangsbegrænsning.<br>
<br>
Bemærk: det er en tidlig prototype,<br>
og ting vil ændre sig meget.<br>
<br>
Når næste udgave releases<br>
som lukket beta,<br>
får du også en mail<br>
med adgang hertil.<br>
<br>
Alt feedback er velkomment,<br>
og kan sendes til<br>
rasmuserik@solsort.com<br>
<br>
Mange hilsner <br>
Rasmus Erik :)<br>
<br>
<img width=2 height=2 src="https://incoming.solsort.com/log.js?bogappmail{demokey}">`});

  mail.build(function(err, msg) {
    if (err) {
      throw err;
    }
    mailgun.messages().sendMime({
      to: [addr, 'rasmuserik@solsort.com'],
      message: msg.toString('ascii')
    }, (sendError, body) => {
      if (err) {
        throw err;
      }
    });
  });
}

require('http').createServer( (req, res) => {
  let addr = decodeURI(req.url.slice(1));
  if(addr.indexOf('@') !== -1) {
    mailDemoKey(addr)
  }
  res.end('sent demo key');
}).listen(8888, (err) => {  
  if (err) {
    throw err;
  }
});
