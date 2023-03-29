import {MongoClient} from 'mongodb'
import { app } from '../app';

const URI_DB = process.env.URI_DB

export const conectarDB = async () => {
    const clientDB = new MongoClient('mongodb://0.0.0.0:27017/exemploarquivos')   
    
    
    try{
        const conexao = await clientDB.connect();
        app.locals.bd = conexao.db();
        console.log(`Conexão com DB foi aberta com o banco ${conexao.db().databaseName}`)

        process.on('SIGINT', async () => {
           await conexao.close();
           console.log('Conexão com o banco foi fechada');
        })
    }catch(err){
        console.log(err)
    }
}