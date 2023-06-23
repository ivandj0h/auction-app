import {NextResponse} from "next/server";
import prisma from "@/lib/vendor/prisma";


export const PATCH = async (req: Request, {params}: {params: {id: number}}) => {
    const {id} = params;
    const item = await prisma.item.update({
        where: {
            id: parseInt(id.toString()) // Convert id to integer
        },
        data: {
            published: true
        }
    });

    return NextResponse.json(item, {status: 200})
}
