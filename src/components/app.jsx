import styled from 'styled-components';
import Calendar from './calendar';

const CalendarWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const App = () => {
  return (
    <CalendarWrapper>
      <Calendar />
    </CalendarWrapper>
  );
}

export default App;
