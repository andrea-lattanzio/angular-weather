export interface LocationInfo {
  generationtime_ms: Number;
  results: [
    {
      id: Number;
      name: String;
      latitude: Number;
      longitude: Number;
      elevation: Number;
      feature_code: String;
      country_code: String;
      admin1_id: Number;
      admin2_id: Number;
      admin3_id: Number;
      timezone: String;
      population: Number;
      postcodes: [String];
      country_id: Number;
      country: String;
      admin1: String;
      admin2: String;
      admin3: String;
    }
  ];
}

export interface LocationInfoSimplified {
  admin1: string;
  admin3: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}
