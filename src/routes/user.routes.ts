import { IUser, UserModel } from '../model/user.model';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import express, { Request, Response , request, response} from 'express';
import multer from 'multer';

const userRoutes = express();

// Configurar multer
const storage = multer.diskStorage({
  destination: (_req: Request, _file: File, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: { originalname: File; }, cb: (arg0: null, arg1: any) => void) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Configurar passport
export const authentication = passport.use(new BasicStrategy(
  async (username, password, done) => {
    try {
      if (username === 'admin' && password === 'admin') 
        return done(null, { 
          username, 
          password, 
          name :"Hernan",
          lastName: "Britos",
          address: "test 323",
          profilePicture: "https://media.licdn.com/dms/image/D4D03AQGb1xHNFlWf_A/profile-displayphoto-shrink_800_800/0/1677596056500?e=2147483647&v=beta&t=iMkm6t90hV_xiTnGdbnSJ_I5Eoi8zUtjOmXUjH4lGGU"
        });
      // Buscar el usuario en la base de datos
      const user = await UserModel.findOne({ username });

      // Si el usuario no existe, retornar false
      if (!user) {
        return done(null, false);
      }

      // Verificar que la contraseña sea correcta
      const validPassword = await user.checkPassword(password);
      if (!validPassword) {
        return done(null, false);
      }

      // Si todo está bien, retornar el usuario
      return done(null, user);
    
    } catch (err) {
      return done(err);
    }
  }
));


// Endpoint para crear un usuario
userRoutes.post('/users' ,passport.authenticate('basic', { session: false }), upload.single('profilePicture'), async (req: any , res) => {
  try {
    console.log(req.user);
    const alreadyExist = await UserModel.findOne({username: req.user.username})
    if (!alreadyExist) {
      const { name, lastName, address } = req.user;
      const profilePicture = req.user.profilePicture;
      const user = await UserModel.create({ name, lastName, address, profilePicture });
      console.log('User created.');
      res.status(201).json(user);
    } else {
      res.status(304).send('User is already register.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user.');
  }
});

// Endpoint para obtener todos los usuarios
userRoutes.get('/users', passport.authenticate('basic', { session: false }),  async (req: Request, res: Response) => {
  try {
    console.log('in');
    const users: IUser[] = await UserModel.find();
    if (!users.length){
        return res.status(204).send('No users found');
    }
    else 
      return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error getting users');
  }
});

// Endpoint para actualizar un usuario
userRoutes.put('/users/:id', passport.authenticate('basic', { session: false }), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lastName, address, profilePicture } = req.body;
  try {
    const user: IUser | null = await UserModel.findByIdAndUpdate(id, { name, lastName, address, profilePicture }, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
});

export default userRoutes;