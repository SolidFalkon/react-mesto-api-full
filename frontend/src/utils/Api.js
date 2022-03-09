class Api {
    constructor(options) {
      this._url = options.baseUrl;
      this._headers = options.headers;
    }
    
    _checkResponse(res){
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            method: "GET",
            credentials: 'include',
            headers: this._headers,
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }
    
    getInitialProfile(){
        return fetch(`${this._url}/users/me`, {
            method: "GET",
            credentials: 'include',
            headers: this._headers,
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    patchNewProfile(name, about){
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                about: about
            })
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    patchNewAvatar(link){
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                avatar: link
            })
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    postNewCard(data){
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link,
            })
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    deleteCard(id){
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers,
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    changeLikeCardStatus(id,isLiked){
        return fetch(`${this._url}/cards/${id}/likes/`, {
            method: isLiked ? 'PUT' : 'DELETE',
            credentials: 'include',
            headers: this._headers,
        })
        .then((res) => { 
            return this._checkResponse(res)
        });
    }

    registerNewProfile(email, password){
      return fetch(`${this._url}/signup`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            password: password,
            email: email
          })
        })
        .then((response) => {
          if (response.ok){
            return response.json();
          }
          else if(response.status === 400){
            // eslint-disable-next-line no-throw-literal
            throw "400 — некорректно заполнено одно из полей";
          }
        })
        .then((res) => {
          return res;
        })
    }
    onLogin(email, password){
      return fetch(`${this._url}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          password: password,
          email: email
        })
      })
      .then((response) => {
        if (response.ok){
          return response.json();
        }
        else if(response.status === 400){
          // eslint-disable-next-line no-throw-literal
          throw "400 — не передано одно из полей ";
        }
        else if ((response.status === 401))
        {
          // eslint-disable-next-line no-throw-literal
          throw "401 — пользователь с email не найден";
        }
      })
      .then((res) => {
        return res;
      })
    }

    checkToken(){
      return fetch(`${this._url}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.ok){
          return response.json();
        }
        else if(response.status === 400){
          // eslint-disable-next-line no-throw-literal
          throw "400 — Токен не передан или передан не в том формате";
        }
        else if ((response.status === 401))
        {
          // eslint-disable-next-line no-throw-literal
          throw "401 — Переданный токен некорректен ";
        }
      })
      .then((res) => {
        return res;
      })
    }

    // другие методы работы с API
  }
  export const api = new Api({
    baseUrl: 'http://localhost:3001',
    headers: {
      authorization: '0839fc91-5c24-4c8c-bd73-be06bd5275c1',
      'Content-Type': 'application/json'
    }
  });
