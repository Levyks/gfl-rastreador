# Rastreamento GFL

Projeto para acompanhar rastreamento de entrega pela [transportadora GFL](http://www.gflogistica.com.br/)

Ele funciona fazendo um POST request para a mesma url que o form da [página de rastreamento](http://gfl.sinclog.com.br/Rastreamentos/Rastreamento) faz, e então fazendo o scraping do HTML respondido, retirando as informações necessárias

Possui a capacidade de checar em intervalos definidos, te avisando por e-mail caso uma atualização tenha ocorrido (credenciais SMTP precisam ser fornecidas, como a de uma conta gmail)

Foi feito pensando em ser hosteado de graça no [Replit](https://repl.it), por isso, conta com um web-server rodando na porta 80, respondendo no `/keep-alive`, para que possa ser adicionado em serviços como o [UptimeRobot](https://uptimerobot.com/), garantindo o seu funcionamento 24/7

## Configurações

Todas as configurações são feitas através de variáveis de ambiente.

Caso não esteja usando o Replit, elas podem ser setadas copiando o arquivo `.env.example` e renomeando para `.env`, preenchendo todas as informações necessárias.

Caso esteja usando o Replit, basta setar as variáveis clicando no ícone de cadeado no menu lateral.

```env
#Coloque 1 caso esteja rodando no Replit
REPLIT=0

#Seu CPF, usado na busca do rastreamento
CPF=12345678900

#Intervalo em minutos para verificar rastreio
FETCH_INTERVAL_MIN=15

#Representa se um e-mail deve ser enviado quando aconteça uma atualização
SEND_EMAIL=0

#Credenciais SMTP
#Caso esteja usando gmail, não precisa mexer no HOST, PORT ou SECURE
#Porém, é necessário habilitar o SMTP para sua conta
#Recomendo usar uma conta separada da sua principal

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=0
SMTP_USER=seu-email-para-smtp@gmail.com
SMTP_PASSWORD=suaSenha12345
SMTP_SEND_FROM=Rastreamento GFL <seu-email-para-smtp@gmail.com>
SMTP_SEND_TO=seu-email-principal@gmail.com
```
