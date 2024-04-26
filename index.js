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
    projectId: "notification-pmr",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAov97xE7JloYd\ntIwjjhX79nICMEiFW3j5JIay4ULsQE+O+w8CwMilOQnoxOg0lLeoGyJ1qQcxACBK\nz/umMKbdshHCUjVn2KyFsd5bGUd0JF+Gunkz3cvOuMmgxGzkmhgMzQMeaIasEkRT\njWkzh7VxpRt1khEPsp77uQIE8P8nXlk+AOpAr8T9/JJPVosSEotXQHZT16DO96PC\nCWLmdZSJx85awZSeNJhxsehmAR9oujSJa9zOuz+hd4+ljfKOoVEKxBYZcSPWCw04\nyoWWLwl24j5+zn4Rv/Nah9sawQriLy/z8x8J5ljG+GDw2xHkOkVjSfbyZUpaJKBZ\nfbVLw+R9AgMBAAECggEAKMvMRfKYye34GL3mCNicNMhoNCj0DtQErmTLJwJ4OQ7U\nmn/2WZuo0n7eJ57d21bcfzxB47+of3ram+VokrVOfXhq9OeSmlvDi6vT3qCfpovW\ndDK1HOQdt7mgL80xj4dHzRw0yyGRVcsnj7dMvoZAyaDRDCjjNpsaOs6fTBsaukQN\nlMaRhVD9yIc9Ojo0IHDpD9/6VkUttmu5eHjuTX0CzwnDtFEpBrPe0SnlIf+UGyf6\nQpthM42L3Ra4cO1H5Krcdf1KJ8sW3AjuSNGfYckB8NCUqEvqxl3ldOi6VPUtg49J\nSKrom5CjWYEb5BniXCooBtY4YdSmezpceHgzLMDxCQKBgQDjuepRLpRc1zBSqwke\nxOWBb1eslKOhR2Cl0reyzgZW2MTNEB1mVTd6m1VtnUu3lOb/dTvNFPYpFB5zvVx1\nKjgnekzWRIcUhAjI2SSyWX3YWrHDP/rh8K6MWXua65EQmVMQ5pUNZd+uO6RXrGRj\nPiyTRHzEy/KBl2rt7JpJ6omvCQKBgQDYjcrGbboNqAkZD321qboFfzdFerCK2cII\n7c3Hh/NcN3kVjTrEXR+GZB1m9AW3iEYJeBwgSlORBeuRxD2E5nStw/ybcN18pR7R\nf9l3haJYHpnDzg7ugMZfRlK4IKAEOy/MjKpRukjNNWiV7HHN5dlh/wj4sZYMrmbw\n0pb//rmy1QKBgAuSLMfHOB6niHsK2cHIe2jiQXAxdUcCm3SRimf5c/UBuq44vWWv\nusvuDJ8vOOOxGzOrv0giYoef0BRNcN87L/NBkZnpjXuLYe7iqayuQ2i04wdqvtKw\nKg5TlaY/hfVz9PaM4NH3dTAjM6yIw+kPBbDN8BEH0+Cl0vcX6JcM5cYRAoGBAMvg\nEjvmKfeZb5dMYkmZVSy/rEWZUIQopujJGab0c0UqZLDJmb4s/fUEZDn9GzTC800O\n60vrLemm7TT60ABDBy5hCX0+MQecXPtXpmFESqcziAg0AxK/4gLorg/zhzL0lfe5\nps/y1X98/M3JIQt7jcEY3lVku6OMvhWT7d1s719RAoGBAKzDuUeOMRzxn5V6SrYu\nevj+IxIcgz2UhT8lwOJ26JiZMDk1Xwspvcm/3GY2u5Y/27YnZASIZv/Om9mvajrt\nqdsP9RZ/17Xxc5R6AkUkSCjeKwVtK/+kHv3aNRkf9qryuIvngs+z1c7DFgNUT4yX\niY5X6W25Ga9L5iupeqkMBlev\n-----END PRIVATE KEY-----\n",
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
