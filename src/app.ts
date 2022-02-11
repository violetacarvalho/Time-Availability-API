import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import routes from './routes';

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    console.error(err);
    return response
      .status(err.statusCode | 500)
      .json({ status: 'error', message: err.message });
});

app.get('/', (req, res) => {
  res.send('<b>Express is up and running!</b>');
});

server.listen(process.env.PORT, () => {
  console.log(
    'API is running at http://localhost:%d',
    process.env.PORT,
  );
});

export default app;
