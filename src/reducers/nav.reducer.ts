import {NavController} from "ionic-angular";

export const nav = (state: NavController , {type, payload}) => {
  switch (type) {
    case 'GO_TO':
      return state.push(payload);
    default:
      return state;
  }
};