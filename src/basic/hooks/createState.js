function createState(initialValue) {
  let state = initialValue;

  const getState = () => state;
  const setState = (newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
    console.log('State updated: ', state);
  };

  return [getState, setState];
}

export default createState;
