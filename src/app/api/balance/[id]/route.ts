import { NextResponse } from "next/server";
import prisma from "@/lib/vendor/prisma";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;

        // Find the balance in the database using the provided ID
        const balance = await prisma.balance.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                amount: true,
            },
        });

        if (!balance) {
            return new NextResponse("Balance not found", {
                status: 404,
            });
        }

        return new NextResponse(JSON.stringify({ balance: balance.amount }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error retrieving balance:", error);
        return new NextResponse("Internal server error", {
            status: 500,
        });
    }
};




