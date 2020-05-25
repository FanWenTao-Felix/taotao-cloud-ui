import React from 'react'
import {Avatar, Badge, Dropdown, Layout, Menu} from 'antd'
import Icon from "../icon/Icon";
import user from "../../assets/images/user.jpg"
import screenfull from "screenfull";

const {Header} = Layout

interface IProps {
  menuClick: () => void,
  avatar: string | undefined,
  menuToggle: boolean,
  loginOut: () => void
}

const AppHeader: React.FC<IProps> = (props) => {
  let {menuClick, avatar, menuToggle, loginOut} = props
  const screenFull = () => {
    if (screenfull.isEnabled) {
      screenfull.request();
    }
  };

  const menu = (
      <Menu
          mode="horizontal"
          style={{ float: 'right'}}
      >

        <Menu.ItemGroup title="用户中心">
          <Menu.Item key="setting:2">
            <span onClick={loginOut}><Icon type='icontouxiang-info' style={{ fontSize: "2rem" }}/>个人信息</span>
          </Menu.Item>
          <Menu.Item key="logout" >
            <span onClick={loginOut}><Icon type='iconlog_out' style={{ fontSize: "2rem" }}/>退出登录</span>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider/>
        <Menu.ItemGroup title="设置中心">
          <Menu.Item key="setting:3">
            <span onClick={loginOut}><Icon type='iconuser-edit' style={{ fontSize: "2rem" }}/>个人设置</span>
          </Menu.Item>
          <Menu.Item key="setting:4">

            <span onClick={loginOut}><Icon type='iconsetting' style={{ fontSize: "2rem" }}/>系统设置</span>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
  )
  return (
      <Header className='header'>
        <div className='left'>
          <Icon
              style={{fontSize: '2.5rem'}}
              onClick={menuClick}
              type={menuToggle ? 'iconmenu-unfold' : 'iconmenu-fold'}
          />
        </div>
        <div className='right'>
          <div className='mr10'>
            <Icon type="iconfullscreen" style={{ cursor: 'pointer', fontSize: "2.5rem"}} onClick={screenFull} />
          </div>

          <div className='mr15'>
            <Badge count={25} overflowCount={10} style={{ marginLeft: 5 }}>
              <a href='https://github.com/ltadpoles/react-admin' style={{color: '#000'}}>
                <Icon type='iconNotificationFilled' style={{ fontSize: "2rem" }}/>
              </a>
            </Badge>
          </div>

          <div>
            <Dropdown overlay={menu} overlayStyle={{width: '20rem'}}>
              <div className='ant-dropdown-link'>
                <Avatar src={user} alt='avatar' style={{cursor: 'pointer'}}/>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>
  )
}

export default React.memo(AppHeader)
