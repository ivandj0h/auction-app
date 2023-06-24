import {NextResponse} from "next/server";
import prisma from "@/lib/vendor/prisma";
import {Item} from ".prisma/client";


export const PATCH = async (req: Request, {params}: {params: {id: string}}) => {
const body: Item = await req.json();

    const item = await prisma.item.update({
        where: {
            id:  Number(params.id),
        },
        data: {
            published: true,
            status: 'publish',
            start_time: body.start_time,
            end_time: body.end_time,
            duration: body.duration,
        }
    });

    return NextResponse.json(item, {status: 200})
}
