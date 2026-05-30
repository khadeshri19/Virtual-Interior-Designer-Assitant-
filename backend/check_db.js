const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const designs = await prisma.design.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        });
        designs.forEach(d => {
            console.log(`Design ID: ${d.id}`);
            console.log(`Room: ${d.roomType}, Style: ${d.style}`);
            console.log(`Images: ${JSON.stringify(d.generatedImages)}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
