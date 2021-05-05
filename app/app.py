from flask import Flask, render_template, url_for, request, session
import requests
import random
import datetime

# EN PRODUCTION : PIP INSTALL UNQUOTE
from urllib.parse import unquote

import json

import uuid # créer des strings aléatoires pour les noms des fichiers de chatlogs

import csv

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ChatbotApplication'

@app.route('/', methods=["GET"])
def index():
    if 'username' in session:
        print("coucou")

        path = "./logs/"+session["random_code"]+".csv"
        historique_chat = []
        with open(path, newline='') as csvfile:
            try: 
                reader = csv.reader(csvfile, delimiter='§')
                for row in reader:
                    historique_chat.append(row)
            except IOError as e: # Si erreur IO, alors le fichier à ce nom n'existe pas et on peut poursuivre
                print("pas de fichier d'historique")

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

@app.route('/get_message', methods=["GET","POST"])
def get_message():
    if request.method == 'POST':
        message = request.form['jsdata']

    path = "./logs/"+session["random_code"]+".csv"
    with open(path, "a") as f:
        message = message.replace("§","")
        log = str(datetime.datetime.now(tz=None)) + "§" + "utilisateur" + "§" + message
        f.write(log+"\n")

        print(message)
        message = unquote(message)

        return json.dumps(message)


@app.route('/get_response', methods=["GET","POST"])
def get_response():
    """Récupère depuis l'ajax du main.js"""
    if request.method == 'POST':
        message = request.form['jsdata']

    path = "./logs/"+session["random_code"]+".csv"
    with open(path, "a") as f:
        message = message.replace("§","")
        log = str(datetime.datetime.now(tz=None)) + "§" + "chatbot" + "§" + message
        f.write(log+"\n")

        print(message)
        message = unquote(message)

        return json.dumps(message)





if __name__ == '__main__':
    app.run(port=5001, debug=True)