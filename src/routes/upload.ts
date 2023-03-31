import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import {ObjectId} from 'mongodb'
import { ArquivoController, ErroUpLoad } from '../Controllers/ArquivoController';


export const uploadRouter = Router();


uploadRouter.post('/', async (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Nenhum arquivo recebido');
    }

    const nomesArquivos = Object.keys(req.files);

    const bd = req.app.locals.bd
    const arquivoController = new ArquivoController(bd);
    const idsArquivosSalvos: ObjectId[] = [];
    let contadorErrosGravacao = 0;
    let contadorErrosObjArquivoInvalido = 0;

    const promises = nomesArquivos.map( async (arquivo) => {
        const objArquivo = req.files[arquivo];

        try {
            const idArquivo = await arquivoController.realizarUpload(objArquivo);
            idsArquivosSalvos.push(idArquivo);
        } catch(err) {
            switch(err) {
                case ErroUpLoad.ERRO_GRAVACAO:
                    contadorErrosGravacao++;
                    break
                
                case ErroUpLoad.OBJETO_ARQUIVO_INVALIDO:
                    contadorErrosObjArquivoInvalido++
                    break
            }
        }
    })

    await Promise.all(promises)

    res.json({
        idsArquivosSalvos,
        contadorErrosGravacao,
        contadorErrosObjArquivoInvalido
    })
})