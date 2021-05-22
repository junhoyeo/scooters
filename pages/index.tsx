import { Beam } from 'api/beam';
import { Kickgoing } from 'api/kickgoing';
import { ServiceItem } from 'components/ServiceItem';
import React, { useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';

import { Kakao, kakaoMap } from '@/types/kakaoMap';

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

declare const kakao: Kakao;

const HomePage = ({ scooters }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const providers = useMemo(
    () =>
      ['kickgoing', 'beam'].map((provider) => ({
        name: provider,
        logo: `/images/providers/${provider}.png`,
        count: scooters.filter((scooter) => scooter.provider === provider)
          .length,
      })),
    [],
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    let map: kakaoMap.maps.Map;

    const initializeMap = () => {
      const mapContainer = mapRef.current;
      const mapOptions = {
        center: new kakao.maps.LatLng(37.52725853989131, 127.04061111330559),
        level: 4,
      };
      map = new kakao.maps.Map(mapContainer, mapOptions);
    };

    const initializeMarkers = () => {
      scooters.forEach((scooter) => {
        const image = new kakao.maps.MarkerImage(
          `/images/providers/${scooter.provider}.png`,
          new kakao.maps.Size(24, 24),
        );
        const position = new kakao.maps.LatLng(scooter.lat, scooter.lng);
        const marker = new kakao.maps.Marker({ image, position });
        marker.setMap(map);
      });
    };

    initializeMap();
    console.log('Map Initialized');
    initializeMarkers();
    console.log('Marker Initialized');
  }, [mapRef]);

  return (
    <Container>
      <Screen>
        <Header>
          {providers.map(({ name, logo, count }) => (
            <ServiceItem key={name} logo={logo} availableScooters={count} />
          ))}
        </Header>
        <Map ref={mapRef} />
        <BottomModal>
          <HelmetButton>
            <HelmetIcon />
          </HelmetButton>
          <BottomContainer>
            <BottomContainerQuestion>
              Are you moving with somebody else?
            </BottomContainerQuestion>
            <FilterContainer>
              {[...Array(5)].map((_, index) => (
                <FilterButton selected={index === 0}>{index + 1}</FilterButton>
              ))}
            </FilterContainer>
          </BottomContainer>
        </BottomModal>
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
  user-select: none;
  background-color: #87ccc5;
  background-image: url('/images/background-gradient.png');
  background-size: cover;
`;

const Screen = styled.div`
  width: 500px;
  height: 100%;
  flex: 1;
  background-color: #eee;
  position: relative;
`;

const Header = styled.header`
  padding: 16px 20px;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

const Map = styled.div`
  width: 100%;
  height: 100vh;
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

const BottomModal = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
`;

const HelmetButton = styled.button`
  margin-left: auto;
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  height: 64px;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-image: linear-gradient(to bottom right, #04f9ff, #0150ff);
  box-shadow: 0px 4px 32px rgba(1, 80, 255, 0.45);
`;
const HelmetIcon = styled.img.attrs({
  src: '/images/helmet.svg',
})`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 3.5px;
`;

const BottomContainer = styled.div`
  background-color: white;
  padding: 16px 16px 32px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
`;
const BottomContainerQuestion = styled.span`
  font-size: 1.05rem;
  font-weight: bold;
`;
const FilterContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

type FilterButtonProps = {
  selected?: boolean;
};
const FilterButton = styled.span<FilterButtonProps>`
  margin-right: 4px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dee2e6;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ selected }) =>
    !selected
      ? css`
          background-color: #dee2e6;
          color: #495057;

          &:hover {
            background-color: #ced4da;
            color: #343a40;
          }
        `
      : css`
          background-image: linear-gradient(
            to bottom right,
            #03c1ff,
            #049cff,
            #0150ff
          );
          color: rgba(255, 255, 255, 0.9);

          &:hover {
            background-image: linear-gradient(
              to bottom right,
              #00d0ff,
              #007bff,
              #0033ff
            );
            color: white;
          }
        `};
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
