"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArquivoController = exports.ErroUpLoad = void 0;
const mongodb_1 = require("mongodb");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
var ErroUpLoad;
(function (ErroUpLoad) {
    ErroUpLoad["OBJETO_ARQUIVO_INVALIDO"] = "Objeto de arquivo inv\u00E1lido";
    ErroUpLoad["ERRO_GRAVACAO"] = "N\u00E3o foi poss\u00EDvel gravar o arquivo no banco de dados";
})(ErroUpLoad = exports.ErroUpLoad || (exports.ErroUpLoad = {}));
class ArquivoController {
    constructor(bd) {
        this.bd = bd;
        this.caminhoDiretorioArquivos = path_1.default.join(__dirname, '..', '..', 'arquivos_temporarios');
        if (!fs_1.default.existsSync(this.caminhoDiretorioArquivos)) {
            fs_1.default.mkdirSync(this.caminhoDiretorioArquivos);
        }
    }
    ehObjetoArquivoValido(objArquivo) {
        return objArquivo
            && 'name' in objArquivo
            && 'data' in objArquivo
            && objArquivo['name']
            && objArquivo['data'];
    }
    inicializarBucket() {
        return new mongodb_1.GridFSBucket(this.bd, {
            bucketName: 'Arquivos'
        });
    }
    realizarUpload(objArquivo) {
        return new Promise((resolve, reject) => {
            if (this.ehObjetoArquivoValido(objArquivo)) {
                const bucket = this.inicializarBucket();
                const nomeArquivo = objArquivo['name'];
                const conteudoArquivo = objArquivo['data'];
                const nomeArquivoTemp = `${nomeArquivo}_${(new Date().getTime())}`;
                const caminhoArquivoTemp = path_1.default.join(this.caminhoDiretorioArquivos, nomeArquivoTemp);
                fs_1.default.writeFileSync(caminhoArquivoTemp, conteudoArquivo);
                const streamGridFS = bucket.openUploadStream(nomeArquivo, { metadata: { mime: objArquivo['mimetype'] } });
                const streamLeitura = fs_1.default.createReadStream(caminhoArquivoTemp);
                streamLeitura
                    .pipe(streamGridFS)
                    .on('finish', () => {
                    fs_1.default.unlinkSync(caminhoArquivoTemp);
                    resolve(new mongodb_1.ObjectId(`${streamGridFS.id}`));
                })
                    .on('error', (erro) => {
                    console.log(erro);
                    reject(ErroUpLoad.ERRO_GRAVACAO);
                });
            }
            else {
                reject(ErroUpLoad.OBJETO_ARQUIVO_INVALIDO);
            }
        });
    }
}
exports.ArquivoController = ArquivoController;
//# sourceMappingURL=ArquivoController.js.map