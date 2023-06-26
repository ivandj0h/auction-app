import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface ItemUpdate {
    authorId: string;
    newBidPrice: number;
    newBalanceAmount: number | null;
}

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    const body: ItemUpdate = await req.json();
    const { authorId, newBidPrice, newBalanceAmount } = body;

    console.log('Request data:', body);

    // Find the Balance record for the user
    const balanceRecord = await prisma.balance.findFirst({
        where: {
            author: {
                id: Number(authorId),
            },
        },
    });

    console.log('Balance record:', balanceRecord);

    if (!balanceRecord) {
        return NextResponse.json({ error: 'Balance record not found for the user' }, { status: 404 });
    }

    try {
        console.log('Received newBalanceAmount:', newBalanceAmount);
        console.log('Updating bid price to:', newBidPrice);
        // Wrap in transaction
        const transaction = await prisma.$transaction([
            prisma.item.update({
                where: { id: Number(params.id) },
                data: { bid_price: newBidPrice },
            }),
            prisma.balance.update({
                where: { id: balanceRecord.id },
                data: { amount: newBalanceAmount !== null ? newBalanceAmount : undefined },
            }),
        ]);

        console.log('Transaction result:', transaction);

        // Refresh the updated item and balance
        const updatedItem = await prisma.item.findUnique({ where: { id: Number(params.id) } });
        const updatedBalance = await prisma.balance.findUnique({ where: { id: balanceRecord.id } });

        console.log('Updated Item:', updatedItem);
        console.log('Updated Balance:', updatedBalance);

        return NextResponse.json({ item: updatedItem, balance: updatedBalance }, { status: 200 });
    } catch (error) {
        console.error('An error occurred while updating the records:', error);
        return NextResponse.json({ error: 'An error occurred while updating the records' }, { status: 500 });
    }
};
