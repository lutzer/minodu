import pytest

from minodu_ai_services.src.prompts import PromptLoader
from minodu_ai_services.src.vars import LanguageEnum


class TestPromptLoader:
    """Tests for the PromptLoader class."""

    def test_singleton_pattern(self):
        """Test that PromptLoader follows singleton pattern."""
        loader1 = PromptLoader()
        loader2 = PromptLoader()
        assert loader1 is loader2

    def test_load_english_rag_ask_template(self):
        """Test loading the English RAG ask template."""
        loader = PromptLoader()
        prompt = loader.get("rag", "ask_template", LanguageEnum.en)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "{context}" in prompt
        assert "{history}" in prompt
        assert "{question}" in prompt

    def test_load_english_rag_welcome_static(self):
        """Test loading the English RAG static welcome message."""
        loader = PromptLoader()
        prompt = loader.get("rag", "welcome_static", LanguageEnum.en)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "farming" in prompt.lower()

    def test_load_english_rag_welcome_dynamic(self):
        """Test loading the English RAG dynamic welcome template."""
        loader = PromptLoader()
        prompt = loader.get("rag", "welcome_dynamic", LanguageEnum.en)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "{summary}" in prompt

    def test_load_english_summarizer_template(self):
        """Test loading the English summarizer template."""
        loader = PromptLoader()
        prompt = loader.get("summarizer", "template", LanguageEnum.en)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "{content}" in prompt

    def test_load_french_rag_ask_template(self):
        """Test loading the French RAG ask template."""
        loader = PromptLoader()
        prompt = loader.get("rag", "ask_template", LanguageEnum.fr)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "{context}" in prompt
        assert "{history}" in prompt
        assert "{question}" in prompt

    def test_load_french_summarizer_template(self):
        """Test loading the French summarizer template."""
        loader = PromptLoader()
        prompt = loader.get("summarizer", "template", LanguageEnum.fr)

        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "{content}" in prompt

    def test_invalid_service_raises_key_error(self):
        """Test that requesting an invalid service raises KeyError."""
        loader = PromptLoader()

        with pytest.raises(KeyError) as exc_info:
            loader.get("nonexistent_service", "template", LanguageEnum.en)

        assert "nonexistent_service" in str(exc_info.value)

    def test_invalid_key_raises_key_error(self):
        """Test that requesting an invalid key raises KeyError."""
        loader = PromptLoader()

        with pytest.raises(KeyError) as exc_info:
            loader.get("rag", "nonexistent_key", LanguageEnum.en)

        assert "nonexistent_key" in str(exc_info.value)

    def test_prompts_are_cached(self):
        """Test that prompts are cached after first load."""
        loader = PromptLoader()
        loader._prompts.clear()

        loader.get("rag", "ask_template", LanguageEnum.en)
        assert "en" in loader._prompts

        loader.get("rag", "ask_template", LanguageEnum.fr)
        assert "fr" in loader._prompts

    def test_all_english_prompts_have_french_equivalents(self):
        """Test that all English prompts have French equivalents."""
        loader = PromptLoader()

        en_prompts = loader._load_prompts(LanguageEnum.en)
        fr_prompts = loader._load_prompts(LanguageEnum.fr)

        for service in en_prompts:
            assert service in fr_prompts, f"Service '{service}' missing in French prompts"
            for key in en_prompts[service]:
                assert key in fr_prompts[service], (
                    f"Key '{key}' missing in French prompts for service '{service}'"
                )
