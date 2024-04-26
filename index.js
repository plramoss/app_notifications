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
    projectId: "app-notification-d98fc",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClP9QfEY/yeBb4\na1jaEIY9qSSL8FtROY0A/83W53ln+fFJZ9wFd4sXWcFI8fdNOlDx8YcJrWoeizW9\nl9ysB9wDMkRlWn3/UIcWkEx5hbIQMHvxj26pButs9n3hbWPvIFzdfrkm9VREh1hL\nWLL4HVmABpfdW+C43yetFV5Tmlq71YdBSLM1dODfSpZ7ye64PTXTjtJcYDUfSM4x\neZr98MUyDKWKF4xnEqU4vPaEl6owcKnFs7jmGdQGpf7fB37n6idp5t+dAcxAsBff\ngrclYlSuifQlPuJ1m8v5OCnttUWB6H+JrM4zPqlXBvdNPp7MTGgiF6wbU7Ho63Ti\nojj2y9fXAgMBAAECggEAGKlEaliQH3LtlqhKi8yghA48jofR0PbiRK5oVTSZSTuj\nVz2hN82l29fAwTafHg7gaqMNcJPJPQKwg/lobOIFYxK641dUa2hkqKjjSNV7g/AA\nZ0XtEVufgdTtZ1mQauzs/v88+YPuTgXW1vPHTcDvjOwu+NGP4XcoMCv6tkZYWSSg\nyTqE5ebV8krS4yl98Nmz9JIFrLVdgEt/o7FTFcZ0KZJkV+DDkqn8KexAyjs713MG\nQYZRZFECiEHwzDW0AC04qCxi7SJ6wVkaxzIpFsIZ5Z3t3kjff+Fz7IRY49NC4qTZ\nUrPCt26jMj61R3yYZ5yLXuSlHdb5TQf4YWgzWL7jcQKBgQDV6e9NEyrV/NaI2coM\nQ1k0kSzM/vXiCyeoihw/kZRyd8Uqnfa4KtzwNAG8zje1u0IxZC7bI9yndGM9IuWz\nUEaGBV+4Sm8DEwWuIYoRK/ShZTzLzhp1dStggbrVhDkcDM6Iy+4zt9wPv2ZNSyNK\n0eaVdrXyX62xGCG/d7LTBE4LpwKBgQDFwtcL5jnEFEGi62wZum6/g8srtF23S/Wy\n9w3Ri9xU0il8gw+U0PHuwwxtJVCguHrQ44n/prgRRwJ72E8SW7ujCAapBE0ImpGH\n5n22Uow98LErvMw/22qgk18WZmsrTiJuod3Rll/6qeMHa4coKBLZoi5U4gfx0UPa\nu5OmXTmYUQKBgA3LMfUkYUS/Mw5MDO1RgnUTT3JAlpZm5b3Geh/XQV1IP9yJpxkl\nGm4azGniWlFLq+8HaMYUv+vEY4nTsEAp0wJdYli94/6swVcDLqYA0Zt+rbbuqWId\nlhh5BRUzm4MliEPl8ow/NN+HFg+x4qq2ckn9B6qDZO3ggnyYOV3GD0pNAoGAMc7C\nzrJrdiEL7vaQQWKdJgsRjq5ctB+jgDGM/2vUUGCmJj/0Gq0NYe8qIAs35WLRO+8z\nAHqC/Yb+7yYptBv6hDMvSj5VEIetg6bfnp3nyGnolXV1k9e1YT/8wO2GrF9/eJG4\nBmNzRPSow2OnpMuDA+E+/g33pkXoaxy3MT1lliECgYEA0BMEjHvA+TgOTOp8WxMw\niiKRj94TlLO5bOz1NMXYLaEU3W17+MIl/w06yAE9FGzRxNiq9s+c++8StuLT2Auw\nIDzJZuw6yERMnqV+v6nYDs/KP97Lwv9fbx0w2jGXCoNjy4/0WXXjqzLoV68EAPws\nDU9R2YqEdRn6VuVn/8rEY2c=\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-hqtm2@app-notification-d98fc.iam.gserviceaccount.com",
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
