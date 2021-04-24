import styled from 'styled-components';

const HomePage = () => {
  return (
    <Container />
  );
};

export default HomePage;

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #262b34;
  user-select: none;
`;
