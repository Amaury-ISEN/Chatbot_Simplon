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

    if (popup.classList.contains('show')) // Si la classe show est présente dans les classes de l'élément popup
        {
            popup.classList.toggle("animate__fadeOutDown"); // alors le popup était déjà ouvert et on le ferme
            autoFocus();
        }

    else
    {
        popup.classList.toggle('show'); // Si la classe show n'était pas présente, on affiche le popup de chat
        autoFocus();
        scrollToBottom();
    }

})

function sendMessage(){
    let userInput = inputElm.value;
    console.log(userInput)

    if (userInput.length == 0) // si la zone de saisie est vide
        {
            // on envoie rien
        }
    else
        {
            // On crée un élément html correspondant au message écrit par l'utilisateur 
            let temp = `<div class="out-msg">
            <span class="my-msg">${userInput}</span>
            <img src=${avatarUser} class="avatar">
            </div>`;

            // on récupère le modèle sur l'API :
            const modelURL = 'http://localhost:5000/chatbot/model';

            // On crée une fonction pour récupérer la réponse du chatbot via le modèle
            async function loadModel(reponse) {

                let temp = `<div class="income-msg is-typing">
                <img class="avatar" src="${avatarBot}" alt="avatar du chatbot">
                <span class="msg typing">
                ...
                </span>
                </div>`
                chatArea.insertAdjacentHTML("beforeend", temp)
                scrollToBottom()

                reponse = tf.tensor(reponse);
                console.log(reponse.dataSync());
                // const model = await tf.loadGraphModel(modelURL);
                const model = await tf.loadLayersModel(modelURL);
                console.log('Modèle Chargé')

                // let prediction = await model.executeAsync(reponse)
                let prediction = model.predict(reponse);
                let label = prediction.argMax(axis = 1).dataSync()[0];
                console.log('Prédiction :', label);
                // let probabilities = tf.softmax(prediction).dataSync();

                $.ajax({
                    url:"/get_tag", 
                    data: {jsdata: label}, 
                    type:"POST", 
                    dataType : 'json',
                    success: function(reponse){
                        $('.is-typing').remove();
                        let temp = `<div class="income-msg">
                                    <img class="avatar" src="${avatarBot}" alt="avatar du chatbot">
                                    <span class="msg">
                                    ${reponse}
                                    </span>
                                    </div>`
                        chatArea.insertAdjacentHTML("beforeend", temp)
                        scrollToBottom();
                    }
                })
            }

            $.ajax({
                url:"/pretreatment", 
                data: {jsdata: userInput}, 
                type:"POST", 
                dataType : 'json', 
                success: function(reponse){
                    loadModel(reponse);
                }
            })
            chatArea.insertAdjacentHTML("beforeend", temp);
            scrollToBottom();
            inputElm.value=""; //vidage de la zone de saisie après envoi        
        }
}

// Envoi de messages au chat :
// 1er cas, écoute du clic :
submitBtn.addEventListener('click', ()=>{
    sendMessage();
    scrollToBottom();
})
// 2ème cas, écoute de la touche entrée :
inputArea.addEventListener("keyup", ({key}) => {
    // On vérifie que la variable key passée dans la fonction
    // fléchée du listener correspond à la touche entrée :
    if (key === "Enter") {
        sendMessage();
        scrollToBottom();
    }
})



// Command to convert model
// tensorflowjs_converter --input_format=keras --output_format=tfjs_layers_model ./chemin_vers_le_model/model.h5 ./nom_dossier_ou_enregistrer_le_model_js

// tensorflowjs_converter --input_format=tf_saved_model ./model_keras/model_3 ./model_3_js





// Défilement automatique vers le bas du chat (fonction appelée en cas de nouveaux messages).
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
    // scrollHeight est la hauteur totale du contenu, scrollTop le nombre de pixels défilés,
    // équivaloir les deux nous amène tout en bas du contenu
  }

// Focus sur la zone de saisie quand on ouvre le chat, pour éviter à l'utilisateur de devoir cliquer dedans
function autoFocus() {
    inputElm.focus();
}


// En cas de refresh/nouvelle visite de la page, réinjection dans la popup de l'historique de chat s'il existe :
reinjection_messages(messages = historique)

function reinjection_messages(messages){
    console.log(typeof(messages[0]))
    messages.forEach(function (element, index){
        console.log(element, index)
        if (element[1] == "chatbot"){

            let temp = `<div class="income-msg">
            <img class="avatar" src="${avatarBot}" alt="avatar du chatbot">
            <span class="msg">
            ${element[2]}
            </span>
            </div>`
            chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants
        }

        else {
            let temp = `<div class="out-msg">
            <span class="my-msg">
            ${element[2]}
            </span>
            <img class="avatar" src="${avatarUser}" alt="avatar de l'utilisateur">
            </div>`
            chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants
        }

    });
}