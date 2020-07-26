import { GET_ALL_POSTS } from "../actions/actionTypes";

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
    default:
      return state;
  }
};
