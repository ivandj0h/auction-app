import {NextResponse} from "next/server";

export const GET = async (req: Request) => {
    return NextResponse.json({message: 'Hello from Next.js!'}, {status: 200})
}

export const POST = async (req: Request) => {
    const body: any = await req.json();
    const user = await prisma?.user.findUnique({
        where: {
            id: body.balanceId
        },
        include: {
            balance: true  // include balance records in the response
        }
    });

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // Find the latest balance record for the user
    const latestBalance = user.balance[user.balance.length - 1];

    if (!latestBalance) {
        // If balance doesn't exist, create a new balance
        const balance = await prisma?.balance.create({
            data: {
                amount: body.amount,
                balanceId: body.balanceId,
            }
        });
        return NextResponse.json(balance, {status: 200});
    } else {
        // If balance exists, update the existing balance
        const balance = await prisma?.balance.update({
            where: {
                id: latestBalance.id
            },
            data: {
                amount: latestBalance.amount + body.amount
            }
        });
        return NextResponse.json(balance, {status: 200});
    }
};


