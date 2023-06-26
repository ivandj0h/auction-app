import prisma from '@/lib/vendor/prisma';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  // const accessToken = request.headers.get("authorization");
  // if (!accessToken || !verifyJwt(accessToken)) {
  //   return new Response(
  //     JSON.stringify({
  //       error: "unauthorized",
  //     }),
  //     {
  //       status: 401,
  //     }
  //   );
  // }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(params.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        balance: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(
          JSON.stringify({
            error: 'user not found',
          }),
          {
            status: 404,
          }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    return new Response(
        JSON.stringify({
          error: 'An error occurred while fetching user data',
        }),
        {
          status: 500,
        }
    );
  }
}
