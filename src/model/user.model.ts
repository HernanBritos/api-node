import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  lastName: {
    type: String
  },
  address: {
    type: String
  },
  profilePicture: {
    type: String
  }
});

// Método para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Método para verificar la contraseña
userSchema.methods.checkPassword = async function(password: string): Promise<boolean> {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

export interface IUser extends Document {
  username: string;
  password: string;
  name?: string;
  lastName?: string;
  address?: string;
  profilePicture?: string;
  checkPassword(password: string): Promise<boolean>;
}

export const UserModel = mongoose.model<IUser>('User', userSchema);

