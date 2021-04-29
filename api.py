from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import uvicorn
from connecteur import Connecteur

api = FastAPI()

#Récupère toute la data de la base
@api.get('/chatbot/get_all_data')
async def get_all_data():
    data = Connecteur.get_all_data()
    return jsonable_encoder(data)

#Récupère un document en fonction du tag
@api.get('/chatbot/get_data')
async def get_data(tag: str=None):
    data = Connecteur.get_data(tag)
    return jsonable_encoder(data)

#Si upload=False insère un nouveau document doc avec un nouveau tag
#Si upload=True ajoute un ou plusieurs nouveaux input et output (variables de type liste) au document avec le tag désiré
@api.post('/chatbot/post_data')
async def insert_data(tag: str=None, input_bot: list=None, ouput_bot: list=None, upload: bool=True):
    if upload==True:
        response = Connecteur.add_data(tag, input_bot, ouput_bot)
    else:
        response = Connecteur.insert_data(tag, input_bot, ouput_bot)
    return jsonable_encoder(response)

if __name__ == '__main__':
    uvicorn.run('api:api', host="127.0.0.1", port=5000, reload=True)