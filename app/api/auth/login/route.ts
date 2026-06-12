import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    await connectDB();

    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("Invalid email or password", 401);
    }

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
      return jsonError("Invalid input");
    }
    console.error("Login error:", error);
    return jsonError("Login failed", 500);
  }
}
