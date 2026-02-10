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

from ..vars import LanguageEnum

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

    def __init__(self, language : LanguageEnum):

        langchain.debug = True

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
                match language:
                    case LanguageEnum.fr:
                        return "saison des pluies"
                    case LanguageEnum.en:
                        return "rainy season"
            else:
                # Dry Season (November to March)
                match language:
                    case LanguageEnum.fr:
                        return  "saison sèche" 
                    case LanguageEnum.en:
                        return "dry season"
        
        # Simple chaine
        if language == LanguageEnum.en:
            self.template = textwrap.dedent("""
                Act as a meteorological expert advising farmers in Kara, northern Togo.
                Analyze the data below, taking the current season ({season}) into account.

                **Station Data:**
                - Temperature: {temperature}°C
                - Relative Humidity: {humidity}%
                - Atmospheric Pressure: {pressure} hPa
                - Luminosity: {luminosity} lux
                - Carbon Monoxide (CO): {carbon_monoxide}
                - Nitrogen Dioxide (NO2): {nitrogen_dioxide}

                **Response Instructions:**
                1. Summarize in ONE SINGLE paragraph in simple, natural English.
                2. Describe current conditions, rain risks, air quality (if relevant), and impact on crops.
                3. **Do not quote any raw numbers** from the data.
                4. Limit your response to **100 words maximum**.
                5. Tailor your analysis to the current season ({season}).
                """)
        elif language == LanguageEnum.fr:
            self.template = textwrap.dedent("""
                Agis en tant qu'expert météorologue conseillant des agriculteurs à Kara, au nord du Togo.
                Analyse les données ci-dessous en tenant compte de la saison actuelle ({season}).

                **Données de la station :**
                - Température : {temperature}°C
                - Humidité relative : {humidity}%
                - Pression atmosphérique : {pressure} hPa
                - Luminosité : {luminosity} lux
                - Monoxyde de carbone (CO) : {carbon_monoxide}
                - Dioxyde d'azote (NO2) : {nitrogen_dioxide}

                **Consignes de réponse :**
                1. Résume en UN SEUL paragraphe en français simple et naturel.
                2. Décris les conditions actuelles, les risques de pluie, la qualité de l'air (si pertinent), et l'impact sur les cultures.
                3. **Ne cite aucun chiffre** des données brutes.
                4. Limite ta réponse à **100 mots maximum**.
                5. Adapte ton analyse à la saison ({season}).           
            """)
        
        self.prompt = ChatPromptTemplate.from_template(self.template)
        
        # Create the chain
        self.chain = (
            RunnablePassthrough().assign(
                season = lambda _: get_season()
            )
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
    
    def ask(self, sensorData : SensorData) -> str:
        return self.chain.invoke(asdict(sensorData))
    
    def ask_streaming(self, sensorData : SensorData) -> Iterator[str]:
        for chunk in self.chain.stream(asdict(sensorData)):
            yield chunk

