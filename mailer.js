
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: !!parseInt(process.env.SMTP_SECURE), // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
});

function enviarEmail(atualizacoes) {

  const ultimaAtualizacao = atualizacoes[0];
  const restanteAtualizacoes = atualizacoes.slice(1);

  let htmlBody = `
<div style="text-align: center">
  <h2>Atualização de Rastreamento GFL</h2>

  <h4>Última atualização:</h4>
  <div style="border-radius: 5px; background-color: #eee; padding: 5px;">
    <p>
        <b>${ultimaAtualizacao.data.toLocaleString()}</b>
        <br>
        ${ultimaAtualizacao.mensagem}
        <br>
        ${ultimaAtualizacao.local ? `<i>${ultimaAtualizacao.local}</i>` : ''}
    </p>
  </div>

  <h4>Restante das atualizações:</h4>
  <div style="border-radius: 5px; background-color: #eee; padding: 5px;">
`;

  restanteAtualizacoes.forEach(atualizacao => {
    htmlBody += `
    <p>
      <b>${atualizacao.data.toLocaleString()}</b>
      <br>
      ${atualizacao.mensagem}
      <br>
      ${atualizacao.local ? `<i>${atualizacao.local}</i>` : ''}
    </p>
    <hr>
    `
  });

  htmlBody += `
  </div>
</div>`;

  return transporter.sendMail({
    from: process.env.SMTP_SEND_FROM, to: process.env.SMTP_SEND_TO,
    subject: "Atualização Rastreamento GFL", // Subject line
    text: `${ultimaAtualizacao.data.toLocaleString()} -> ${ultimaAtualizacao.mensagem} - ${ultimaAtualizacao.local}`, // plain text body
    html: htmlBody, // html body
  }).then(info => {
    console.log(`E-mail enviado, id: ${info.messageId}`);
  }).catch(error => {
    console.error("Erro no envio do e-mail, erro: ", error);
  });

} 

module.exports = { enviarEmail };

