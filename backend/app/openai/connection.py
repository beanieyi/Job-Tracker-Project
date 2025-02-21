from openai import OpenAI
from app.config import settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def get_response():
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": "Write a haiku about recursion in programming."
            }
        ]
    )
    print(completion.choices[0].message)
