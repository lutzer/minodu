import os
from typing import Optional

import yaml

from ..vars import LanguageEnum


class PromptLoader:
    """Singleton class to load and cache prompts from YAML files."""

    _instance: Optional["PromptLoader"] = None
    _prompts: dict[str, dict] = {}

    def __new__(cls) -> "PromptLoader":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def _load_prompts(self, language: LanguageEnum) -> dict:
        """Load prompts from YAML file for a given language."""
        lang_key = language.value
        if lang_key in self._prompts:
            return self._prompts[lang_key]

        prompts_dir = os.path.dirname(os.path.abspath(__file__))
        yaml_path = os.path.join(prompts_dir, f"{lang_key}.yaml")

        if not os.path.exists(yaml_path):
            if language != LanguageEnum.en:
                return self._load_prompts(LanguageEnum.en)
            raise FileNotFoundError(f"Prompt file not found: {yaml_path}")

        with open(yaml_path, encoding="utf-8") as f:
            prompts = yaml.safe_load(f)

        self._prompts[lang_key] = prompts
        return prompts

    def get(self, service: str, key: str, language: LanguageEnum) -> str:
        """Get a prompt template for a given service, key, and language.

        Args:
            service: The service name (e.g., 'rag', 'summarizer')
            key: The prompt key (e.g., 'ask_template', 'welcome_static')
            language: The language enum

        Returns:
            The prompt template string

        Raises:
            KeyError: If the service or key is not found
        """
        prompts = self._load_prompts(language)

        if service not in prompts:
            if language != LanguageEnum.en:
                return self.get(service, key, LanguageEnum.en)
            raise KeyError(f"Service '{service}' not found in prompts")

        if key not in prompts[service]:
            if language != LanguageEnum.en:
                return self.get(service, key, LanguageEnum.en)
            raise KeyError(f"Key '{key}' not found in service '{service}'")

        return prompts[service][key]
