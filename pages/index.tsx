import { Beam } from 'api/beam';
import { Kickgoing } from 'api/kickgoing';
import { ServiceItem } from 'components/ServiceItem';
import React from 'react';
import styled from 'styled-components';

type Props = {
  kickgoing: Kickgoing.Scooter[];
  beam: Beam.Scooter[];
};

const HomePage = ({ kickgoing, beam }: Props) => {
  return (
    <Container>
      <Screen>
        <Header>
          <ServiceItem
            logo="https://play-lh.googleusercontent.com/Eaql1Mg_jbxroQO1pT2QTmx-ehWbaS2LF_HNc6R8t1ium6c87roLg8agOHtDhUFJIA"
            availableScooters={kickgoing.length}
          />
          <ServiceItem
            logo="https://play-lh.googleusercontent.com/uxdSb9v7M7A_8IzkpbE5juK0yt01WOzMxT163rJq1wnXL27-FLj_yNydCGiYDznOWyU=s360-rw"
            availableScooters={kickgoing.length}
          />
        </Header>
        {kickgoing.map((scooter) => (
          <ScooterItem key={scooter.id}>
            <img style={{ width: 86, height: 86 }} src={scooter.img_url} />
            <div style={{ color: 'black' }}>
              <strong>{scooter.serial_number}</strong>
              <br />
              <span>
                {scooter.battery_rate}% ({scooter.battery_available_minutes}분
                이용 가능)
              </span>
              <br />
              <span>{scooter.rental_fee_description}</span>
              <br />
              <span>
                lat: {scooter.lat}, lng: {scooter.lng}
              </span>
            </div>
          </ScooterItem>
        ))}
        {beam.map((scooter) => (
          <ScooterItem key={scooter.id}>
            <ScooterImage
              style={{ width: 86, height: 86 }}
              src={
                'https://global-uploads.webflow.com/5b685812f109cf81a7d99e25/5f7f31ba21b8d3de10212aad_beam-saturn.png'
              }
            />
            <div style={{ color: 'black' }}>
              <strong>{scooter.serialNumber}</strong>
              <br />
              <span>{scooter.lastReportedBattery}%</span>
              <br />
              <span>잠금해제 300/500 ~ 1,000원 / 분당 90~180원</span>
              <br />
              <span>
                lat: {scooter.bestLocation.coordinates[0]}, lng:{' '}
                {scooter.bestLocation.coordinates[1]}
              </span>
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

const Header = styled.header`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
`;

const ScooterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
`;
const ScooterImage = styled.img`
  object-fit: contain;
`;

export const getServerSideProps = async () => {
  const config = { lat: 37.52725853989131, lng: 127.04061111330559 };
  const kickgoing = await Kickgoing.getScooters({ ...config, zoom: 17 });
  const beam = await Beam.getScooters(config);

  return {
    props: {
      kickgoing,
      beam,
    },
  };
};
