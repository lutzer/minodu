import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {

LOCAL_LLM_URL = 'http://localhost:3000';

client = axios.create({baseURL: this.LOCAL_LLM_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

  constructor() { }

  async interpretWeather(weatherData: String) {
    try {
    const response = await this.client.post('/weather', {
      weather: weatherData,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing with LLM:', error);
    throw error;
  }
    
  }
}
