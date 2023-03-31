import fileUpload from 'express-fileupload';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { uploadRouter } from './routes/upload';


export const app = express();
const routes = express.Router();

app.use(fileUpload())
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

routes.use('/upload', uploadRouter);

export default routes;
