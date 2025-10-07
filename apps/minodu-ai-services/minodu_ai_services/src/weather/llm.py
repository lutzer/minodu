from datetime import datetime
import os
import sys
import logging
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from typing import Iterator
import textwrap
from dataclasses import dataclass, asdict
import langchain

# At the top of your file or in __init__

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

class WeatherLLM:

    @dataclass
    class SensorData:
        temperature: float
        humidity: float
        pressure: float
        luminosity: float
        ambient_luminosity: float
        carbon_monoxide: float
        nitrogen_dioxide: float

    def __init__(self, language="en"):

        # langchain.debug = True

        self.language = 0 if language == "en" else 1

        ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434/")
        ollama_model = os.environ.get("OLLAMA_MODEL", "llama3.2:1b")

        self.llm = OllamaLLM(base_url=ollama_host, model=ollama_model, temperature=0.1, keep_alive=600 )

        # Determine the season based on the current month (Kara, Togo)
        current_month = datetime.now().month
        season = {}

        def get_season():
        # Logic to determine the season
            if 4 <= current_month <= 10:
                # Rainy Season (April to October)
                return "saison des pluies" if language == "fr" else "rainy season"
            else:
                # Dry Season (November to March)
                return  "saison sèche" if language == "fr" else "dry season"
        
        # Simple chaine
        if language == "en":
            self.template = textwrap.dedent("""
                Act as a meteorological expert. Analyze and interpret the raw data from a weather station located in Kara, Northern Togo, for local farmers.

                The raw data is as follows:
                Current Temperature: {temperature}°C
                Relative Humidity: {humidity}%
                Atmospheric Pressure: {pressure} hPa
                Luminosity: {luminosity} lux
                Ambient Luminosity: {ambient_luminosity}
                Carbon Monoxide (CO): {carbon_monoxide}
                Nitrogen Dioxide (NO2): {nitrogen_dioxide}
                Current Season : {season}

                Provide a single, simple English paragraph presenting the current weather conditions, the rainfall outlook (if relevant), air quality information (if available), and the implications for local plants and crops. Ensure your analysis considers the current season.
                """)
        else:
            self.template = textwrap.dedent("""
                Agis en tant qu'expert en météorologie. Analyse et interprète les données brutes d'une station météo de Kara, au nord du Togo, pour des agriculteurs.
                                            
                Les données brutes sont les suivantes :
                Température actuelle : {temperature}°C
                Humidité relative : {humidity}%
                Pression atmosphérique: {pressure} hPa
                Luminosité: {luminosity} lux
                Luminosité ambiante: {ambient_luminosity}
                Monoxyde de carbone (CO): {carbon_monoxide}
                Dioxyde d'azote (NO2): {nitrogen_dioxide}
                Saison actuelle : {season}

                Fournis en un seul paragraphe en français simple exposant les conditions météo actuelles, les prévisions de pluie (si pertinentes), les informations sur la pollution (si disponibles), et les implications pour les plantes et les cultures. Tiens compte de la saison actuelle lors de ton analyse.            
            """)
        
        self.prompt = ChatPromptTemplate.from_template(self.template)
        
        # Create the chain
        self.chain = (
            RunnableParallel({
                "temperature": lambda x: x["temperature"], 
                "humidity": lambda x: x["humidity"],
                "pressure": lambda x: x["pressure"],
                "luminosity": lambda x: x["luminosity"],
                "ambient_luminosity": lambda x: x["ambient_luminosity"],
                "carbon_monoxide": lambda x: x["carbon_monoxide"],
                "nitrogen_dioxide": lambda x: x["nitrogen_dioxide"],
                "season": lambda x: get_season()
            })
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
    
    def ask(self, sensorData : SensorData) -> str:
        return self.chain.invoke(asdict(sensorData))
    
    def ask_streaming(self, sensorData : SensorData) -> Iterator[str]:
        for chunk in self.chain.stream(asdict(sensorData)):
            yield chunk

