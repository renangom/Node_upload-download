"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const ArquivoController_1 = require("../Controllers/ArquivoController");
exports.uploadRouter = express_1.default.Router();
exports.uploadRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Nenhum arquivo recebido');
    }
    const nomesArquivos = Object.keys(req.files);
    const bd = req.app.locals.bd;
    const arquivoController = new ArquivoController_1.ArquivoController(bd);
    const idsArquivosSalvos = [];
    let contadorErrosGravacao = 0;
    let contadorErrosObjArquivoInvalido = 0;
    const promises = nomesArquivos.map((arquivo) => __awaiter(void 0, void 0, void 0, function* () {
        const objArquivo = req.files[arquivo];
        try {
            const idArquivo = yield arquivoController.realizarUpload(objArquivo);
            idsArquivosSalvos.push(idArquivo);
        }
        catch (err) {
            switch (err) {
                case ArquivoController_1.ErroUpLoad.ERRO_GRAVACAO:
                    contadorErrosGravacao++;
                    break;
                case ArquivoController_1.ErroUpLoad.OBJETO_ARQUIVO_INVALIDO:
                    contadorErrosObjArquivoInvalido++;
                    break;
            }
        }
    }));
    yield Promise.all(promises);
    res.json({
        idsArquivosSalvos,
        contadorErrosGravacao,
        contadorErrosObjArquivoInvalido
    });
}));
//# sourceMappingURL=upload.js.map