export function useState(initialValue) {
  let state = initialValue;

  const getState = () => state;
  const setState = (newValue) => {
    if (typeof newValue === 'function') {
      state = newValue(state);
    } else {
      state = newValue;
    }
  };

  return [getState(), setState];
}
