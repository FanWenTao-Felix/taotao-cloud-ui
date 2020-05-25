import React, {useContext, useEffect, useState} from 'react';
import url from 'url';
import './index.less';
import logo from "../../assets/logo.png"
import api from "../../api"
import {Button, Checkbox, Col, Form, Input, message, Row, Tabs} from 'antd';
import {
  AlipayOutlined,
  DingtalkOutlined,
  GithubFilled,
  MobileOutlined,
  QqOutlined,
  UserOutlined,
  WechatFilled,
  WeiboCircleFilled
} from '@ant-design/icons';
import {Rule} from "antd/lib/form";
import {timeFix, validatenull} from "../../utils/util";
import {useHistory, useLocation} from "react-router-dom";
import {UserContext} from "../../store";
import {UserActionType} from "../../store/action/UserAction";

interface IBasicState {
  isShow: boolean,
  customActiveKey: string,
  loginBtn: boolean,
  loginType: number,
  codeSrc: string,
}

interface IState {
  time: number,
  loginBtn: boolean,
  loginType: number,
  smsSendBtn: boolean
}

interface ILoginForm {
  username: string,
  password: string,
  code: string,
  token: string,
  t: number
}

interface ISocialForm {
  code?: string,
  state?: string
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const {TabPane} = Tabs;

  const initBasicState = () => {
    return {
      isShow: true,
      customActiveKey: 'usernameTab',
      loginBtn: false,
      loginType: 0,
      codeSrc: ""
    }
  }
  const [basicState, setBasicState] = useState<IBasicState>(initBasicState);
  const initState = () => {
    return {
      time: 60,
      loginBtn: false,
      loginType: 0,
      smsSendBtn: false
    }
  }
  const [state, setState] = useState<IState>(initState)
  const initLoginForm = () => {
    return {
      username: '',
      password: '',
      code: '',
      token: '',
      t: 0
    }
  }
  const [loginForm, setLoginForm] = useState<ILoginForm>(initLoginForm)
  const initSocialForm = () => {
    return {
      code: '',
      state: ''
    }
  }
  const [socialForm, setSocialForm] = useState<ISocialForm>(initSocialForm)

  const history = useHistory();
  let location = useLocation();
  let userContext = useContext(UserContext);
  let params: ISocialForm = url.parse(location.search, true).query;

  useEffect(() => {
    refreshCaptcha();
    socialLogin();
  }, [])

  const refreshCaptcha = () => {
    let time = new Date().getTime();
    api.auth.getCaptcha({t: time}).then((res: any) => {
      setLoginForm(prevState => {
        return {...prevState, t: time}
      })
      setBasicState(prevState => {
        return {...prevState, codeSrc: res.data}
      })
    })
  }

  const socialLogin = () => {
    if (validatenull(params.state) && validatenull(params.code)) {
      return
    }
    setBasicState(prevState => {
      return {...prevState, isShow: false}
    })
    setSocialForm(() => {
      return {...params}
    })

    api.auth.loginBySocial(params)
        .then((res: any) => loginSuccess(res))
        .catch(() => {
          setBasicState(prevState => {
            return {...prevState, loginBtn: false}
          })
        })
  }

  const loginSuccess = (res: any) => {
    userContext.userDispatch({type: UserActionType.SUCCESS, payload: res.data})
    localStorage.setItem("loginToken", JSON.stringify(res.data.token))
    localStorage.setItem("loginUser", JSON.stringify(res.data.user))
    history.push("/index")
    message.success(`${res.data.user.username} ${timeFix()}，欢迎回来`, 5)
  }

  const submit = (e: any) => {
    setBasicState(prevState => {
      return {...prevState, loginBtn: true}
    })

    const validateFieldsKey = basicState.customActiveKey === 'usernameTab' ? ['username', 'password', 'imgCode'] : ['mobile', 'smsCode']
    form.validateFields(validateFieldsKey)
        .then(values => {
          const loginParams = {...values}
          if (values.username) {
            loginParams[!state.loginType ? 'email' : 'username'] = values.username
            loginParams.password = values.password
            loginParams.t = loginForm.t
            loginParams.code = values.imgCode

            api.auth.login(loginParams)
                .then((res: any) => loginSuccess(res))
                .catch(() => {
                  refreshCaptcha()
                  setBasicState(prevState => {
                    return {...prevState, loginBtn: false}
                  })
                })
                .finally(() => {
                  setBasicState(prevState => {
                    return {...prevState, loginBtn: false}
                  })
                })
          } else {
            api.auth.loginByMobile(loginParams).then((res: any) => loginSuccess(res))
                .catch(() => {
                  refreshCaptcha()
                  setBasicState(prevState => {
                    return {...prevState, loginBtn: false}
                  })
                })
                .finally(() => {
                  setBasicState(prevState => {
                    return {...prevState, loginBtn: false}
                  })
                })
          }
        }).catch(error => {
      setTimeout(() => {
        setBasicState(prevState => {
          return {...prevState, loginBtn: false}
        })
      }, 500)
    })
  }

  const validateUsernameOrEmail = (rule: any, value: any) => {
    if (value) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        setBasicState(prevState => {
          return {...prevState, loginType: 0}
        })
      } else {
        setBasicState(prevState => {
          return {...prevState, loginType: 1}
        })
      }
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  const validatePhone = (rule: Rule, value: any) => {
    if (!value) {
      return Promise.reject();
    } else {
      if (new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/).test(value)) {
        let params = {
          fieldVal: value,
          dataId: ''
        }
        return api.auth.repeatCheck(params).then((res: any) => {
          if (res) {
            if (res.code === 200 && res.data) {
              return Promise.resolve();
            } else {
              setState(prevState => {
                return {...prevState, smsSendBtn: true}
              })
              return Promise.reject("该手机号未注册");
            }
          }
        }).catch(error => {
          return Promise.reject(error);
        })
      } else {
        return Promise.reject("请输入正确格式的手机号码");
      }
    }
  }

  const getSmsCode = (e: any) => {
    e.preventDefault();
    form.validateFields(['mobile']).then(values => {
      setState(prevState => {
        return {...prevState, smsSendBtn: true}
      })

      const interval = window.setInterval(() => {
        let second = --state.time;
        if (second <= 0) {
          setState(prevState => {
            return {...prevState, smsSendBtn: false, time: 60}
          })
          window.clearInterval(interval)
        }
        setState(prevState => {
          return {...prevState, time: second}
        })
      }, 1000)

      const hide = message.loading('验证码发送中..', 2)
      let params = {mobile: values.mobile};
      api.auth.getSmsCode(params).then((res: any) => {
        if (res.code === 200) {
          setTimeout(hide)
          message.success("验证码发送成功", 5)
        } else {
          setTimeout(hide)
          message.error("验证码发送失败", 5)
        }
      }).catch((err: any) => {
        setTimeout(hide, 1)
        clearInterval(interval)
        setState(prevState => {
          return {...prevState, smsSendBtn: false, time: 60}
        })
        requestFailed(err)
      })
    })
  }

  const requestFailed = (err: any) => {
    setState(prevState => {
      return {...prevState, loginBtn: false}
    })
    refreshCaptcha()
    message.error(((err.response || {}).data || {}).message || '请求出现错误，请稍后再试', 4)
  }

  const handleTabClick = (key: string) => {
    setBasicState(prevState => {
      return {...prevState, customActiveKey: key}
    })
  }

  const getSocialUrl = (type: string) => {
    api.auth.getSocialUrl({loginType: type}).then((res: any) => {
      if (res) {
        console.log(res)
        window.location.href = res.data;
      }
    })
  }

  return basicState.isShow ? (<div id="userLayout" className="user-layout-wrapper">
        <div className="container">
          <div className="top">
            <div className="header">
              <a href="/">
                <img src={logo} className="logo" alt="logo"/>
                <span className="title">Tao Tao Cloud</span>
              </a>
            </div>
            <div className="desc">
              Tao Tao Cloud 微服务前后端分离架构开发平台
            </div>
          </div>

          <div className="main">
            <Form id="formLogin" className="user-layout-login" form={form}>
              <Tabs activeKey={basicState.customActiveKey}
                    tabBarStyle={{textAlign: 'center', borderBottom: 'unset'}}
                    onChange={handleTabClick}>
                <TabPane tab={
                  <span>
                    <UserOutlined/>
                    账号密码登录
                  </span>
                } key="usernameTab">
                  <Form.Item name="username" rules={[
                    {required: true, message: "请输入帐户名或邮箱地址"},
                    {validator: (rules, value) => validateUsernameOrEmail(rules, value)}]}>
                    <Input size="large" placeholder="请输入帐户名或邮箱地址" style={{borderRadius: "7px"}} autoComplete="false"/>
                  </Form.Item>
                  <Form.Item name="password" rules={[
                    {required: true, message: "请输入密码"}]}>
                    <Input.Password size="large" placeholder="请输入密码" style={{borderRadius: "7px"}}/>
                  </Form.Item>
                  <Form.Item name="imgCode" rules={[
                    {required: true, message: "请输入验证码"}]}>
                    <Row>
                      <Col span="14">
                        <Input size="large" placeholder="请输入验证码" style={{borderRadius: "7px"}}/>
                      </Col>
                      <Col span="1" className="line"/>
                      <Col span="9">
                        <div style={{position: "relative"}}>
                          <img
                              src={basicState.codeSrc}
                              onClick={refreshCaptcha}
                              alt="加载验证码失败"
                              style={{width: "130px", cursor: "pointer", borderRadius: '7px', border: 'solid 1px red'}}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form.Item>
                </TabPane>

                <TabPane tab={
                  <span>
                    <MobileOutlined/>
                    手机号登录
                  </span>
                } key="mobileTab">
                  <Form.Item name="mobile" rules={[
                    {required: true, message: '请输入手机号'},
                    {validator: (rules, value) => validatePhone(rules, value)}
                  ]}>
                    <Input size="large" autoComplete="false" placeholder="请输入手机号" style={{borderRadius: "7px"}}/>
                  </Form.Item>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={14}>
                      <Form.Item name="smsCode">
                        <Input size="large" placeholder="验证码" style={{borderRadius: "7px"}}/>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={10}>
                      <Button type="primary" tabIndex={-1}
                              disabled={state.smsSendBtn}
                              className="getCaptcha"
                              style={{borderRadius: "5px"}}
                              onClick={getSmsCode}>
                        {!state.smsSendBtn && '获取验证码' || (state.time + ' s秒后重新发送')}
                      </Button>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>

              <Form.Item>
                <Checkbox>自动登录</Checkbox>
                <a className="forge-password" style={{float: "right"}}>忘记密码</a>
              </Form.Item>

              <Form.Item>
                <Button size="large" type="primary" disabled={state.loginBtn} onClick={submit} className="login-button"
                        style={{borderRadius: "5px"}}>确定</Button>
              </Form.Item>

              <div className="user-login-other">
                <span>其他登录方式</span>
                <a href="#" onClick={() => {
                  getSocialUrl("github")
                }}>
                  <GithubFilled className="item-icon"/>
                </a>
                <a href="#!" onClick={() => {
                  getSocialUrl("wechat")
                }}>
                  <WechatFilled className="item-icon"/>
                </a>
                <a href="#!" onClick={() => {
                  getSocialUrl("qq")
                }}>
                  <QqOutlined className="item-icon"/>
                </a>
                <a href="#!" onClick={() => {
                  getSocialUrl("alipay")
                }}>
                  <AlipayOutlined className="item-icon"/>
                </a>
                <a href="#!" onClick={() => {
                  getSocialUrl("dingtalk")
                }}>
                  <DingtalkOutlined className="item-icon"/>
                </a>
                <a href="#!" onClick={() => {
                  getSocialUrl("gitee")
                }}>
                  <WeiboCircleFilled className="item-icon"/>
                </a>
                <a className="register">注册账户</a>
              </div>
            </Form>
          </div>

          <div className="footer">
            <div className="links">
              <a href="_self">帮助</a>
              <a href="_self">隐私</a>
              <a href="_self">条款</a>
            </div>
            <div className="copyright">
              Copyright &copy; 2020 滔滔网络工作室技术小组
            </div>
          </div>
        </div>
      </div>
  ) : (<div/>)
};

export default Login;

