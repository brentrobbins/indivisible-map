const groupsReducerDefaultState = {
  allGroups: [],
};

const groupsReducer = (state = groupsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        allGroups: [...state.allGroups, ...action.groups],
      };
    default:
      return state;
  }
};

export default groupsReducer;
