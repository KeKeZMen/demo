import { Router } from "express";
import { prisma } from "../services/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/category", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const categories = await prisma.category.findMany();

  return res.json(categories);
});

categoryRouter.post("/category", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { name: categoryName } = req.body as { name: string };

  await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return res.json({ message: "Категория успешно создана" });
});

categoryRouter.delete("/category/:id", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { id: categoryId } = req.params as { id: string };

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return res.json({ message: "Категория успешно удалена" });
});

categoryRouter.patch("/category/:id", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { id: categoryId } = req.params as { id: string };
  const { name: categoryName } = req.body as { name: string };

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: categoryName,
    },
  });

  return res.json({ message: "Категория успешно обновлена" });
});

export { categoryRouter };
