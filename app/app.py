from flask import Flask, render_template, url_for, request, jsonify, session
import requests
from clean_message import Pretreatment
import json
from urllib.parse import unquote # nécessite un PIP install en prod

import datetime # pour générer les timestamps de chatlogs
import uuid # créer des strings aléatoires pour les noms des fichiers de chatlogs
import csv # pour créer les fichiers de chatlogs

message_cleaner = Pretreatment()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ChatbotApplication'

@app.route('/')
def index():
    """Render de l'index et chargement des éventuels historiques de chatlogs"""
    if 'username' in session:
        print("coucou")

        path = "./logs/"+session["random_code"]+".csv"
        historique_chat = []
        try: 
            with open(path, newline='') as csvfile:
                reader = csv.reader(csvfile, delimiter='§')
                for row in reader:
                    historique_chat.append(row)
        except IOError as e: # Si erreur IO, alors le fichier à ce nom n'existe pas et on peut poursuivre
            print("erreur = ", e)
        print("historique = ", historique_chat)
        return render_template('index.html', historique_chat=historique_chat)


    else:
        session['username'] = "user"
        session["random_code"] = str(uuid.uuid4())

        # Le code associé à la session utilisateur doit être libre pour créer un nouveau fichier log avec
        code_libre = False
        while code_libre == False :
            path = "./logs/"+session["random_code"]+".csv"
            try :
                with open(path, "r") as f: # Si pas d'erreur à l'ouverture, c'est qu'il y a déjà un log à ce nom
                    print("fichier déjà pris")
                session["random_code"] = str(uuid.uuid4()) # on régénère le code

            except IOError as e: # Si erreur IO, alors le fichier à ce nom n'existe pas et on peut poursuivre
                code_libre = True

        return render_template('index.html')

@app.route('/pretreatment', methods=['GET','POST'])
def pretreatment():
    """Prétraitement du message utilisateur"""
    if request.method == 'POST':
        message = request.form['jsdata']
        message = unquote(message)

        # Envoi de la réponse du chatbot au chatlog :
        path = "./logs/"+session["random_code"]+".csv"
        with open(path, "a") as f:
            message = message.replace("§","")
            log = str(datetime.datetime.now(tz=None)) + "§" + "utilisateur" + "§" + message
            f.write(log+"\n")

        processed_message = message_cleaner.pretreatment(message)
        return json.dumps(processed_message.tolist())


@app.route('/get_tag', methods=['GET', 'POST'])
def get_tag():
    """Récupération du tag et renvoi de la réponse chatbot associée."""
    if request.method == 'POST':
        output_int = int(request.form['jsdata'])
        print(output_int)
        tag = message_cleaner.inverse_labelencoding(output_int)
        # url = f"http://api:5000/chatbot/get_tag_output_dic?tag={tag}"  #Pour Docker
        url = f"http://localhost:5000/chatbot/get_tag_output_dic?tag={tag}" #Sans Docker 
        output_reponse = requests.get(url).json()['liste_output']
        
        if output_reponse != None :
            message = unquote(output_reponse[0])
            path = "./logs/"+session["random_code"]+".csv"
            with open(path, "a") as f:
                message = message.replace("§","")
                log = str(datetime.datetime.now(tz=None)) + "§" + "chatbot" + "§" + message
                f.write(log+"\n")

        return json.dumps(output_reponse) 


if __name__ == '__main__':
    app.run(port=5002, debug=True)