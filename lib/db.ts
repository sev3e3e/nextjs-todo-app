import prisma from "../prisma/client";

export async function deleteTask(id: number) {
    return prisma.task.delete({
        where: { id: id },
    });
}
