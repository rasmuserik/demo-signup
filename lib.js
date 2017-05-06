// # demo-signup
//

require('http').createServer((req, res) => {
  let addr = decodeURI(req.url.slice(1));
  if (addr.indexOf('@') !== -1) {
    mailDemoKey(addr);
  }
  res.end('sent demo key');
}).listen(8888, err => {
  if (err) {
    throw err;
  }
});

var mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_KEY,
  domain: 'mg.solsort.com'
});
var mailcomposer = require('mailcomposer');

function mailDemoKey(addr) {
  var demokey = (Math.random() * 0x7fffffff / 2999 | 0) * 2999;

  var mail = mailcomposer({
    from: 'robot@solsort.com',
    to: addr,
    cc: 'rasmuserik@solsort.com',
    subject: 'BiblioteksApp.dk',
    text: `Hej,

du får hermed adgang prototypen:

http://demo.biblioteksapp.dk/#key${demokey}

Adgangen er personlig og må ikke deles,
- del i stedet link til biblioteksapp.dk

Bemærk: det er en tidlig prototype,
og ting vil ændre sig meget.

Alt feedback er velkomment,
og kan sendes til
rasmuserik@solsort.com
(som også har fået en kopi
af denne mail, - send også
en mail hertil hvis du vil
framelde dig emails, da dette
ikke er automatiseret endnu)

Mange hilsner fra
Post-robotten :)`,
    html: `Hej,<br><br>
du får hermed adgang prototypen:<br>
<br>

<a href="http://demo.biblioteksapp.dk/#key${demokey}">
http://demo.biblioteksapp.dk/#key${demokey}</a><br>
<br>
Adgangen er personlig og må ikke deles,<br>
- del i stedet link til biblioteksapp.dk<br>
<br>
Bemærk: det er en tidlig prototype,<br>
og ting vil ændre sig meget.<br>
<br>
Alt feedback er velkomment,<br>
og kan sendes til<br>
<a href="mailto:rasmuserik@solsort.com">rasmuserik@solsort.com</a><br>
(som også har fået en kopi<br>
af denne mail, - send også<br>
en mail hertil hvis du vil<br>
framelde dig emails, da dette<br>
ikke er automatiseret endnu)<br>
<br>
Mange hilsner fra<br>
Post-robotten :)<br>
<br>  
<img width=2 height=2 src="https://incoming.solsort.com/log.js?bogappmail{demokey}">`
  });

  mail.build(function (err, msg) {
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
