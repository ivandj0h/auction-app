import {NextResponse} from "next/server";

export const GET = async (req: Request) => {
    return NextResponse.json({message: 'Hello from Next.js!'}, {status: 200})
}

