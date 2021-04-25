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
        {availableScooters.toLocaleString()}대
      </AvailableScooters>
    </Container>
  );
};

const Container = styled.li`
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  margin-right: 8px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
`;

const AvailableScooters = styled.span`
  font-weight: bold;
`;
