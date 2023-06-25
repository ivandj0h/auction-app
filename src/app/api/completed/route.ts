import {NextResponse} from "next/server";
import prisma from "@/lib/vendor/prisma";

// Define types
type Balance = {
    amount: number;
};

type User = {
    name: string;
    balance: Balance[];
};

type Item = {
    itemName: string;
    status: string;
    current_price: number;
    bid_price: number;
    duration: string;
    published: boolean;
    itemId: number;
    author: User;
};

export const GET = async (req: Request) => {
    const data = await prisma.item.findMany({
        where: {
            published: true,
            status: 'completed' // Adjusted status
        },
        select: {
            itemName: true,
            status: true,
            current_price: true,
            bid_price: true,
            duration: true,
            start_time: true,
            end_time: true,
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

