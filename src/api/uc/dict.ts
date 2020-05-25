import {getFetch} from "../http";

export default {
  async getUserListHandle(params = {}) {
    return getFetch("/uc/user/login/info", params);
  },
  async usersListDeleteHandle(params = {}) {
    return getFetch("/uc/user", params);
  }
}
