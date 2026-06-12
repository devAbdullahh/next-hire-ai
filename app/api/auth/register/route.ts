import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      return jsonError("Email already registered", 409);
    }

    const passwordHash = await hashPassword(body.password);
    const user = await User.create({
      email: body.email.toLowerCase(),
      name: body.name,
      passwordHash,
    });

    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    await setAuthCookie(token);

    return jsonOk({
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message ?? "Invalid input");
    }
    console.error("Register error:", error);
    return jsonError("Registration failed", 500);
  }
}
