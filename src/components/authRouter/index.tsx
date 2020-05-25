import {withRouter} from 'react-router';
import {Route, Redirect} from 'react-router-dom';
import React from 'react';

// @ts-ignore
const AuthRouter = ({component: Component, ...rest}) => {
  const isLogged = localStorage.getItem('isLogin') === '1' ? true : false;
  return <Route {...rest} render={props => (isLogged ? <Component {...props} /> : <Redirect to={'/login'}/>)}/>;
};

// @ts-ignore
export default withRouter(AuthRouter);
