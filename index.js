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
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7O/yNUPMf/tUT\nFJW6TJ4gb71cWiHBYOqSOCmqDq+TcNVPLRiuHDp/ufz3U8lVzv2Lr/Ad0Td933wf\n7QDCXnjX0ykNIogVdkBjEyhVasjmJ9ds9Ki3mGKDHj5pk+zjHE9mXoYzBvWih2pn\ng/ObtQYPMKTyItQ4Ojfcf38menuOuy6nTNamqTKFHZgC6TuB0q3gMpwLKRgIUxyb\nRwAPvjinVwugW1XZ/99P+BRKfQqIExG55UTG1TU4zjqOkmcuQI43DtSxXZBWxp7x\nrwBSSoJ6ZcJ4z/b106biQ/5GrQdtCZVMvhG4TkerK4n5zZKk1tgpBc+Cz/BFJH58\nnXSeiuJxAgMBAAECggEAJ3+YoDFHEOVgCuXpTkNyilI4Rt7GxzZMVeteMr9lX7vK\nbCkNz1EqMB7K1FxLGXyQtWK4y3mC9N1sIIoNgnOOl602uEwkHC71l1EHzbk4x4D5\nK8WTQCP4CEQdk4U+0Ix83ZIsSmB5+j8J/etyvVLbg+HVsjURwwjZFv2Yk8P8A9hx\ntwqMUaUO+HltYJT7ZL+kwoTHVIJcGlDRUKMBXK+/dVuKo5EQ5IXOxe5XItvLH5Dm\nbbEq5EzhTp8tPoAZdzyirVMaTJYtbXAdBJgB66gD0X2vZ9Z1RICo1g8lZXf34Bmz\nuo8PppBF+hXhnJMqQ5HZaoSq1otJDE7PG8l33pbLVwKBgQDdHrLDJrLs2nJUbxgj\noweTTaSZrTTwsJoqVOtfSaKo24WC3Pvwvke0TBQYLCj3YFBLD/paAwPxDFursWeH\n+nnTgk2dF+sc6E0Q5gnM+Uh4STAk+gxhZBAQTA3TWSMKNYwssVvRVu2eKSkEOINb\nNu+Zl5B+8OySArIMAW1VLwfGDwKBgQDYxOodyp0TcwT/av/uY5fU2HaNN4wGJgjt\nEDNRToRJ1F+E1e6AJAeUcZuoechi+SxBY7OF+urkI0EcuZKHJmfOV/Q/E5nV032q\nlbjyuzYi8H6B4vpV62wcJsxPQ7CIvMUw54vMdJlgoSXipzaqg6rYBFenaIw6UTnT\nQ+VxXF9PfwKBgAvliOyi+mFv51LPn1bbgJ7WQJLcFMsWVVUNuJQp3AyFsws1ZICx\nXB5BMZuTVKjqj6daNrf9DYs8hPoZ014nhcJxckePb+DgRrUwCzrx9ooyNdrncR8U\nSSD3Vo8WbqIv+1i0OiJrMOGfiUtm1vpjXETBOM77m17HslifAwjgPOTVAoGBAIxe\n35hRJ2x71CWuXXM7DQwo7IRADy3AHZGeJw0kwiepHf3AJ0TVkA8BjqIH0sq8vnrN\nnGhLdyYq6jQ2u3tHVHtbm2/pOnosDTmU4QJWVxVDFTj5CdDvtb95JF7D36J8U1l6\n552Ld/MKB6WBULYUs2JVVYmz+vKcvMxhMEg7YADzAoGAGIbWFGmaZhGxU/2Figxi\nCksZ8QN0zEF5P7Brni9TkEvgGJQSkqOnpCHNEJlj0xLsxgxOkVvTMsrRuFzVPNPm\nnn9amDGX6o++Ge2za/kmFwkQHJFbl7FjOotFa6vzQJJhtuMdkR3aJ7WWznmPtRlU\nzAr+jm/+cb44JS9tBEP89L0=\n-----END PRIVATE KEY-----\n",
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
