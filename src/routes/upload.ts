import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';


export const uploadRouter = express.Router();


uploadRouter.post('/', (req, res) => {
    if(!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).send('Nenhum arquivo recebido');
    }

    const nomesArquivos = Object.keys(req.files);
    const diretorio = path.join(__dirname, '..', '..', 'arquivos');
    if(!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio);
    }


    nomesArquivos.forEach((arquivo) => {
        
    })

    res.send('Arquivos gravados no servidor')
})