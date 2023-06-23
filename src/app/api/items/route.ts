import {DateTime} from "next-auth/providers/kakao";
import {NextResponse} from "next/server";
import prisma from "@/lib/vendor/prisma";

// Define types
type Balance = {
  amount: number;
};

type User = {
  name: string;
  posts: Balance[];
};

type Item = {
  itemName: string;
  status: string;
  current_price: number;
  bid_price: number;
  start_duration: DateTime;
  end_duration: DateTime;
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
      start_duration: true,
      end_duration: true,
      published: true,
      itemId: true,
      author: {
        select: {
          name: true,
          posts: {
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
      start_duration: item.start_duration instanceof Date ? item.start_duration.toISOString() : (item.start_duration ? item.start_duration : ''),  // handle Date and null
      end_duration: item.end_duration instanceof Date ? item.end_duration.toISOString() : (item.end_duration ? item.end_duration : ''),  // handle Date and null
    };
  });


  return NextResponse.json(formattedData, {status: 200});
}
