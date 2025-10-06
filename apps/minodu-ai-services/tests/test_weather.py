import pytest
from fastapi.testclient import TestClient
import os

from minodu_ai_services.src.app import app
from minodu_ai_services.src.weather.llm import WeatherLLM

# Create test client
client = TestClient(app)

class TestWeatherAPI:


    def test_generate_weather_test(self):
        llm = WeatherLLM(language="en")

        data = WeatherLLM.SensorData(
            temperature= 20.0,
            humidity = 0.8,
            pressure = 10,
            luminosity = 10,
            ambient_luminosity = 10,
            carbon_monoxide = 0.5,
            nitrogen_dioxide = 0.2
        )

        result = llm.ask(data)

        assert len(result) > 1

    def test_weather_text(self):
        test_data = {
            "language": "en",
            "sensor_data" : {
                "temperature": 20,
                "humidity": 0.5,
                "pressure" : 1.2,
                "luminosity" : 500,
                "ambient_luminosity" : 0.5,
                "carbon_monoxide" : 0.5,
                "nitrogen_dioxide" : 0.8
            }
        }
        response = client.post(app.root_path + "/weather/text", json=test_data)        
        assert response.status_code == 200
        assert len(response.text) > 0
