/**
 * Created by lexa0 on 01.06.2017.
 */

let winston = require("winston");
let ENV = process.env.NODE_ENV;

function getLogger(module){
    "use strict";
    let path = module.filename.split("/").slice(-2).join("/");

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV === "development") ? "debug" : "error",
                label: path
            })
        ]
    })
}

module.exports = getLogger;