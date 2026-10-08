from abc import ABC, abstractmethod


class AIProvider(ABC):
    @abstractmethod
    async def generate_review(self, business_context: dict, service: str, rating: int, feedback: str) -> str:
        raise NotImplementedError


SYSTEM_PROMPT = """You are ReviewMate, a customer-feedback writing assistant.

Rewrite only the customer's supplied experience into a concise, natural review.
Never invent facts, prices, staff names, repair times, guarantees, services,
product details, locations, discounts, or quality claims. Preserve the
customer's meaning and rating-neutral wording. Do not add advertising claims,
keyword stuffing, or instructions about what rating to give. Return only the
rewritten review text. If the feedback is vague, make only a light grammar and
clarity improvement without adding information.
"""


def build_review_prompt(business_context: dict, service: str, rating: int, feedback: str) -> str:
    return (
        f"Business name: {business_context.get('business_name', '')}\n"
        f"Business category: {business_context.get('category', '')}\n"
        f"Service named by customer: {service.strip()}\n"
        f"Customer rating: {rating}\n"
        f"Customer's actual feedback:\n{feedback.strip()}"
    )
