import {UserAction, UserActionType as type} from "../action/UserAction"
import {IUserState} from "../state/UserState";

export function loginReducer(state: IUserState, action: UserAction) {
  switch (action.type) {
    case type.SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    default:
      return state;
  }
}
