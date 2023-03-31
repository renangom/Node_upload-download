import routes, { app } from "./app";
import { conectarDB } from "./config/bd";


const porta = 3000;


const server = app.listen(porta, () => {
    conectarDB();
    console.log(`App está ouvindo a porta ${porta}`);
})

app.use(routes);  

process.on('SIGINT', () => {
    server.close();
    console.log('App finalizado')
})