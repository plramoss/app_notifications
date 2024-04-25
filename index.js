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
    projectId: "notification-pmr",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDsh0gIuFtF1asl\nF762AFnAJxIIwnqbHoyX6H9MPtH9khuwcxkXw77itkoKNcdbwKCwMd39C1K4IeW3\nHot0jWrLJOz+7g5d2Pz4sREgdWGzVxbAaaLsqrb1vB6JSVADXwnl8XDEOWlVNF47\nMl09Z521uwfysthm314vLT5KbhYrFVCmZC3H9IwEul/ZHPEulYAI5KRcDdMPxIGr\n2hyUhcR8oALfLLAWVyluFDUmHYhmtAyeEQPRYbYXxA3VjfkEuer9koy2I8U3MQGX\ny0/Vj8hrK/3CXhi4XB0AMESXiIDf4+tN8v441kYNQQtrmRk6YUKvyjMKD/ELUb+n\nn8tPkAyFAgMBAAECggEAY1AcHVk3LbfdEAqLz4SPKsDc8COkckxd8Qy0opF//23h\nRXHWd+V/WVb7+JSDHBHiBokxseWWumy1NPHU0T/tttVO022mR55r/YnvbIcM2k33\nZhwUxjWZ880krzVCrN+zWsLJPAL1KMr/w/BOORGwJRWebTfN6EfiloFzNbJKiZSv\nXCdUe2fIRiTILON8f/VayFgDj0ldtQdbU8Kn0K8pjw/uzvz6HUHSMG8JX+nWjOJZ\nYCulX0+6ReUj9+hAsoqTYbP/APe3xAXiIegyj87AKHfjVTRgEP++xKptBgvnmOIA\ncZRnVaX0Z3AWsIYAnB/JIROG6xJEEuLMuHt5szc48wKBgQD8x6t9aUeAI/H6rp7m\nmY6C8fxoHvpTdn9t14RiAENPkoEaj2XC+0vavaLBPSrCnpJS/kIlFGcDrzg1dL5U\n21k5U55Kq+/q6kbHH0J1DJ9hPQc8cSmX7oshYeH1mCTvhf4N1W1Jc0GUMchFUvL9\nVifNdmjAOHhNhC1HwrXtcofCEwKBgQDvip1GoLd6baagWLWA03GRcy/tKwrrxIUJ\nwMU9ln9Jsc8IGe6rG1VKlYus8FjWh7G7KesI9zdZH+0wsocxHHnwWcfRx2FmHZVs\nhOn+dTeJEKSN/aH9VMBrto61QPCTGPTJ/TvCvEGhgzxlIgiytDr40sw8KWOpHiEj\nBf04X0cKBwKBgQDguElWZn+wBUSbzR1qd9zfwGzZy6BTDqdeaRhBX2Z3mRC5If4f\nhvP6dFf6XnxjJEGFEpCPEkI6Xk0kCLMkERSTCClSzOOu/bMKVlnoYN5Xvb9vFlMZ\nxHFfrfsJMMa1QXOHrNNJVvNX4aHfL0zhtvQPjlK1f/5DO1xdzVWa0BSsjQKBgQDf\nAnfGB16KFoeohK4GD9SNi2W1Mftq4HzTRarb2b8LhwSuECaJGltforZ0/RZYM+Cd\n1TrCEBZxXS3fxnXinRZRU+SaQztEbIpui5ellM9tRhdNMjKbvUmffkiCKsFO0U8k\ntiPq+oVHrvyNUxAx/2VfvjDyWb409p33E15aGynyBQKBgD1+STSLfEROWT2MiaeC\nn0CyakBMkKnNNwcsxDgZ1e+ndcVN+fiGh/ulOStDzKKFzoOWPWGcVmkRm2RAoYGU\njjOf9hxaNdGvbrnL3tRUHWumL56dv/p/GH3WSBHYj8gAY/LuupihnhuvN1k1vA8l\nWjSfh3NDm9caS1I/9ETNC118\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-k84di@notification-pmr.iam.gserviceaccount.com",
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
