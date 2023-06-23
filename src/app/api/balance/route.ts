import {NextResponse} from "next/server";
import {Balance, PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
    const body: any = await req.json();

    if (!body.userId) {
        return NextResponse.json({error: "User ID not provided"}, {status: 400});
    }

    const user: User & { balance: Balance[] } | null = await prisma?.user.findUnique({
        where: {
            id: body.userId,
        },
        include: {
            balance: true,
            items: true,
        },
    });

    // Always remember to close the PrismaClient connection when done
    await prisma.$disconnect();

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    if (user.balance.length === 0) {
        return NextResponse.json({error: "No balance data available for this user"}, {status: 404});
    }

    const latestBalance = user.balance[user.balance.length - 1];
    return NextResponse.json(latestBalance, {status: 200});
};
