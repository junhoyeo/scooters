import { Beam } from 'api/beam';
import { Kickgoing } from 'api/kickgoing';
import { ServiceItem } from 'components/ServiceItem';
import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

type Scooter = {
  identifier: string;
  lat: number;
  lng: number;
  provider: 'kickgoing' | 'beam';
  distance?: number;
};

type Props = {
  scooters: Scooter[];
};

declare const kakao: any;

const HomePage = ({ scooters }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const map = useMemo(() => {
    if (!mapRef.current) {
      return undefined;
    }

    const mapContainer = mapRef.current;
    const mapOptions = {
      center: new kakao.maps.LatLng(37.52725853989131, 127.04061111330559),
      level: 4,
    };

    const map = new kakao.maps.Map(mapContainer, mapOptions);
    console.log('Map Initialized');
    return map;
  }, [mapRef]);

  useEffect(() => {
    if (!map || !scooters.length) {
      return;
    }

    scooters.forEach((scooter) => {
      const image = new kakao.maps.MarkerImage(
        `/images/providers/${scooter.provider}.png`,
        new kakao.maps.Size(24, 24),
      );
      const position = new kakao.maps.LatLng(scooter.lat, scooter.lng);
      const marker = new kakao.maps.Marker({ image, position });
      marker.setMap(map);
    });

    console.log('Marker Initialized');
  }, [map, scooters]);

  return (
    <Container>
      <Screen>
        <Header>
          <ServiceItem
            logo="/images/providers/kickgoing.png"
            availableScooters={
              scooters.filter(({ provider }) => provider === 'kickgoing').length
            }
          />
          <ServiceItem
            logo="/images/providers/beam.png"
            availableScooters={
              scooters.filter(({ provider }) => provider === 'beam').length
            }
          />
        </Header>
        <Map ref={mapRef} />
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
    new Promise<Scooter[]>(async (resolve) => {
      let scooters = await Kickgoing.getScooters({ ...config, zoom: 17 });
      scooters = scooters.slice(0, 500);
      scooters = scooters.map((scooter: Kickgoing.Scooter) => ({
        identifier: scooter.id,
        lat: scooter.lat,
        lng: scooter.lng,
        provider: 'kickgoing',
        distance: getDistance(config.lat, config.lng, scooter.lat, scooter.lng),
      }));
      resolve(scooters);
    }),
    new Promise<Scooter[]>(async (resolve) => {
      let scooters = await Beam.getScooters(config);
      scooters = scooters.slice(0, 500);
      scooters = scooters.map((scooter: Beam.Scooter) => {
        // NOTE: coordinates are out of order here
        const [lng, lat] = scooter.bestLocation.coordinates;
        return {
          identifier: scooter.id,
          lat,
          lng,
          provider: 'beam',
          distance: getDistance(config.lat, config.lng, lat, lng),
        };
      });
      resolve(scooters);
    }),
  ]);
  let scooters = [...kickgoing, ...beam];
  scooters.sort((a: Scooter, b: Scooter) => a.distance - b.distance);
  scooters = scooters.slice(0, 200);

  return {
    props: {
      scooters,
    },
  };
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lng1 - lng2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
}
