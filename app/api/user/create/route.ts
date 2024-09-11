import { User, IUser } from "@/lib/schemas/userSchema";
import { dbConnect } from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession();
  const { name, lastName, password, role, email } = await req.json();

  try {
    await dbConnect();

    const requiredFields = [
      { field: "name", value: name },
      { field: "lastName", value: lastName },
      { field: "password", value: password },
      { field: "role", value: role },
      { field: "email", value: email },
    ];

    for (const { field, value } of requiredFields) {
      if (!value) {
        return Response.json({
          message: `Field '${field}' is required.`,
          status: 400,
        });
      }
    }
    const alreadyExist = await User.findOne({ name: name });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: IUser = {
      name: name,
      lastName: lastName,
      password: hashedPassword,
      email: email,
      role: role,
      createdBy: session?.user?.name || "admin",
    };

    if (alreadyExist) {
      return Response.json({
        message: "User " + name + " already exist",
        status: 409,
      });
    }

    await User.create(user);

    return Response.json({
      message: `User ${user.name} created successfully`,
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({
      message: "An error occurred: " + error,
      status: 500,
    });
  }
}
