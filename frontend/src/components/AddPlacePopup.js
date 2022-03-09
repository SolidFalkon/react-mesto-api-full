import React from 'react';
import PopupWithForm from './PopupWithForm'

function AddPlacePopup (props){

    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        if(props.isOpen){
            setName('');
            setLink('');
        }
      }, [props]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onAddPlace({
          name,
          link,
        });
      } 

    return(
    <PopupWithForm onEscClose={props.onEscClose} onSubmit={handleSubmit} name='element' title='Новое место' isOpen={props.isOpen} onClose={props.onClose}>
        <input value={name} onChange={handleChangeName} type="text" placeholder="Название" className="input__text input__text_type_nameImg"  minLength="2" maxLength="30" id="nameImg" name="name" required/>
        <span id="nameImg-error" className="input__error"></span>
        <input value={link} onChange={handleChangeLink} type="url" placeholder="Ссылка на картинку" className="input__text input__text_type_img"  id="img" name="link" required/>
        <span id="img-error" className="input__error"></span>
    </PopupWithForm>
    )
}

export default AddPlacePopup