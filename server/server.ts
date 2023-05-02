import express, { Express, Request, Response } from 'express';
import userRouter from './routes/userRouter';
import clusterRouter from './routes/clusterRouter';
import mongoose from 'mongoose';
import path from 'path';

const app = express();

// changing port here for grafana
const PORT: number = 6666;

// Connect to mongo database
mongoose.connect(
  'mongodb+srv://osp5:9dm8OGGfECIJmZdQ@cluster.zboxzus.mongodb.net/test'
);

// Upon successful connection, send update to console
mongoose.connection.once('open', (): void => {
  console.log('WE IN DIS DB');
});

// Add body parser
app.use(express.json());

// Handle routes to /user
app.use('/user', userRouter);

app.use(express.static(path.join(__dirname, '../index')));

// Yining addition: Handle routes to /clusterinfo
// app.use('/clusterinfo', clusterRouter);

// Handle invalid endpoint
app.use((req: express.Request, res: express.Response) => {
  res.status(404).send('Not Found');
});

//creates type for error handler
type ErrHndl = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

// Handle errors
app.use((err: ErrHndl, req: express.Request, res: express.Response) => {
  const defaultErr: ErrHndl = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ErrHndl = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

console.log(PORT);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
