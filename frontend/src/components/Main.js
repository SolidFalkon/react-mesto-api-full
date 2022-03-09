import plus from '../images/plus.svg'
import Card from './Card';
import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext' 

function Main(props) {

  const currentUser = React.useContext(CurrentUserContext);

    return(
      <div className='page__content'>
          <section className="profile">
            <div className="profile__icon" onClick={props.onEditAvatar}>
              <img src={currentUser.avatar} alt="Аватар профиля" className="profile__image"/>
              <div className="profile__image-filter"></div>
            </div>
            <div className="profile__info">    
                <h1 className="profile__name">{currentUser.name}</h1>
                <button type="button" className="profile__edit-button" onClick={props.onEditProfile}></button>
                <p className="profile__profession">{currentUser.about}</p>              
            </div>
            <button type="button" className="profile__add-button" onClick={props.onAddPlace}>
                <img src={plus} alt="добавить" className="profile__add-button-img"/>
            </button>
          </section>
          <section className="elements">
          {props.cards.map((card) => (
            <Card onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} card={card} onCardClick={props.onCardClick} key={card._id}/>
          ) )}
          </section>
      </div>
    );
}

export default Main;