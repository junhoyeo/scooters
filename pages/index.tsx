import { BackgroundContainer } from 'components/BackgroundContainer';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const LandingPage = () => {
  return (
    <BackgroundContainer>
      <Title>
        Redefining
        <br />
        Safety Awareness
        <br />
        At Seoul, Korea
      </Title>
      <Link href="/map">
        <Button>Start Now</Button>
      </Link>
    </BackgroundContainer>
  );
};

export default LandingPage;

const Title = styled.h1`
  margin: 0;
  margin-top: 120px;
  font-weight: 900;
  font-size: 4.8rem;
  text-align: center;
  line-height: 1.15;

  @media (max-width: 800px) {
    font-size: 3.8rem;
  }

  @media (max-width: 420px) {
    font-size: 2.8rem;
  }
`;

const Button = styled.button`
  margin-top: 32px;
  padding: 16px 32px;
  font-weight: bold;
  font-size: 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: #03c1ff;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #03bcff;
    transform: scale(1.05);
  }
`;
