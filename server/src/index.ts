import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = "token";

class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static badRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }

  static noEnoughRights() {
    return new ApiError(403, "Недостаточно прав");
  }
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(ApiError.unauthorizedError());

    const token = authHeader.split(" ")[1];
    if (!authHeader) return next(ApiError.unauthorizedError());

    const tokenData = verifyToken(token);
    if (!tokenData) return next(ApiError.unauthorizedError());

    req.body.user = tokenData;
    next();
  } catch (error) {
    return next(ApiError.unauthorizedError());
  }
}

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
}

async function start(): Promise<void> {
  try {
    const app = express();
    const prisma = new PrismaClient();
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(cors());

    app.post("/register", async (req, res) => {
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

      const hashedPassword = createHash("sha256")
        .update(password)
        .digest("hex");

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

    app.post("/login", async (req, res) => {
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

      return res.json({ token, user: { id: user.id, name: user.name } });
    });

    app.post("/category", authMiddleware, async (req, res) => {
      const user = req.body.user
      
    });

    app.use(errorMiddleware);
    app.listen(3000, () =>
      console.log("Server started on http://localhost:3000")
    );
  } catch (error) {
    console.log(error);
  }
}

start();
