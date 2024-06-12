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
  const tokens = req.body.tokens;
  const invalidTokens = []
  
  const message = {
    data: {
      labId: req.body.labId
    },
    notification: {
      title: req.body.title,
      body: req.body.text,
    },
    android: { // Configurações específicas para Android
      ttl: 3600 * 1000, // Tempo de vida da mensagem em milissegundos
      priority: 'normal', // Prioridade da mensagem ('normal' ou 'high')
      notification: {
        color: '#FFFFFF', // Cor transparente da notificação
        icon: './controllab_icon.png'
      },
    },
    apns: { // Configurações específicas para iOSsar
      headers: {
        'apns-priority': '10', // Prioridade da mensagem
      },
    },
    tokens: tokens,
  };

  getMessaging().sendEachForMulticast(message)
    .then((r) => {
      tokens.forEach((token, i) => {
        const resSuccess = r.responses[i].success;
        if(resSuccess === false){
          invalidTokens.push(token)
        }
      });
      res.json({ invalidTokens: invalidTokens });
    }).catch((error) => {
      console.log("Erro ao enviar a mensagem: ", error)
      res.status(500).send('Erro ao enviar a mensagem')
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000")
})
