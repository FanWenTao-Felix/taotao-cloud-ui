import React, {useReducer} from 'react';
import {UserContext, MenuContext} from "../../store";
import Routers from "../routers/Routers";
import {userInitState} from "../../store/state/UserState";
import {menuInitState} from "../../store/state/MenuState";
import {loginReducer} from "../../store/reducer/UserReducer";
import {menuToggleReducer} from "../../store/reducer/MenuReducer";
import {hot} from 'react-hot-loader';
import "./app.less"
import "./base.less"

const App: React.FC = () => {
  const [userState, userDispatch] = useReducer(loginReducer, userInitState);
  const [menuState, menuDispatch] = useReducer(menuToggleReducer, menuInitState);

  return (
      <UserContext.Provider value={{...userState, userDispatch: userDispatch}}>
        <MenuContext.Provider value={{...menuState, menuDispatch: menuDispatch}}>
          <Routers/>
        </MenuContext.Provider>
      </UserContext.Provider>
  );
};

export default (process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
