import React from 'react';
import PopupWithForm from './PopupWithForm'

function EditAvatarPopup (props){

    const avatarRef = React.useRef();

    React.useEffect(() => {
      if(props.isOpen){
        avatarRef.current.value = '';
      }
    }, [props]);

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateAvatar(
          avatarRef.current.value,
        );
      } 

    return(
        <PopupWithForm onEscClose={props.onEscClose} onSubmit={handleSubmit} name='update-avatar' title='Обновить аватар' isOpen={props.isOpen} onClose={props.onClose}>
            <input ref={avatarRef} type="url" placeholder="Ссылка на аватар" className="input__text input__text_type_link" defaultValue="" id="linkAvatar" name="link" required/>
            <span id="linkAvatar-error" className="input__error"></span>
        </PopupWithForm>
    )

}

export default EditAvatarPopup