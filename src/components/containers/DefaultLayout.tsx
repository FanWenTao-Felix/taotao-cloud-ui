import React, {useContext, useEffect, useState} from 'react'
import {Redirect, Route, Switch, useHistory, useLocation} from 'react-router-dom'
import {BackTop, Layout, message} from 'antd'
import routes from "../../config/route";
import echarts from 'echarts/lib/echarts'
import menu, {IMenu} from '../../config/menu'
import './layout.less'
import AppHeader from './AppHeader'
import AppAside from './AppAside'
import AppFooter from './AppFooter'
import {MenuContext} from "../../store";
import {MenuActionType} from "../../store/action/MenuAction";

const {Content} = Layout

interface IState {
  avatar?: string,
  show: boolean,
  menu: IMenu[]
}

const DefaultLayout: React.FC = () => {
  const initState = () => {
    return {
      show: false,
      menu: []
    }
  }

  let [state, setState] = useState<IState>(initState)
  let history = useHistory();
  let location = useLocation();
  let menuContext = useContext(MenuContext);

  const isLogin = () => {
    if (!localStorage.getItem('loginUser')) {
      history.push('/login')
    } else {
      setState(prevState => {
        return {
          ...prevState,
          menu: getMenu(menu)
        }
      })
    }

    setState(prevState => {
      return {
        ...prevState,
        menu: getMenu(menu)
      }
    })
  }

  useEffect(() => {
    isLogin();

    let timer: any;
    const adaptive = () => {
      let {pathname} = location

      if (pathname === '/' || pathname === '/index') {
        timer = setTimeout(() => {
          // @ts-ignore
          echarts.init(document.getElementById('bar')).resize()
          // @ts-ignore
          echarts.init(document.getElementById('line')).resize()
          // @ts-ignore
          echarts.init(document.getElementById('pie')).resize()
          // @ts-ignore
          echarts.init(document.getElementById('pictorialBar')).resize()
          // @ts-ignore
          echarts.init(document.getElementById('scatter')).resize()
        }, 500)
      } else {
        timer = null
      }
    }
    adaptive();

    return () => {
      timer && clearTimeout(timer)
    }
  }, [location])

  const getMenu = (menu: IMenu[]): IMenu[] => {
    let user = localStorage.getItem('user');
    let auth: any;
    if (typeof user === "string") {
      auth = JSON.parse(user).auth
    }

    if (!auth) {
      return menu
    } else {
      return menu.filter(res => res.auth && res.auth.indexOf(auth) !== -1)
    }
  }

  const loginOut = () => {
    localStorage.clear()
    history.push('/login')
    message.success('退出成功!')
  }

  return (
      <Layout className='app'>
        <BackTop/>
        <AppAside menuToggle={menuContext.menuToggle} menu={state.menu}/>
        {/*<ThemePicker />*/}
        <Layout style={{marginLeft: menuContext.menuToggle ? '80px' : '200px', minHeight: '100vh'}}>
          <AppHeader
              menuToggle={menuContext.menuToggle}
              menuClick={() => {
                menuContext.menuDispatch({type: MenuActionType.MENU_TOGGLE, payload: !menuContext.menuToggle})
              }}
              avatar=''
              loginOut={loginOut}
          />

          <Content className='content'>
            <Switch>
              {routes.map(item => {
                return (
                    <Route
                        key={item.path}
                        path={item.path}
                        exact={item.exact}
                        render={props =>
                            // @ts-ignore
                            <item.component {...props} />
                          // !auth ? (
                          //     <item.component {...props} />
                          // ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                          //     <item.component {...props} />
                          // ) : (
                          //     // 这里也可以跳转到 403 页面
                          //     <Redirect to='/404' {...props} />
                          // )
                        }></Route>
                )
              })}
              <Redirect to='/404'/>
            </Switch>
          </Content>
          <AppFooter/>
        </Layout>
      </Layout>
  )
}
export default DefaultLayout;


