import React from 'react';
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    
    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    const currentUser = React.useContext(CurrentUserContext);

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        if(props.isOpen){
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [currentUser,props]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm onEscClose={props.onEscClose} onSubmit={handleSubmit} name='profile' title='Редактировать профиль' isOpen={props.isOpen} onClose={props.onClose}>
            <input value={`${name}`} onChange={handleChangeName} type="text" placeholder="Имя" className="input__text input__text_type_name" id="name" name="name" minLength="2" maxLength="40" required />
            <span id="name-error" className="input__error"></span>
            <input value={`${description}`} onChange={handleChangeDescription} type="text" placeholder="Профессия" className="input__text input__text_type_profession" id="profession" name="profession" minLength="2" maxLength="200" required />
            <span id="profession-error" className="input__error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup;       
