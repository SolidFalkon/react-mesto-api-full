import cross from '../images/cross.svg'
import succes from '../images/succes.png'
import failed from '../images/failed.png'
import React from 'react';

function InfoTooltip(props) {

  React.useEffect(() => {
      document.addEventListener('keydown', props.onEscClose);

      return () => {
          document.removeEventListener("keydown", props.onEscClose);
      };
  });


  return (
      <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
          <div className='popup__overlay' onClick={props.onClose}></div>
          <div className='popup__container'>
              <button className='popup__close' type='button' onClick={props.onClose}>
                <img src={cross} alt='Крестик' className='popup__cross-button' />
              </button>
              {props.isSucces ? 
              <div className='popup__content'>
                <img src={succes} className='popup__image' alt='галочка'/> 
                <p className='popup__text' >Вы успешно зарегистрировались!</p>
              </div>
              :
              <div className='popup__content'>
                <img src={failed} className='popup__image' alt='крестик'/>
                <p className='popup__text' >Что-то пошло не так! Попробуйте ещё раз.</p>
              </div>
              }
          </div>
      </div>
  );
}

export default InfoTooltip;          