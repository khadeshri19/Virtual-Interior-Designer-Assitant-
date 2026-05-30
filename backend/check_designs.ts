import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const designs = await prisma.design.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    console.log(JSON.stringify(designs, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
