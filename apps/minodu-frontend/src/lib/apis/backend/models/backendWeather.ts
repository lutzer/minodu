export interface BackendWeather {
	id: number;
	temperature: number | null;
	temperature1: number | null;
	humidity: number | null;
	humidity1: number | null;
	pressure: number | null;
	luminosity: number | null;
	co: number | null;
	no2: number | null;
	ambient: number | null;
	wind_direction: number | null;
	wind_speed: number | null;
	indice_uv: number | null;
	battery: number | null;
	time: string | null;
	description: string | null;
	createdAt: string;
}
