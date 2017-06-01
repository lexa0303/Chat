/**
 * Created by alex on 29.05.17.
 */

let fs = require("fs");
let mime = require("mime");

exports.sendFile = (fileName, res) => {

    res.setHeader('content-type', mime.lookup(fileName));

    let file = new fs.ReadStream(fileName);
    file.pipe(res);

    file.on("error", (err) => {
        "use strict";
        res.statusCode = 500;
        res.end("Server Error");
        console.error(err);
    });

    res.on("close", () => {
        "use strict";
        file.destroy();
    })
};