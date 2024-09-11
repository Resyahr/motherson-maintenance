import { dbConnect } from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import { User } from "@/lib/schemas/userSchema";

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { id } = body;
    const session = await getServerSession(authOptions);

    if (session?.user.role === "admin") {
      await dbConnect;
    } else {
      return Response.json({
        message: "Must be signed in as Admin to perform this action",
        status: 401,
      });
    }

    const userToDelete = await User.findById(id);

    await User.deleteOne(userToDelete);

    return Response.json({
      message: `User ${userToDelete.name} has being deleted`,
      status: 200,
    });
  } catch (error) {
    throw new Error("An error has occured: " + error);
  }
}

/*   */
