export const userInitState: IUserState = {
  token: {
    access_token: "",
    expires_in: 0,
    refresh_token: "",
    scope: "",
    token_type: ""
  },
  user: {
    accountNonExpired: false,
    accountNonLocked: false,
    avatar: '',
    credentialsNonExpired: false,
    delFlag: '',
    deptId: '',
    email: '',
    enabled: false,
    jobId: '',
    lockFlag: '',
    mobile: '',
    nickname: '',
    permissions: [],
    roles: [],
    sex: 0,
    type: '',
    userId: 0,
    username: ''
  }
};

export interface IUserState {
  token: IOauth2Token,
  user: IUser,
  userDispatch?: any
}

export interface IOauth2Token {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface IUser {
  accountNonExpired: boolean
  accountNonLocked: boolean
  avatar?: string
  credentialsNonExpired: boolean
  delFlag: string
  deptId: string
  email: string
  enabled: boolean
  jobId: string
  lockFlag: string
  mobile: string
  nickname: string
  permissions: string[]
  roles: string[]
  sex: number
  type: string
  userId: number
  username: string
}
