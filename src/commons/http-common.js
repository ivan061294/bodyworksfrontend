import axios from "axios";
import { constantes } from "./Constantes";
import swal from "sweetalert";

let instance = axios.create({
  baseURL: constantes.API_URL_HTTP + "/api/v1",
  validateStatus: function (status) {
    return status < 500;
  },
});

function parseError(messages) {
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages: messages })
    } else {
      return Promise.reject({ messages: [messages] })
    }
  } else {
    return Promise.reject({ messages: ['Ocurrio un error inesperado, intentelo mas tarde.'] })
  }
}

function parseBody(response) {
  if (response.status <= 300) {
    return response.data
  } else if (response.status === 401) {
    swal({
      icon: "warning",
      title: "Advertencia!",
      text: "Su session a expirado, porfavor ingrese nuevamente",
    }).then(() => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace("/login");
    })
  } else {
    return parseError(response.data)
  }
}

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
  return config;
}, error => {
  Promise.reject(error)
});

instance.interceptors.response.use((response) => {
  return parseBody(response)
}, error => {
  if (error.response) {
    return parseError(error.response.data)
  } else {
    return Promise.reject(error)
  }
})

export default instance;