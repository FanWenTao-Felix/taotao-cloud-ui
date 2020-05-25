import dict from "./uc/dict";
import user from "./uc/user";
import auth from "./auth/auth";

export default {
  uc: {
    ...dict,
    ...user,
  },
  auth: {
    ...auth,
  }
}
