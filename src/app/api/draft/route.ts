import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {Session} from 'next-auth';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();
export type NextApiRequestWithSession = NextApiRequest & {
    session?: Session;
};

export const GET = async (req: Request) => {
    const data = await prisma.item.findMany({
        where: {
            published: false,
            status: 'draft'
        },
        select: {
            id: true,
            itemName: true,
            status: true,
            current_price: true,
            bid_price: true,
            duration: true,
            published: true,
            itemId: true,
            author: {
                select: {
                    name: true,
                    balance: {
                        select: {
                            amount: true
                        }
                    }
                }
            }
        }
    });

    // Transform data to match your required format
    const formattedData = data.map((item: any) => {
        return {
            ...item,
            author: item.author.name,
            itemName: item.itemName ? item.itemName : '',  // handle null
            duration: item.duration ? item.duration : '',  // handle null ''),
        };
    });


    return NextResponse.json(formattedData, {status: 200});
}


// POST method
export const POST = async (req: Request) => {
    const body: any = await req.json();

    const user = await prisma?.user.findUnique({
        where: {
            id: body.userId
        },
        include: {
            items: true,
            balance: true,
        }
    });

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // If Item doesn't exist, create a new Item
    const Item = await prisma?.item.create({
        data: {
            itemName: body.itemName,
            status: "draft",
            current_price: body.startPrice,
            bid_price: 0,
            duration: body.timeWindow,
            published: false,
            itemId: user.id,
        }
    });
    return NextResponse.json(Item, {status: 200});
}
