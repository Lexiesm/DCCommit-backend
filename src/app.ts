import express from 'express';
import cors from 'cors';
import router from './routes';
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(cors({
  origin:['http://localhost:5173', 'https://www.dccommit.space'],
  credentials: true, 
}));

app.options('*', cors());

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('Hello Divinos\n');
});

export default app;