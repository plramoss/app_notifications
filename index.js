import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging'
import express from 'express';
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json")
  next();
});

initializeApp({
  credential: cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
})

app.post("/send", function(req, res) {
  const authHeader = req.headers.authorization;
  const receivedToken = authHeader && authHeader.split(' ')[1];

    const message = {
    notification: {
      title: req.body.title,
      body: req.body.text,
      // image: '', // URL da imagem a ser exibida na notificação
    },
    data: { // Dados adicionais a serem enviados junto com a notificação
      key1: req.body.value1,
      key2: req.body.value2,
    },
    android: { // Configurações específicas para Android
      ttl: 3600 * 1000, // Tempo de vida da mensagem em milissegundos
      priority: 'normal', // Prioridade da mensagem ('normal' ou 'high')
      notification: {
        icon: '', // URL do ícone a ser exibido na notificação
        color: '#f45342', // Cor do ícone da notificação
      },
    },
    apns: { // Configurações específicas para iOS
      headers: {
        'apns-priority': '10', // Prioridade da mensagem
      },
    },
    token: receivedToken,
  };

  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Mensagem Enviada",
        token: receivedToken,
      });
      console.log("Menssagem Enviada:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Erro no envio da mensagem:", error)
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000")
})
