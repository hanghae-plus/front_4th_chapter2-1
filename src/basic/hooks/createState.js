// function createState(initialValue) {
function createState(state) {
  // let state = initialValue;

  const getState = () => state;
  const setState = (newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
    console.log('State updated: ', state);
  };

  // return [getState, setState];
  return [() => getState(), setState];
  // return [getState(), setState];
}

export default createState;

// 얘는 함수죠?
// 어떤 메모리에 할당이 되어야 합니다.
//

// const [getter, setter] = createState(initialData)
//

// 좋은 선택 => React 마이그레이션을 위한 코드
// useState로 교체하는 쪽은 createState => useState
//
