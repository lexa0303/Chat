/**
 * Created by alex on 29.05.17.
 */

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
        xhr.onload = function(){
            location.href = "/";
        };
        xhr.send("");
    }
});

$(".button-collapse").sideNav();