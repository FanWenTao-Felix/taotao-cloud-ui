import React from 'react'
import {Col, Divider, Layout, Row} from 'antd'
import screenfull from 'screenfull'
import BarEcharts from './bar'
import PieEcharts from './pie'
import LineEcharts from './line'
import ScatterEcharts from './scatter'
import PictorialBarEcharts from './pictorialBar'
import {DingtalkOutlined, QqOutlined, WechatFilled, WeiboOutlined} from '@ant-design/icons';
import './index.less'

const Index: React.FC = () => {
  return (
      <Layout className='index animated fadeIn'>
        <Row gutter={24} className='index-header'>
          <Col span={6}>
            <div className='base-style wechat'>
              <WechatFilled className='icon-style'/>
              <div>
                <span>999</span>
                <div>微信</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='base-style qq'>
              <QqOutlined className='icon-style'/>
              <div>
                <span>366</span>
                <div>QQ</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='base-style dingding'>
              <DingtalkOutlined className='icon-style'/>
              <div>
                <span>666</span>
                <div>钉钉</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='base-style weibo'>
              <WeiboOutlined className='icon-style'/>
              <div>
                <span>689</span>
                <div>微博</div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className='base-style'>
              <div style={{display: 'flex', justifyContent: "space-between"}}>
                <div>图形全屏展示</div>
                {/*<Icon type='fullscreen' style={{cursor: 'pointer'}} onClick={fullToggle}/>*/}
              </div>
              <Divider/>
              <BarEcharts/>
            </div>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <div className='base-style'>
              <LineEcharts/>
            </div>
          </Col>
          <Col span={12}>
            <div className='base-style'>
              <PieEcharts/>
            </div>
          </Col>
          <Col span={12}>
            <div className='base-style'>
              <ScatterEcharts/>
            </div>
          </Col>
          <Col span={12}>
            <div className='base-style'>
              <PictorialBarEcharts/>
            </div>
          </Col>
        </Row>
      </Layout>
  )
}

export default Index
