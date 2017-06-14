/**
 * Created by alex on 07.06.17.
 */

document.querySelector("#personal_form").addEventListener("submit", function(e){
    "use strict";
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/personal");

    let data = new FormData(this);

    xhr.onload = function(res){
        location.reload();
    };

    xhr.send(data);
});