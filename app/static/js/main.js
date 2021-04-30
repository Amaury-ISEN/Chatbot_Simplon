// variables pour le toggle du chat :
const popup = document.querySelector(".chat-popup");
const chatBtn = document.querySelector(".chat-btn");
// variable pour l'envoi de messages :
const submitBtn = document.querySelector(".submit");
const chatArea = document.querySelector(".chat-area");
const inputElm = document.querySelector("input");
const inputArea = document.querySelector(".input-area");
// variables pour le système d'emojis :
const emojiBtn = document.querySelector('#emoji-btn');
const picker = new EmojiButton();


// Ce type de structures : () => {}
// correspond à des arrow functions ES6
// Il s'agit de fonctions js à la syntaxe simplifiée
// "()" veut dire que la fonction fléchée est anonyme

// Sélection d'Emojis : 
picker.on('emoji', selectedEmoji => {
    // On ajoute l'emoji choisi à l'input de la zone de saisie
    document.querySelector('input').value += selectedEmoji;
});

emojiBtn.addEventListener('click', () => {
    // On affiche le sélecteur d'emoji quand l'utilisateur clique sur le bouton
    picker.togglePicker(emojiBtn);
});

// Affichage du chat avec le bouton :
chatBtn.addEventListener('click', ()=>{
    popup.classList.toggle('show');
})

function sendMessage(){
    let userInput = inputElm.value;
    console.log(userInput)

    if (userInput.length == 0) // si la zone de saisie est vide
        {

        }
    else
        {
            let temp = `<div class="out-msg">
            <span class="my-msg">${userInput}</span>
            <img src="img/user.png" class="avatar">
            </div>`;
        
            chatArea.insertAdjacentHTML("beforeend", temp);
            inputElm.value=""; //vidage de la zone de saisie après envoi        
        }
}

// Envoi de messages au chat :
// 1er cas, écoute du clic :
submitBtn.addEventListener('click', ()=>{
    sendMessage();
})
// 2ème cas, écoute de la touche entrée :
inputArea.addEventListener("keyup", ({key}) => {
    // On vérifie que la variable key passée dans la fonction
    // fléchée du listener correspond à la touche entrée :
    if (key === "Enter") {
        sendMessage();
    }
})


let model;

const modelURL = 'http://localhost:5000/chatbot/model';

async function loadModel() {
    // model = await tf.models.modelFromJSON(modelURL)
    model = await tf.loadLayersModel(modelURL)
    console.log('Modèle Chargé')
    predic_test = model.predict('Hello')
    console.log(predic_test)
}
loadModel()

