import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import logger from 'morgan';
import { uploadRouter } from './routes/upload';


export const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(fileUpload)


app.use('/upload', uploadRouter)