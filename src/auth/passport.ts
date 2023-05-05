import { UserModel } from '../model/user.model';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';


export const authentication = passport.use(new BasicStrategy(
  async (username, password, done) => {
    try {
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