import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid inputs" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}




