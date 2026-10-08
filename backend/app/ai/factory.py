from app.ai.groq_provider import GroqProvider
from app.ai.openai_provider import OpenAIProvider
from app.config import settings


class LocalProvider:
    """Deterministic provider for tests only; never use this in production."""

    async def generate_review(self, business_context: dict, service: str, rating: int, feedback: str) -> str:
        return ' '.join(feedback.strip().split())


class AIProviderFactory:
    @staticmethod
    def get_provider():
        provider_name = (settings.AI_PROVIDER or 'openai').lower()
        if provider_name == 'groq':
            return GroqProvider()
        if provider_name == 'local':
            return LocalProvider()
        return OpenAIProvider()
