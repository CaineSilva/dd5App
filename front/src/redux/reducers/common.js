import { SET_CONFIG, SET_MODE } from "../actionTypes";
import { DEFAULT_CONFIG, MODES } from "../../constants";

const initialState = {
  config: DEFAULT_CONFIG,
  mode: MODES.HOME,
};

const common = (old = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG: {
       let s = Object.assign({}, old);
       s.config = action.payload;
       return s;
    }
    case SET_MODE: {
      let s = Object.assign({}, old);
      s.mode = action.payload
      return s
    }
    default: {
      return old;
    }
  }
};

export default common;
