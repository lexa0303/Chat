/**
 * Created by alex on 29.05.17.
 */

let Message = function(params, lastMessage){
    "use strict";

    if (!params.date){
        params.date = new Date();
    }

    let messages = document.querySelector("#messages");
    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    let li = document.createElement('li');
    li.classList.add("collection-item");
    li.classList.add("avatar");
    let title = document.createElement("span");
    title.innerText = params.author;
    title.classList.add("title");
    li.appendChild(title);
    let text = document.createElement("p");
    text.innerHTML = params.message;
    li.appendChild(text);

    let date = document.createElement("p");
    date.classList.add("secondary-content");
    date.innerHTML = new Date(Date.parse(params.date)).toLocaleString("ru", options);
    li.appendChild(date);

    if (lastMessage) {
        messages.insertBefore(li, lastMessage);
    } else {
        messages.appendChild(li);
    }

    return li;
};

let Chat = function(){
    "use strict";

    let self = this;

    this.socket = io.connect();
    this.messages = [];
    this.newMessages = [];
    this.defaultTitle = document.title;

    this.LoadHistory();

    this.socket.on("message", function(data){
        "use strict";
        self.NewMessage(data);
    });

    setInterval(() => {
        this.CheckNewMessages();
    }, 500);
};

Chat.prototype.NewMessage = function(res){
    "use strict";
    let newMessage = new Message(res, this.lastMessage);
    this.lastMessage = newMessage;

    this.messages.push(newMessage);
    this.newMessages.push(newMessage);
};

Chat.prototype.CheckNewMessages = function(){
    "use strict";

    if (document.hasFocus()){
        this.newMessages = [];
        document.title = this.defaultTitle;
    } else {
        if (this.newMessages.length > 0) {
            if (document.title === this.defaultTitle) {
                document.title = `*${this.newMessages.length}* Новых сообщений`;
            } else {
                document.title = this.defaultTitle;
            }
        }
    }
};

Chat.prototype.LoadHistory = function(){
    "use strict";

    let self = this;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/chat/history", true);

    xhr.onload = function(){
        let res = JSON.parse(this.responseText);

        for (let i = 0, n = res.length; i < n; i++){
            self.NewMessage(res[i]);
        }
    };

    xhr.send("");
};

Chat.prototype.Publish = function(data){
    "use strict";

    let self = this;
    let result = {};

    for(let obj of data){
        result[obj[0]] = obj[1];
    }

    this.socket.emit("message", result);

    result.date = new Date();

    self.NewMessage(result);
};

let chat = new Chat();

if (document.querySelector("#message_form")) {
    document.querySelector("#message_form").addEventListener("submit", function (e) {
        "use strict";
        e.preventDefault();

        let data = new FormData(this);

        chat.Publish(data);

        this.elements.message.value = "";

        return false;
    });
}

if (document.querySelector("#authorize")) {
    document.querySelector("#authorize").addEventListener("submit", function (e) {
        "use strict";
        e.preventDefault();

        let data = new FormData(this);
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "/login", true);

        xhr.onload = function (e) {
            if (xhr.status === 200) {
                location.reload();
            } else {
                Materialize.toast("Error");
            }
        };

        xhr.send(data);
    });
}

document.addEventListener("click", function(e){
    "use strict";
    let target = e.target;

    if (target.id === "logout"){
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", target.href);
        xhr.send("");
    }
});