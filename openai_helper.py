import openai
from api_secrets import API_KEY_OPENAI

openai.api_key = API_KEY_OPENAI

def ask_computer(prompt):
    response = openai.Completion.create(
        #Candice
    )