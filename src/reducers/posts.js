import {
  GET_ALL_POSTS,
  GET_USER_POSTS,
  GET_JOIN_REQUEST_NOTIFICATIONS,
} from "../actions/actionTypes";

export default (
  state = {
    posts: [],
  },
  action
) => {
  switch (action.type) {
    case GET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
      };
    case GET_USER_POSTS:
      return {
        ...state,
        posts: action.posts,
      };
    case GET_JOIN_REQUEST_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
      };
    default:
      return state;
  }
};
