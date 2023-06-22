import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

interface RequestBody {
    email: string;
    password: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const name = extractNameFromBody(body.email);
    const hashedPassword = await hashPassword(body.password);

    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                name: name,
                password: hashedPassword,
            },
        });

        return new Response(JSON.stringify(user));
    } catch (error) {
        console.error("Error registering user:", error);
        return new Response(JSON.stringify(null));
    }
}

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

function extractNameFromBody(email: string): string {
    const emailParts = email.split("@");
    return emailParts[0];
}
