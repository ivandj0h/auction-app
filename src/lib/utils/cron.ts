import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCompletedStatus(): Promise<void> {
    try {
        const currentDate = new Date();
        const expiredItems = await prisma.item.findMany({
            where: {
                end_time: { lte: currentDate },
                status: { not: 'completed' },
            },
        });

        const updatePromises = expiredItems.map((item) =>
            prisma.item.update({
                where: { id: item.id },
                data: { status: 'completed' },
            })
        );
        await Promise.all(updatePromises);

        console.log('Completed status updated for expired items:', expiredItems);
    } catch (error) {
        console.error('Error updating completed status:', error);
    } finally {
        await prisma.$disconnect();
    }
}

function startCronJob(): void {
    cron.schedule('*/5 * * * *', () => {
        updateCompletedStatus();
    });
    console.log('Cron job started');
}


export { startCronJob };
