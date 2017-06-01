/**
 * Created by alex on 29.05.17.
 */

let Message = function(params, lastMessage){
    "use strict";

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
    this.messages = [];
    this.newMessages = [];
    this.defaultTitle = document.title;

    this.LoadHistory();
    this.Subscribe();

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

Chat.prototype.Subscribe = function(){
    "use strict";

    let self = this;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "/chat/subscribe", true);

    xhr.onload = function() {
        let res = JSON.parse(this.responseText);
        self.NewMessage(res);
        self.Subscribe();
    };

    xhr.onerror = xhr.onabort = () => {
        setTimeout(function(){
            self.Subscribe()
        }, 500);
    };

    xhr.send("");
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

let chat = new Chat();

if (document.querySelector("#message_form")) {
    document.querySelector("#message_form").addEventListener("submit", function (e) {
        "use strict";
        e.preventDefault();

        let data = new FormData(this);
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "/chat/publish", true);

        xhr.send(data);

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
                try {
                    // let result = JSON.parse(this.responseText);
                    // if (result.status === "ok"){
                    //     location.reload();
                    // }
                } catch (err) {
                    console.log(err);
                }
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