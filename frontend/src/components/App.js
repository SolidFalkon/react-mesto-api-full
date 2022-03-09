import React, {useEffect, useState} from 'react';
import { Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import Header from './Header.js'
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup'
import { api } from '../utils/Api.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setUser] = useState({});
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [isSucces, setSucces] = useState(false);
  const [headerName, setHeaderName] = useState('');
  const [selectedCard, setSelectedCard] = useState({
    isImagePopupOpen: false,
    name: '',
    link: '',
  })
  const navigate = useNavigate();

  const handleTokenCheck = () => {
    if (localStorage.getItem("token")) {
      api.checkToken().then((res) => {
        if (res) {
          setHeaderName(res.email);
          setLoggedIn(true);
          navigate('/');
        }
        else 
        {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(() => {
    handleTokenCheck();
    if (loggedIn){
      Promise.all([api.getInitialProfile(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setUser(userData);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [loggedIn]);

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({ ...selectedCard, isImagePopupOpen: false, name: '', link: '', });
  };

  function handleCardClick(card) {
    setSelectedCard({
      ...selectedCard,
      isImagePopupOpen: true,
      name: card.name,
      link: card.link,
    });
  }

  function onSignOut(){
    localStorage.removeItem('token');
    setLoggedIn(false)
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  };

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  };

  function handleUpdateUser(inputs) {
    api.patchNewProfile(inputs.name, inputs.about).then(data => {
      setUser(data)
      closeAllPopups()
    })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleRegistration(inputs) {
    api.registerNewProfile(inputs.email, inputs.password).then(data => {
      if(data){
        setSucces(true);
        setInfoTooltipOpen(true);
        navigate('/login');
      }
    })
      .catch((err) => {
        setSucces(false);
        setInfoTooltipOpen(true);
        console.log(err);
      });
  };

  function handleUpdateAvatar(link) {
    api.patchNewAvatar(link).then(data => {
      setUser(data)
      closeAllPopups()
    })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleLogin(inputs) {
    api.onLogin(inputs.email, inputs.password).then(data => {
      if(data._id){
        localStorage.setItem('token', data._id);
        setLoggedIn(true);
        navigate('/');
      }
    })
      .catch((err) => {
        setSucces(false);
        setInfoTooltipOpen(true);
        console.log(err);
      });
  };

  //Всё по Cards
  const [cards, setCards] = React.useState([]);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(inputs) {
    api.postNewCard(inputs).then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups()
    })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleEscClose(event) {
    if (event.keyCode === 27) {
      closeAllPopups();
    }
  }

  return (
      <div className="App">
        <main className="main">
        <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} onSignOut={onSignOut} headerName={headerName}/>
          <Routes>
          <Route
                path="/"
                element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main 
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick} />
                </ProtectedRoute>          
                }
          />   
            <Route path="/signup" element={<Register onSubmit={handleRegistration}/>} />
            <Route path="/signin" element={<Login onSubmit={handleLogin}/>} />
            <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />} />
          </Routes>
        {selectedCard.isImagePopupOpen && <ImagePopup onEscClose={handleEscClose} card={selectedCard} onClose={closeAllPopups} />}
        <InfoTooltip isSucces={isSucces} onEscClose={handleEscClose} isOpen={isInfoTooltipOpen} onClose={closeAllPopups} />
        <EditProfilePopup onEscClose={handleEscClose} onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
        <EditAvatarPopup onEscClose={handleEscClose} onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
        <AddPlacePopup onEscClose={handleEscClose} onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
        <Footer />
        </CurrentUserContext.Provider>
        </main>
      </div>
  );
}

export default App;