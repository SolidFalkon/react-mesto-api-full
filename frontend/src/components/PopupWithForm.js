import cross from '../images/cross.svg'
import React from 'react';

function PopupWithForm(props) {

    React.useEffect(() => {
        document.addEventListener('keydown', props.onEscClose);

        // Возвращаем функцию, которая удаляет эффекты
        return () => {
            document.removeEventListener("keydown", props.onEscClose);
        };
    });


    return (
        <div className={`popup ${props.name}-popup ${props.isOpen ? 'popup_opened' : ''}`}>
            <div className='popup__overlay' onClick={props.onClose}></div>
            <div className='popup__container'>
                <button className={`popup__close ${props.name}-close`} type='button' onClick={props.onClose}>
                    <img src={cross} alt='Крестик' className='popup__cross-button' />
                </button>
                <div className='popup__content'>
                    <h2 className='popup__title'>{props.title}</h2>
                    <form onSubmit={props.onSubmit} className={`input input_${props.name}`} name={`form-input-${props.name}`}>
                        {props.children}
                        <button type="submit" className="input__save-btn">
                            {props.name === 'confirm' ? 'Да' : props.name === 'element' ? 'Создать' : 'Сохранить'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PopupWithForm;          