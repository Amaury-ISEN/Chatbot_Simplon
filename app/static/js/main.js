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

        }
    else
        {
            // Formatage de l'input avec les balises HTML correctes :
            let temp = `<div class="out-msg">
            <span class="my-msg"><div class = "arrow"></div>${userInput}</span>
            <img src=${avatarUser} class="avatar">
            </div>`;
        
            $.ajax({
                url: "/get_message",
                type: "post",
                data: {jsdata: userInput},
                success: function(response) {
                    let temp = `<div class="income-msg">
                                <img class="avatar" src="${avatarBot}" alt="avatar du chatbot">
                                <span class="msg">
                                ${response}
                                </span>
                                </div>`
                    get_response(response);
                    chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants
                    scrollToBottom();
                },
                error: function(xhr) {
                  //Do Something to handle error
                }
              });

            chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants
            inputElm.value=""; // Vidage de la zone de saisie après envoi
        

            

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

// Fonction de récupération de la réponse du chatbot pour consigne en log
function get_response(response) {
    $.ajax({
        url: "/get_response",
        type: "post",
        data: {jsdata: response},
        success: function(response) {

        },
        error: function() {
          //Do Something to handle error
        }
      });
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
            <img class="avatar" src="${avatarUser}" alt="avatar de l'utilisateur">
            <span class="my-msg">
            ${element[2]}
            </span>
            </div>`
            chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants
        }

    });
}