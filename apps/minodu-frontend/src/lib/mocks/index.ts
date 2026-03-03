import type { BackendWeather } from '$lib/apis/backend/models/backendWeather';

export { mockProductDemands } from './productDemands';

export function createMockWeather(overrides?: Partial<BackendWeather>): BackendWeather {
	const randomFloat = (min: number, max: number) =>
		Math.round((Math.random() * (max - min) + min) * 100) / 100;
	const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

	return {
		id: randomInt(1, 1000),
		temperature: randomFloat(15, 35),
		temperature1: randomFloat(15, 35),
		humidity: randomFloat(30, 90),
		humidity1: randomFloat(30, 90),
		pressure: randomFloat(980, 1030),
		luminosity: randomFloat(0, 100000),
		co: randomFloat(0, 10),
		no2: randomFloat(0, 200),
		ambient: randomFloat(20, 80),
		wind_direction: randomInt(0, 359),
		wind_speed: randomFloat(0, 30),
		indice_uv: randomFloat(0, 11),
		battery: randomFloat(0, 100),
		time: new Date().toISOString(),
		description: null,
		createdAt: new Date().toISOString(),
		...overrides
	};
}
