import { prisma } from '../../config/prisma';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};
