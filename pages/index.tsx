import { Beam } from 'api/beam';
import { Kickgoing } from 'api/kickgoing';
import { ServiceItem } from 'components/ServiceItem';
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  kickgoing: Kickgoing.Scooter[];
  beam: Beam.Scooter[];
};

declare const kakao: any;

const HomePage = ({ kickgoing, beam }: Props) => {
  const map = useMemo(() => {
    // undefined when SSR
    if (typeof window === 'undefined' || !window.document) {
      return undefined;
    }

    const mapContainer = window.document.getElementById('map');
    const mapOptions = {
      center: new kakao.maps.LatLng(37.52725853989131, 127.04061111330559),
      level: 4,
    };

    const map = new kakao.maps.Map(mapContainer, mapOptions);
    return map;
  }, []);

  // TODO: move this logic to server
  const scooters = useMemo(() => {
    return [
      ...kickgoing.map((scooter) => ({
        identifier: scooter.id,
        lat: scooter.lat,
        lng: scooter.lng,
        provider: 'kickgoing',
      })),
      ...beam.map((scooter) => ({
        identifier: scooter.id,
        lat: scooter.bestLocation.coordinates[0],
        lng: scooter.bestLocation.coordinates[1],
        provider: 'beam',
      })),
    ];
  }, [kickgoing, beam]);

  useEffect(() => {
    if (!map || !scooters.length) {
      return;
    }

    scooters.forEach((scooter) => {
      const position = new kakao.maps.LatLng(scooter.lat, scooter.lng);
      const marker = new kakao.maps.Marker({ position });
      marker.setMap(map);
    });
  }, [map, scooters]);

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
            availableScooters={beam.length}
          />
        </Header>
        <Map id="map" />
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

const Map = styled.div`
  width: 100%;
  height: 600px;
  background-color: #e3e3e3;
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
  const [kickgoing, beam] = await Promise.all([
    new Promise<Kickgoing.Scooter[]>(async (resolve) => {
      const scooters = await Kickgoing.getScooters({ ...config, zoom: 17 });
      resolve(scooters);
    }),
    new Promise<Beam.Scooter[]>(async (resolve) => {
      const scooters = await Beam.getScooters(config);
      resolve(scooters);
    }),
  ]);

  return {
    props: {
      kickgoing,
      beam,
    },
  };
};
