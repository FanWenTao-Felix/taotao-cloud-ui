import React from 'react'
import {Layout} from 'antd'
import CustomMenu from '../customMenu/CustomMenu'
import {IMenu} from "../../config/menu";
import {GithubFilled} from '@ant-design/icons';

const {Sider} = Layout

interface IProps {
  menuToggle: boolean;
  menu: IMenu[]
}

const AppAside: React.FC<IProps> = (props) => {
  let {menuToggle, menu} = props
  return (
      <Sider className='aside' collapsed={menuToggle}>
        <div className='logo'>
          <a rel='noopener noreferrer' href='https://github.com/ltadpoles' target='_blank'>
            <GithubFilled style={{fontSize: '3.8rem', color: '#fff'}}/>
          </a>
        </div>
        <CustomMenu menu={menu}/>
      </Sider>
  )
}

export default AppAside
