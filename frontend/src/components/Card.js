import {CurrentUserContext} from '../contexts/CurrentUserContext' 
import React from 'react';

function Card(props) {

    const currentUser = React.useContext(CurrentUserContext);

    function handleClick() {
        props.onCardClick(props.card);
    }  

    function handleLikeClick() {
        props.onCardLike(props.card);
    } 

    function handleDeleteClick(){
        props.onCardDelete(props.card);
    }

    const isOwn = props.card.owner === currentUser._id;
    const cardDeleteButtonClassName = (
    `element__delete ${isOwn ? '' : 'element__delete_disabled'}`
    ); 
    const isLiked = props.card.likes.some(i => i === currentUser._id);
    const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_active' : ''}`;  
    
    return(
        <div className="element">
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
            <div type="button" className="element__image-block">
                <button type="button" className="element__image-button" onClick={handleClick}>
                    <img src={props.card.link} alt={props.card.name} className="element__image"/>
                </button>
            </div>
            <div className="element__description">
                <h2 className="element__text">{props.card.name}</h2>
                <div className="element__likes">
                    <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <p className="element__number-likes">{props.card.likes.length}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;