export default (state={}, action) => {
  switch(action.type) {
    case 'SET_GLOBAL_VALUE': {
      return {
        ...state,
        [action.name]: action.value
      };
    }
    case 'SET_GLOBAL_ALL': {
      return action.payload;
    }
    default:
      return state;
  }
}

const setGlobalValue = (name, value)=>{
  if(name) {
    return {
      type: 'SET_GLOBAL_VALUE',
      name: name,
      value: value,
    }
  } else {
    return {
      type: 'SET_GLOBAL_ALL',
      payload: value
    }
  }
};

const getGlobalAll = (state)=>state.globals;

export {setGlobalValue, getGlobalAll};