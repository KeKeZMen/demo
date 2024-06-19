import { Router } from "express";
import { prisma } from "../services/index.js";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();
const TOKEN_SECRET = "token";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

authRouter.post("/register", async (req, res) => {
  const { name, email, phoneNumber, password, departament } = req.body as {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    departament: string;
  };

  const emailCandidate = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailCandidate) {
    return res.json({
      message: "Пользователь с таки email уже существует",
    });
  }

  if (password.length < 5) {
    return res.json({ message: "Пароль не может быть короче 5 символов" });
  }

  const hashedPassword = createHash("sha256").update(password).digest("hex");

  await prisma.user.create({
    data: {
      departament,
      email,
      name,
      password: hashedPassword,
      phoneNumber,
    },
  });

  return res.json({ message: "Вы успешно зарегистрировались!" });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const isPasswordEquel =
    createHash("sha256").update(password).digest("hex") == user?.password;

  if (!isPasswordEquel && !user) {
    return res.json({ message: "Неверный email или пароль" });
  }

  const token = jwt.sign({ id: user.id, name: user.name }, TOKEN_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("token", token, {
    expires: new Date(new Date().setDate(new Date().getDate() + 10)),
    httpOnly: true,
  });
  return res.json({ token, user: { id: user.id, name: user.name } });
});

authRouter.get("/refresh", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = verifyToken(token) as { id: string; name: string };

  if (!tokenData) {
    res.cookie("token", null);
    return res.json({ message: "Вы не авторизованы!" });
  }

  const newToken = jwt.sign(
    { id: tokenData.id, name: tokenData.name },
    TOKEN_SECRET,
    {
      expiresIn: "10d",
    }
  );

  res.cookie("token", newToken, {
    expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    httpOnly: true,
  });

  return res.json({
    token: newToken,
    user: { id: tokenData.id, name: tokenData.name },
  });
});

authRouter.get("/user/:id", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { id: userId } = req.params as { id: string };

  const requestUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
      departament: true,
      email: true,
      id: true,
      phoneNumber: true,
    },
  });

  return res.json(requestUser);
});

export { authRouter };
