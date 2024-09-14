import { GET_PROJECTS, PROJECT_ERROR } from "../actions/types";

const initialState = {
  projects: [],
  loading: true,
  error: {},
};

export default function project(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        loading: false,
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
