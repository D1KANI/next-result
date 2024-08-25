import { CreateEventSchema, EditEventSchema, JoinEventSchema, LeaveEventSchema } from "@/shared/api";
import { prisma } from "../db";
import { isAuth, procedure, router } from "../trpc";
import { z } from "zod";

export const eventRouter = router({
  findMany: procedure.query(async ({ ctx: { user } }) => {
    const events = await prisma.event.findMany({
      include: {
        participations: true,
      },
    });

    return events.map(({ participations, ...event }) => ({
      ...event,
      isJoined: participations.some(({ userId }) => userId === user?.id),
    }));
  }),
  findUnique: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .use(isAuth)
    .query(({ input }) => {
      return prisma.event.findUnique({
        where: input,
        select: {
          title: true,
          description: true,
          date: true,
          participations: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          authorId: true,
        },
      });
    }),
  create: procedure
    .input(CreateEventSchema)
    .use(isAuth)
    .mutation(({ input, ctx: { user } }) => {
      return prisma.event.create({
        data: {
          authorId: user.id,
          ...input,
        },
      });
    }),
  edit: procedure
    .input(EditEventSchema)
    .use(isAuth)
    .mutation(async ({ input, ctx: { user } }) => {
      const event = await prisma.event.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });

      if (!event || event.authorId !== user.id) {
        throw new Error("Нет прав на редактирование этого события");
      }

      // Если пользователь - автор, обновляем событие
      return prisma.event.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          date: input.date,
        },
      });
    }),
  join: procedure
    .input(JoinEventSchema)
    .use(isAuth)
    .mutation(({ input, ctx: { user } }) => {
      return prisma.participation.create({
        data: {
          eventId: input.id,
          userId: user.id,
        },
      });
    }),
  leave: procedure
    .input(LeaveEventSchema)
    .use(isAuth)
    .mutation(({ input, ctx: { user } }) => {
      return prisma.participation.delete({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId: input.id,
          },
        },
      });
    }),
});
