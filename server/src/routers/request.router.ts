import { Router } from "express";
import { prisma } from "../services/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const requestRouter = Router();

requestRouter.get("/requests", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const requests = await prisma.request.findMany();

  return res.json(requests);
});

requestRouter.post("/request", authMiddleware, async (req, res) => {
  const { id: userId } = req.body.user as { id: string; name: string };

  const { description, categoryId } = req.body as {
    description: string;
    categoryId: string;
  };

  await prisma.request.create({
    data: {
      description,
      categoryId,
      status: "NEW",
      userId,
    },
  });

  return res.json({ message: "Заявка успешно создана" });
});

requestRouter.delete("/request/:id", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { id: requestId } = req.params as { id: string };

  await prisma.request.delete({
    where: {
      id: requestId,
    },
  });

  return res.json({ message: "Заявка успешно удалена" });
});

requestRouter.patch("/request/:id", authMiddleware, async (req, res) => {
  const { id, name } = req.body.user as { id: string; name: string };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user?.role !== "ADMIN") {
    return res.json({ message: "Нет доступа" });
  }

  const { id: requestId } = req.params as { id: string };
  const { status } = req.body as { status: "DONE" | "REJECTED" | "NEW" };

  await prisma.request.update({
    where: {
      id: requestId,
    },
    data: {
      status,
    },
  });

  return res.json({ message: "Статус заявки обновлен" });
});

export { requestRouter };
