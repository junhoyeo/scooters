export declare namespace kakaoMap {
  export namespace maps {
    export class LatLng {
      constructor(lat: number, lng: number);
    }

    export class Size {
      constructor(width: number, height: number);
    }

    export type MapOptions = {
      center: LatLng;
      level: number;
    };

    export class Map {
      constructor(container: HTMLDivElement, options: MapOptions);
    }

    export class MarkerImage {
      constructor(source: string, size: Size);
    }

    export type MarkerOptions = {
      image: MarkerImage;
      position: LatLng;
    };

    export class Marker {
      constructor(options: MarkerOptions);

      setMap(map: Map);
    }
  }
}

export type Kakao = typeof kakaoMap;
