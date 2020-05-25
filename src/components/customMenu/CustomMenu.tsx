import React, {useEffect, useState} from 'react'
import {Menu} from 'antd'
import {Link, useLocation} from 'react-router-dom'
import {IMenu} from "../../config/menu";
import Icon from "../icon/Icon";

interface IProps {
  menu: IMenu[]
  location?: string
}

interface IState {
  openKeys: string[],
  selectedKeys: string[]
}

const CustomMenu: React.FC<IProps> = (props) => {
  const initState = () => {
    return {
      openKeys: [],
      selectedKeys: []
    }
  }
  let [state, setState] = useState<IState>(initState);
  let location = useLocation();
  const getOpenKeys = (str: string) => {
    let newStr = '',
        newArr = [],
        arr = str.split('/').map(i => '/' + i)
    for (let i = 1; i < arr.length - 1; i++) {
      newStr += arr[i]
      newArr.push(newStr)
    }
    return newArr
  }

  useEffect(() => {
    let {pathname} = location
    setState(prevState => {
      if (props.location !== pathname) {
        return {
          selectedKeys: [pathname],
          openKeys: getOpenKeys(pathname)
        }
      } else {
        return {...prevState}
      }
    })
  }, [location])

  // 只展开一个 SubMenu
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length === 0 || openKeys.length === 1) {
      setState(prevState => {
        return {
          ...prevState,
          openKeys: openKeys
        }
      })
      return
    }

    // 最新展开的 SubMenu
    const latestOpenKey = openKeys[openKeys.length - 1]

    // 这里与定义的路由规则有关
    if (latestOpenKey.includes(openKeys[0])) {
      setState(prevState => {
        return {
          ...prevState,
          openKeys: openKeys
        }
      })
    } else {
      setState(prevState => {
        return {
          ...prevState,
          openKeys: [latestOpenKey]
        }
      })
    }
  }

  const renderMenuItem = ({key, icon, title}: IMenu) => (
      <Menu.Item key={key}>
        <Link to={key}>
          {icon && <Icon type={icon} style={{ fontSize: "2rem" }}/>}
          <span>{title}</span>
        </Link>
      </Menu.Item>
  )

  // 循环遍历数组中的子项 subs ，生成子级 menu
  const renderSubMenu = ({key, icon, title, subs}: IMenu) => {
    return (
        <Menu.SubMenu
            key={key}
            title={
              <span>
                {icon && <Icon type={icon} style={{ fontSize: "2rem" }}/>}
                <span>{title}</span>
              </span>
            }>
          {subs &&
          subs.map(item => {
            return item.subs && item.subs.length > 0 ? renderSubMenu(item) : renderMenuItem(item)
          })}
        </Menu.SubMenu>
    )
  }

  return (
      <Menu
          mode='inline'
          theme='dark'
          openKeys={state.openKeys}
          selectedKeys={state.selectedKeys}
          style={{marginTop: '20px'}}
          onClick={({key}) => setState(prevState => {
            return {
              ...prevState,
              selectedKeys: [key]
            }
          })}
          onOpenChange={onOpenChange}>
        {props.menu && props.menu.map(item => {
          return item.subs && item.subs.length > 0 ? renderSubMenu(item) : renderMenuItem(item)
        })}
      </Menu>
  )
}

export default CustomMenu;
