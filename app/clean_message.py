import json
import pandas as pd
from nltk.stem.snowball import FrenchStemmer, EnglishStemmer
from langdetect import detect
import unicodedata

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import pickle

import matplotlib.pyplot as plt
import random
import numpy as np

class Pretreatment:
    def __init__(self):
        self.tokenizer = self.load_tokenizer()
        self.label_encoder = self.load_labelencoder()

    def load_tokenizer(self):
        with open('tokenizer.pickle', 'rb') as handle:
            tokenizer = pickle.load(handle)
        return tokenizer
    
    def load_labelencoder(self):
        with open('labelencoder.pickle', 'rb') as handle:
            le = pickle.load(handle)
        return le

    def inverse_labelencoding(self, argmax_prediction):
        tag = self.label_encoder.inverse_transform([argmax_prediction])[0]
        return tag


    def remove_accents(self, input_str):
        nfkd_form = unicodedata.normalize('NFKD', input_str)
        only_ascii = nfkd_form.encode('ASCII', 'ignore')
        return str(only_ascii)[2:-1]

    def treatment(self, text):
        #vérifier si c'est une question
        if text[-1] == "?":
            question = "?"
        else:
            question = "0"
            
        #vérifier la langue
        if detect(text) == "fr":
            language = "francais"
        elif detect(text) == "en":
            language = "anglais"
        else:
            language = "francais"
        
        #segmenter le texte et traiter chaque mot et chaque lettre
        text = text.split()
        words_list = []
        for word in text:
            letters_list = []
            for character in word:
                #vérifier que le caractère est une lettre
                if character.isalpha():
                    #rajouter à la liste en minuscule
                    letters_list.append(character.lower())
                else:
                    letters_list.append(" ")
            word = "".join(letters_list)
            
            #appliquer le stemming suivant la langue
            for word1 in word.split():
                if language == "fr":
                    word1 = EnglishStemmer().stem(word1)
                else:
                    word1 = FrenchStemmer().stem(word1)
                #enlever les accents
                word1 = self.remove_accents(word1)
                words_list.append(word1)
                
        text = " ".join(words_list)
        return " ".join([text, question, language])

    def pretreatment(self, message):
        texts_p = []
        #removing punctuation and converting to lowercase
        prediction_input = self.treatment(message)
        texts_p.append(prediction_input)

        #tokenizing and padding
        prediction_input = self.tokenizer.texts_to_sequences(texts_p)
        prediction_input = np.array(prediction_input).reshape(-1)
        prediction_input = pad_sequences([prediction_input],18)
        return prediction_input

#test = Pretreatment()
# mess = "Bonjour, je voudrai des informations"
# print(test.pretreatment(mess))
#print(test.inverse_labelencoding(11))