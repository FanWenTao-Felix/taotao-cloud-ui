import {getFetch} from "../http";

export default {
  async repeatCheck(params = {}) {
    return getFetch("/uc/repeat/check", params);
  },
  async getCaptcha(params = {}) {
    return getFetch("/code", params);
  },
  async getSmsCode(params = {}) {
    return getFetch("/auth/sms/code", params);
  },
  async login(params = {}) {
    return getFetch("/auth/oauth/token/user", params);
  },
  async loginByMobile(params = {}) {
    return getFetch("/auth/oauth/token/mobile", params);
  },
  async loginBySocial(params = {}) {
    return getFetch("/auth/oauth/token/third", params);
  },
  async getSocialUrl(params = {}) {
    return getFetch("/auth/social/url", params);
  },
}
