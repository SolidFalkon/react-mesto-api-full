import { NavLink } from 'react-router-dom';

function Header(props) {

    return(
        <header className="header">
          <div className="header__logo"></div>
            {props.loggedIn ? 
            <div className="header__navigation">
              <h1 className='header__name'>{props.headerName}</h1>
              <NavLink className="header__link" to="/signin" onClick={props.onSignOut}>Выйти</NavLink>
            </div> 
            : 
            <nav className="header__navigation">
              <NavLink className={(navData) => navData.isActive ? "header__link_active" : "header__link" } to="/signin">Войти</NavLink>
              <NavLink className={(navData) => navData.isActive ? "header__link_active" : "header__link" }  to="/signup">Регистрация</NavLink>
            </nav> }
        </header>
    );
}

export default Header;