import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up broken design records...');
    const designs = await prisma.design.findMany();

    for (const d of designs) {
        let needsUpdate = false;
        const fixedGeneratedImages = d.generatedImages.map(img => {
            if (img.includes('equirectangular') || img.includes('panorama')) {
                // If it contains these words but isn't a URL, it's a raw prompt garbage string
                if (!img.startsWith('http') && !img.startsWith('/uploads')) {
                    needsUpdate = true;
                    // Try to turn it into a valid Pollinations URL as a fix
                    const encoded = encodeURIComponent(img);
                    return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=1234`;
                }
            }
            return img;
        });

        if (needsUpdate) {
            console.log(`Updating design ${d.id}...`);
            await prisma.design.update({
                where: { id: d.id },
                data: { generatedImages: fixedGeneratedImages }
            });
        }
    }
    console.log('Cleanup complete.');
}

main().finally(() => prisma.$disconnect());
