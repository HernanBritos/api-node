import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes'

const app = express();
//Inicializar base de datos
mongoose.connect('mongodb://localhost:27017/test-db', {

})
.then(() => {
  console.log('Database connected!');
})
.catch(err => {
  console.error('Error connecting to database', err);
});

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, mundo!');
});

app.use(userRoutes);

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
