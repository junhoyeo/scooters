import React from 'react';
import styled from 'styled-components';

type Props = {
  logo: string;
  availableScooters: number;
};

export const ServiceItem: React.FC<Props> = ({ logo, availableScooters }) => {
  return (
    <Container>
      <Logo src={logo} />
      <AvailableScooters>
        {availableScooters.toLocaleString()}
      </AvailableScooters>
    </Container>
  );
};

const Container = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
  width: 56px;
`;

const Logo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 8px;
`;

const AvailableScooters = styled.span`
  font-weight: bold;
  width: 100%;
  text-align: center;
  margin-top: 4px;
`;
