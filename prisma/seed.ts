import bcrypt from "bcrypt";
import prisma from "./client";

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

    const saltRounds = 10;
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const users = await prisma.user.createMany({
        data: [
            {
                id: "clccb60s30003356kjyktmo2g",
                email: "test@test.com",
                name: "テストユーザ",
                crypted_password: hashedPassword,
            },
            {
                id: "clccb60s30005356kkwhdgns3",
                email: "test2@test.com",
                name: "テストユーザ2",
                crypted_password: hashedPassword,
            },
        ],
        skipDuplicates: true,
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
