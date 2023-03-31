import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';

import { ArquivoController, ErroDownload } from '../Controllers/ArquivoController';

export const downloadRouter = Router();


downloadRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    const bd = req.app.locals.bd;
    const arquivoController = new ArquivoController(bd);

    try{
        const caminhoArquivo = await arquivoController.realizarDownload(id);
        return res.download(caminhoArquivo, () => {
            fs.unlinkSync(caminhoArquivo)
        });
    }catch(err) {
        switch(err) {
            case ErroDownload.ID_INVALIDO:
                return res.status(400).json({mensagem : ErroDownload.ID_INVALIDO});
                break;
            
            case ErroDownload.NAO_FOI_POSSIVEL_GRAVAR:
                return res.status(500).json({mensagem: ErroDownload.NAO_FOI_POSSIVEL_GRAVAR});
                break;

            case ErroDownload.NENHUM_ARQUIVO_ENCONTRADO:
                return res.status(404).json({mensagem: ErroDownload.NENHUM_ARQUIVO_ENCONTRADO});
                break;
            default:
                return res.status(500).json({mensagem: 'Erro no servidor'});
        }
    }
})