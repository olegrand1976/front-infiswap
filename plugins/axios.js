import axios from 'axios';

export default ({ $config }, inject) => {
  // Crée une instance d'Axios avec une base URL
  const api = axios.create({
    baseURL: process.env.API_BASE_URL, // Utilise la configuration de l'API depuis les variables d'environnement ou runtimeConfig
    //timeout: 5000, // Temps d'attente pour la requête en ms
  });

  // Injecte l'instance Axios dans le contexte Nuxt.js sous le nom `$axios`
  inject('axios', api);
};
