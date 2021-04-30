from flask import Flask, render_template, url_for, request
import requests


import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ChatbotApplication'

@app.route('/', methods=["GET"])
def index():
    return render_template('index.html')

@app.route('/get_message', methods=["GET","POST"])
def get_message():
    if request.method == 'POST':
        message = request.form['jsdata']
        print(message)
        
        return json.dumps(message)
        # return render_template('index.html', message='')



if __name__ == '__main__':
    app.run(port=5001, debug=True)