import axios from 'axios';

export module Kickgoing {
  export type Badge = 'new';

  export type Scooter = {
    id: number;
    serial_number: string;
    battery_rate: number;
    lat: number;
    lng: number;
    img_url: string;
    rental_fee_description: string;
    badges: Badge[];
    battery_available_minutes: number;
  };

  const headers = {
    Connection: 'keep-alive',
    Host: 'api.kickgoing.io',
    Accept: '*/*',
    'Accept-Language': 'en-us',
    'Content-Type': 'application/json',
    'User-Agent': 'KickGoingApp/4 CFNetwork/1209 Darwin/20.2.0',
  };

  type GetScootersProps = {
    lat: number;
    lng: number;
    zoom?: number;
  };

  export const getScooters = async ({
    lat,
    lng,
    zoom = 15,
  }: GetScootersProps) => {
    const {
      data,
    } = await axios.get(
      `https://api.kickgoing.io/v3/kickscooters/ready/list?version=2.0.2&lat=${lat}&lng=${lng}&zoom=${zoom}`,
      { headers },
    );

    return data.kickscooters;
  };
}
