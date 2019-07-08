"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
class JsonParser extends parser_1.Parser {
    async parse(input, config) {
        try {
            if (typeof input === 'string') {
                return JSON.parse(input);
            }
            else {
                return input;
            }
        }
        catch (err) {
            if (config.hasOwnProperty('defaultValue')) {
                return config.defaultValue;
            }
            else {
                throw err;
            }
        }
    }
}
exports.JsonParser = JsonParser;
//# sourceMappingURL=json-parser.js.map