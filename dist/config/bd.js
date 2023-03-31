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
Object.defineProperty(exports, "__esModule", { value: true });
exports.conectarDB = void 0;
const mongodb_1 = require("mongodb");
const app_1 = require("../app");
const URI_DB = process.env.URI_DB;
const conectarDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const clientDB = new mongodb_1.MongoClient('mongodb://0.0.0.0:27017/exemploarquivos');
    try {
        const conexao = yield clientDB.connect();
        app_1.app.locals.bd = conexao.db();
        console.log(`Conexão com DB foi aberta com o banco ${conexao.db().databaseName}`);
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            yield conexao.close();
            console.log('Conexão com o banco foi fechada');
        }));
    }
    catch (err) {
        console.log(err);
    }
});
exports.conectarDB = conectarDB;
//# sourceMappingURL=bd.js.map