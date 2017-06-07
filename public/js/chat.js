/**
 * Created by alex on 02.06.17.
 */

let Message = function(params, messages, lastMessage, toEnd){
    "use strict";

    if (toEnd === undefined){
        toEnd = false;
    }

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

    if (lastMessage && !toEnd) {
        messages.insertBefore(li, lastMessage);
    } else {
        messages.appendChild(li);
    }

    return li;
};
let SystemMessage = function(params, messages, lastMessage, toEnd){
    "use strict";

    if (toEnd === undefined){
        toEnd = false;
    }

    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    let li = document.createElement('li');
    li.classList.add("collection-item");
    let text = document.createElement("span");
    text.innerHTML = params.message;
    li.appendChild(text);

    let date = document.createElement("span");
    date.classList.add("secondary-content");
    date.innerHTML = new Date(Date.parse(params.date)).toLocaleString("ru", options);
    li.appendChild(date);

    if (lastMessage && !toEnd) {
        messages.insertBefore(li, lastMessage);
    } else {
        messages.appendChild(li);
    }

    return li;
};
let DateMessage = function(params, messages, lastMessage, toEnd){
    "use strict";

    if (toEnd === undefined){
        toEnd = false;
    }

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    };

    let li = document.createElement('li');
    li.classList.add("collection-item");
    li.classList.add("date");
    let text = document.createElement("span");
    text.innerHTML = params.date.toLocaleString("ru", options);
    li.appendChild(text);

    if (lastMessage && !toEnd) {
        messages.insertBefore(li, lastMessage);
    } else {
        messages.appendChild(li);
    }

    return li;
};
let Chat = function(){
    "use strict";

    let self = this;

    self.socket = io.connect();
    self.messages = [];
    self.newMessages = [];
    self.defaultTitle = document.title;
    self.wrapper = document.querySelector("#messages");
    self.loader = document.querySelector("#history_loader");
    self.form = document.querySelector("#message_form");
    self.message_input = document.querySelector("#message");

    self.LoadHistory();

    self.socket.on("message", function(data){
        "use strict";
        self.NewMessage(data);
    });

    self.socket.on("join", function(data){
        let message = `${data.user} входит в чат`;
        self.NewMessage({message: message, date: data.date}, true);
    });

    self.socket.on("leave", function(data){
        let message = `${data.user} выходит из чата`;
        self.NewMessage({message: message, date: data.date}, true);
    });

    self.socket.on("error", function(data){
        Materialize.toast(data);
    });

    self.socket.on("stickers", function(data){
        console.log(data);
    });

    document.addEventListener("scroll", function(e){
        if ((document.body.clientHeight - window.innerHeight - 500) < document.body.scrollTop){
            if (!self.historyLoading) {
                self.LoadHistory();
            }
        }
    });

    document.addEventListener("click", function(e){
        let target = e.target;

        if (target.classList.contains("js-emoji")){
            self.message_input.value = self.message_input.value + target.dataset.value;
        }
    });

    self.form.addEventListener("submit", function (e) {
        "use strict";
        e.preventDefault();
        let data = new FormData(this);

        chat.Publish(data);

        this.elements.message.value = "";
        return false;
    });

    setInterval(() => {
        self.CheckNewMessages();
    }, 500);
};

Chat.prototype.NewMessage = function(res, system, toEnd){
    "use strict";

    if(system === undefined){
        system = false;
    }
    if(toEnd === undefined){
        toEnd = false;
    }

    let newMessage;
    let date = new Date(Date.parse(res.date));

    if (this.lastMessageDate !== undefined && date.getDay() !== this.lastMessageDate.getDay()){
        newMessage = new DateMessage({date:this.lastMessageDate}, this.wrapper, this.lastMessage, toEnd);
        this.lastMessage = newMessage;
    }

    if (!system) {
        newMessage = new Message(res, this.wrapper, this.lastMessage, toEnd);
        this.messages.push(newMessage);
        this.newMessages.push(newMessage);
    } else {
        newMessage = new SystemMessage(res, this.wrapper, this.lastMessage, toEnd);
    }

    this.lastMessageDate = date;
    this.lastMessage = newMessage;
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
    self.historyLoading = true;
    self.loader.style.display = "block";

    xhr.open("POST", "/chat/history", true);

    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function(){
        let res = JSON.parse(this.responseText);

        let msgs = document.querySelectorAll(".collection-item");
        self.lastMessage = msgs[msgs.length - 1];

        for (let i = 0, n = res.length; i < n; i++){
            self.NewMessage(res[i], false, true);
        }

        if(msgs[0] !== undefined) {
            self.lastMessage = msgs[0];
        } else {
            msgs = document.querySelectorAll(".collection-item");
            self.lastMessage = msgs[0];
        }

        self.historyLoading = false;
        self.loader.style.display = "none";
    };

    let data = {
        offset: self.messages.length
    };

    xhr.send(JSON.stringify(data));

    self.newMessages = [];
};

Chat.prototype.Publish = function(data){
    "use strict";

    let self = this;
    let result = {};

    for(let obj of data){
        result[obj[0]] = obj[1];
    }

    this.socket.emit("message", result);
};

let chat = new Chat();