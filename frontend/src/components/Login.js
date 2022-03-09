import React from 'react';

export default function Login(props) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
    
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
      setPassword(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onSubmit({
        email,
        password,
    });
}

  return (
    <div className="identification">
      <h1 className="identification__name">Вход</h1>
      <form className="identification__form" onSubmit={handleSubmit}>
        <input
          value={`${email}`}
          onChange={handleChangeEmail}
          className="input__text input__text_color_white"
          placeholder="Email"
          required
          id="email"
          name="email"
          type="email"
        />
        <input
          value={`${password}`}
          onChange={handleChangePassword}
          className="input__text input__text_color_white"
          placeholder="Пароль"
          required
          id="password"
          name="password"
          type="password"
        />
        <button
          type="submit"
          className="input__save-btn input__save-btn_color_white"
        >
          Войти
        </button>
      </form>
    </div>
  );

}