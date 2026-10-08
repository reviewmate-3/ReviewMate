from groq import AsyncGroq

from app.ai.base import AIProvider, SYSTEM_PROMPT, build_review_prompt
from app.config import settings


class GroqProvider(AIProvider):
    async def generate_review(self, business_context: dict, service: str, rating: int, feedback: str) -> str:
        if not settings.GROQ_API_KEY:
            raise RuntimeError('GROQ_API_KEY is not configured for the selected AI provider.')

        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            temperature=0.2,
            max_tokens=180,
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': build_review_prompt(business_context, service, rating, feedback)},
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise RuntimeError('The AI provider returned an empty review.')
        return content.strip()
