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
            logo="/images/providers/kickgoing.png"
            availableScooters={kickgoing.length}
          />
          <ServiceItem
            logo="/images/providers/beam.png"
            availableScooters={beam.length}
          />
        </Header>
        <Map id="map" />
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
