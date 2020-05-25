import {getFetch, postFetch} from "../http";

export default {
  async login(params = {}) {
    return postFetch("/uc/user/login/info", params);
  }
}
