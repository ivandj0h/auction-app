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
      status: 'publish'
    },
    select: {
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
      items: true  // include Item records in the response
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

