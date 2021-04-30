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
        }

    else
    {
        popup.classList.toggle('show'); // Si la classe show n'était pas présente, on affiche le popup de chat
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

                    chatArea.insertAdjacentHTML("beforeend", temp); // Ajout du message à la fin des messages existants

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
})
// 2ème cas, écoute de la touche entrée :
inputArea.addEventListener("keyup", ({key}) => {
    // On vérifie que la variable key passée dans la fonction
    // fléchée du listener correspond à la touche entrée :
    if (key === "Enter") {
        sendMessage();
    }
})



