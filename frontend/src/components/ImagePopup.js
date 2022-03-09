import cross from '../images/cross.svg'
import React from 'react';

function ImagePopup(props) {

  React.useEffect(() => {
    // Список действий внутри одного хука
    document.addEventListener('keydown', props.onEscClose);

    // Возвращаем функцию, которая удаляет эффекты
    return () => {
      document.removeEventListener("keydown", props.onEscClose);
    };
  });

  return (
    <div className='popup popup-image popup_opened'>
      <div className="popup__overlay" onClick={props.onClose}></div>
      <div className="popup-image__container">
        <button className="popup__close image-close" type="button">
          <img src={cross} alt="Крестик" className="popup__cross-button" onClick={props.onClose} />
        </button>
        <img src={props.card.link} alt={props.card.name} className="popup-image__image" />
        <p className="popup-image__text">{props.card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;          