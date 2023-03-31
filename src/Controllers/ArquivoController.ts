import {Db, GridFSBucket, ObjectId} from 'mongodb'
import path from 'path';
import fs from 'fs';


export enum ErroUpLoad {
    OBJETO_ARQUIVO_INVALIDO = 'Objeto de arquivo inválido',
    ERRO_GRAVACAO = 'Não foi possível gravar o arquivo no banco de dados'
}

export enum ErroDownload {
    ID_INVALIDO = 'ID inválido',
    NENHUM_ARQUIVO_ENCONTRADO = 'Nenhum arquivo foi encontrado com este ID',
    NAO_FOI_POSSIVEL_GRAVAR = 'Não foi possível gravar o arquivo recuperado'
}

export class ArquivoController {
    private bd: Db
    private caminhoDiretorioArquivos: string;

    constructor(bd: Db) {
        this.bd = bd;

        this.caminhoDiretorioArquivos = path.join(__dirname, '..', '..', 'arquivos_temporarios');
        if(!fs.existsSync(this.caminhoDiretorioArquivos)) {
            fs.mkdirSync(this.caminhoDiretorioArquivos);
        }
    }

    private ehObjetoArquivoValido (objArquivo:any): boolean {
        return objArquivo
                && 'name' in objArquivo 
                && 'data' in objArquivo 
                && objArquivo['name'] 
                && objArquivo['data']
    }

    private inicializarBucket(): GridFSBucket {
        return new GridFSBucket(this.bd, {
            bucketName: 'Arquivos'
        })
    }
 
    realizarUpload(objArquivo:any) : Promise<ObjectId> {
        return new Promise((resolve, reject) => {
            if(this.ehObjetoArquivoValido(objArquivo)){
                const bucket = this.inicializarBucket();
    
    
                const nomeArquivo = objArquivo['name'];
                const conteudoArquivo = objArquivo['data'];
                const nomeArquivoTemp = `${nomeArquivo}_${(new Date().getTime())}`
    
                const caminhoArquivoTemp = path.join(this.caminhoDiretorioArquivos, nomeArquivoTemp);
                fs.writeFileSync(caminhoArquivoTemp, conteudoArquivo);
    
                const streamGridFS = bucket.openUploadStream(nomeArquivo, {metadata: {mime: objArquivo['mimetype']}})
    
                const streamLeitura = fs.createReadStream(caminhoArquivoTemp);
                streamLeitura
                    .pipe(streamGridFS)
                    .on('finish', () => {
                        fs.unlinkSync(caminhoArquivoTemp);
                        resolve(new ObjectId(`${streamGridFS.id}`))
                    })
                    .on('error', (erro) => {
                        console.log(erro);
                        reject(ErroUpLoad.ERRO_GRAVACAO)
                    })
            } else {
                reject(ErroUpLoad.OBJETO_ARQUIVO_INVALIDO);
            }
        })
        
    }

    public realizarDownload(id : string) : Promise<string> {
        return new Promise(async (resolve, reject) => {
            if(id && id.length == 24) {
                const idObject = new ObjectId(id);
                const bucket  = this.inicializarBucket();
                const arrayResultados = await bucket.find({'_id': idObject}).toArray();

                if(arrayResultados.length > 0 ){
                    const metadados = arrayResultados[0]
                    const streamGridFS = bucket.openDownloadStream(idObject)
                    const caminhoArquivo = path.join(this.caminhoDiretorioArquivos, metadados['filename'])
                    const streamGravacao = fs.createWriteStream(caminhoArquivo);

                    streamGridFS
                        .pipe(streamGravacao)
                        .on('finish', () => {
                            resolve(caminhoArquivo);
                        })
                        .on('error', (err) => {
                            reject(ErroDownload.NAO_FOI_POSSIVEL_GRAVAR)
                        })
                }else {
                    reject(ErroDownload.NENHUM_ARQUIVO_ENCONTRADO);
                }
            }else {
                reject(ErroDownload.ID_INVALIDO);
            }
        })
    }
}