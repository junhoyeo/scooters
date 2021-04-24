import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

const headers = {
  Connection: 'keep-alive',
  Host: 'api.kickgoing.io',
  Accept: '*/*',
  'Accept-Language': 'en-us',
  'Content-Type': 'application/json',
  'User-Agent': 'KickGoingApp/4 CFNetwork/1209 Darwin/20.2.0',
};

type Badge = 'new';
type Props = {
  kickscooters: {
    id: number;
    serial_number: string;
    battery_rate: number;
    lat: number;
    lng: number;
    img_url: string;
    rental_fee_description: string;
    badges: Badge[];
    battery_available_minutes: number;
  }[];
};

const HomePage = ({ kickscooters }: Props) => {
  return (
    <Container>
      <Screen>
        {kickscooters.map((scooter) => (
          <ScooterItem key={scooter.id}>
            <img style={{ width: 86, height: 86 }} src={scooter.img_url} />
            <div style={{ color: 'black' }}>
              <strong>{scooter.serial_number}</strong>
              <br />
              <span>{scooter.battery_available_minutes}분 이용 가능</span>
              <br />
              <span>{scooter.rental_fee_description}</span>
            </div>
          </ScooterItem>
        ))}
      </Screen>
    </Container>
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
  background-color: #d3d3d3;
  user-select: none;
`;

const Screen = styled.div`
  width: 500px;
  height: 100%;
  flex: 1;
  background-color: #eee;
`;

const ScooterItem = styled.div`
  display: flex;
  align-items: center;
`;

export const getServerSideProps = async () => {
  const { data } = await axios.get(
    // 'https://api.kickgoing.io/v3/main?latitude=37.47565563033482&longitude=127.15218960299667&version=2.0.2',
    'https://api.kickgoing.io/v3/kickscooters/ready/list?version=2.0.2&lat=37.50097504002163&lng=127.09176904468205&zoom=17.046608452778308',
    { headers },
  );
  return {
    props: {
      kickscooters: data.kickscooters,
    },
  };
};
