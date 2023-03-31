"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bd_1 = require("./config/bd");
const upload_1 = require("./routes/upload");
const porta = 3000;
app_1.app.use('/upload', upload_1.uploadRouter);
const server = app_1.app.listen(porta, () => {
    (0, bd_1.conectarDB)();
    console.log(`App está ouvindo a porta ${porta}`);
});
process.on('SIGINT', () => {
    server.close();
    console.log('App finalizado');
});
//# sourceMappingURL=server.js.map