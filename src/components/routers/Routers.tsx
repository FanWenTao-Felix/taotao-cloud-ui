import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import loadable from "../../utils/loadable"

const DefaultLayout = loadable(() => import('../../components/containers/DefaultLayout'))
const View404 = loadable(() => import('../../pages/404/View404'))
const View500 = loadable(() => import('../../pages/500/View500'))
const Login = loadable(() => import('../../pages/login/Login'))

const Routers: React.FC = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <Redirect to='/index'/>}/>
          <Route path='/500' component={View500}/>
          <Route path='/login' component={Login}/>
          <Route path='/404' component={View404}/>
          <Route component={DefaultLayout}/>
        </Switch>
      </BrowserRouter>
  );
};

export default Routers;
