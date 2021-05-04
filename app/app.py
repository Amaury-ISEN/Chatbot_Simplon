from flask import Flask, render_template, url_for, request, jsonify
import requests
from clean_message import Pretreatment
import json
from urllib.parse import unquote

message_cleaner = Pretreatment()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ChatbotApplication'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pretreatment', methods=['GET','POST'])
def pretreatment():
    if request.method == 'POST':
        message = request.form['jsdata']
        message = unquote(message)
        processed_message = message_cleaner.pretreatment(message)
        return json.dumps(processed_message.tolist())

@app.route('/get_tag', methods=['GET', 'POST'])
def get_tag():
    if request.method == 'POST':
        output_int = int(request.form['jsdata'])
        print(output_int)
        tag = message_cleaner.inverse_labelencoding(output_int)
        url = f"http://api:5000/chatbot/get_tag_output_dic?tag={tag}"  #Pour Docker
        # url = f"http://localhost:5000/chatbot/get_tag_output_dic?tag={tag}" #Sans Docker 
        output_reponse = requests.get(url).json()['liste_output']
        return json.dumps(output_reponse)        

if __name__ == '__main__':
    app.run(port=5001, debug=True)



