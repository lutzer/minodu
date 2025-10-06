import os
import sys
import logging
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain_chroma import Chroma
from typing import Iterator
import textwrap
from dataclasses import dataclass, asdict

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

class WeatherLLM:

    @dataclass
    class SensorData:
        temperature: float
        humidity: float
        pressure: float
        luminosity = float
        ambient_luminosity = float
        carbon_monoxide = float
        nitrogen_dioxide = float

    def __init__(self, language="en"):

        self.language = 0 if language == "en" else 1

        ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434/")

        self.llm = OllamaLLM(base_url=ollama_host, model="llama3.2:1b", temperature=0.1, keep_alive=600 )

        # Determine the season based on the current month (Kara, Togo)
        current_month = datetime.now().month
        season = {}

        # Logic to determine the season
        if 4 <= current_month <= 10:
            # Rainy Season (April to October)
            season["fr"] = "saison des pluies"
            season["en"] = "rainy season"
        else:
            # Dry Season (November to March)
            season["fr"] = "saison sèche"
            season["en"] = "dry season"
        
        # Simple chaine
        if language == "en":
            season_en = season['en'];
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
                Current Season : {season_en}

                Provide a single, simple English paragraph presenting the current weather conditions, the rainfall outlook (if relevant), air quality information (if available), and the implications for local plants and crops. Ensure your analysis considers the current season.
                """)
        else:
            season_fr = season['fr']
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
                Saison actuelle : {season_fr}

                Fournis en un seul paragraphe en français simple exposant les conditions météo actuelles, les prévisions de pluie (si pertinentes), les informations sur la pollution (si disponibles), et les implications pour les plantes et les cultures. Tiens compte de la saison actuelle lors de ton analyse.            
            """)
        
        self.prompt = ChatPromptTemplate.from_template(self.template)
        
        # Create the chain
        self.chain = (
            RunnableParallel({
                "temperature": lambda x: x["temperature"], 
                "humidity": lambda x: x["humidity"]
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

