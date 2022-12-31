import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const status = await prisma.taskStatus.createMany({
        data: [
            { status: "Not started" },
            { status: "In progress" },
            { status: "Completed" },
        ],
        skipDuplicates: true,
    });

    const priority = await prisma.taskPriority.createMany({
        data: [
            { priority: "High" },
            { priority: "Medium" },
            { priority: "Normal" },
            { priority: "Low" },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
