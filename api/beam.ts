import axios from 'axios';

export module Beam {
  export enum Status {
    MAYBE_NORMAL = 0,
  }

  export type Scooter = {
    id: number;
    status: Status;
    lastReportedBattery: number;
    code: string;
    lastOysterHeartbeatReportTime: string | null;
    lastPhoneLocationTime: string | null;
    lastReportedTimeTrackerMotion: unknown | null;
    lastOysterAfterMotionSingleReportTime: string | null;
    lastPhoneLocationBLERSSI: number;
    bestLocation: {
      type: 'Point';
      coordinates: [number, number];
    };
    serialNumber: string;
    vehicleType: number;
    bleMacAddress: string;
    omniIotImei: string;
    Tasks: unknown[];
    formFactor: 'escooter';
  };

  const headers = {
    Connection: 'keep-alive',
    Host: 'gateway.ridebeam.com',
    Accept: '*/*',
    'Accept-Language': 'en-KR;q=1.0, ko-KR;q=0.9',
    'User-Agent': 'escooterapp/1.41.2; android',
  };

  type GetScootersProps = {
    lat: number;
    lng: number;
  };

  export const getScooters = async ({ lat, lng }: GetScootersProps) => {
    const {
      data,
    } = await axios.get(
      `https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=${lat}&longitude=${lng}`,
      { headers },
    );

    return data.data.scooters;
  };
}
