import { useState } from 'react';
import { Container, Wrapper } from './components';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Wrapper />
    </Container>
  );
}

export default App;
