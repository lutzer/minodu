
export class Weather {
    id: number;
    temperature: number;
    temperature1: number;
    humidity: number;
    humidity1: number;
    pressure: number;
    luminosity: number;
    co: number;
    no2: number;
    ambient: number;
    createdAt: string;

    constructor(id: number, temperature: number, temperature1: number, humidity: number, humidity1: number, pressure: number, luminosity: number, co: number, no2: number, ambient: number, createdAt: string) {
      this.id = id;
      this.temperature = temperature;
      this.temperature1 = temperature1;
      this.humidity = humidity;
      this.humidity1 = humidity1;
      this.pressure = pressure;
      this.luminosity = luminosity;
      this.co = co;
      this.no2 = no2;
      this.ambient = ambient;
      this.createdAt = createdAt;
    }

    static fromJson(json: any): Weather {
      return new Weather(
        json.id,
        json.temperature,
        json.temperature1,
        json.humidity,
        json.humidity1,
        json.pressure,
        json.luminosity,
        json.co,
        json.no2,
        json.ambient,
        json.createdAt
      );
    }
  }