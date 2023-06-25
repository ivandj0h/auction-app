import {NextResponse} from "next/server";

export const GET = async (req: Request) => {
    return NextResponse.json({ message: 'Hello from the API' }, { status: 200 });
}
