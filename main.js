if(parseInt(process.env.REPLIT)) {
  require('keep-alive-replit').listen(80);
} else {
  require('dotenv-safe').config();
}

const axios = require('axios');
const cheerio = require('cheerio');
const mailer = require('./mailer');

function get_data(text) {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ]

  const splitted = text.split(',')[1].split('de');
  const dia = splitted[0].trim().padStart(2, '0');
  const mes = (meses.indexOf(splitted[1].trim()) + 1).toString().padStart(2, '0');
  return [dia, mes];
}

function fetchAtualizacoes(cpf) {
  const ano = new Date().getFullYear();
  return axios.post('http://gfl.sinclog.com.br/Rastreamentos/Rastreamento/rastrear', {
    tipoBusca: 'D',
    nroBusca: cpf
  }).then(response => {
    const $ = cheerio.load(response.data);
    const divTracking = $(".tracking");
    
    const atualizacoes = []
    let diaAtual;
    let mesAtual;

    divTracking.children().each((i, el) => {
      const div = $(el);
      if(div.hasClass('tracking-header')) [diaAtual, mesAtual] = get_data(div.text());
      else {
        const children = div.children();

        const horarioDiv = children.eq(0);
        const data = new Date(`${ano}-${mesAtual}-${diaAtual} ${horarioDiv.text().trim()}:00 -0300`);

        const segundaChild = children.eq(1);

        const mensagem = segundaChild.get(0).childNodes[0].data.trim().replace(/\s{2,}/g,' ');

        const localSpan = segundaChild.children('span')
        const local = localSpan.length ? localSpan.text().trim().replace(/\s{2,}/g,' ') : null;
        
        atualizacoes.push({data, mensagem, local});
      }
    });

    return atualizacoes;
  });
}

let quantidadeAtualizacoes 

function intervalFunc() {
  fetchAtualizacoes(process.env.CPF).then(atualizacoes => {

    if(atualizacoes.length != quantidadeAtualizacoes) { 
      console.log("Atualização no rastreamento: ", atualizacoes[0]);
      if(parseInt(process.env.SEND_EMAIL)) mailer.enviarEmail(atualizacoes);  
    }

    quantidadeAtualizacoes = atualizacoes.length;

  }).catch(error => {
    console.log("Algo deu errado, erro: ", error);
  });
}

setInterval(intervalFunc, process.env.FETCH_INTERVAL_MIN * 60 * 1000);

intervalFunc();
