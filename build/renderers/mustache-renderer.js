"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_renderer_1 = require("./base-renderer");
const mustache = __importStar(require("mustache"));
class MustacheRenderer extends base_renderer_1.BaseRenderer {
    constructor(env, name, partials = {}) {
        super(env, name);
        this.partials = partials;
    }
    core(template, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof template !== 'string') {
                throw new Error('Mustache templates must be strings');
            }
            const output = mustache.render(template, context, this.partials);
            return output;
        });
    }
}
exports.MustacheRenderer = MustacheRenderer;
//# sourceMappingURL=mustache-renderer.js.map