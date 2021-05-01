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
        

if __name__ == '__main__':
    app.run(port=5001, debug=True)



