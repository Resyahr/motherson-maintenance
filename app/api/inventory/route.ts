import { dbConnect } from "@/utils/dbConnect";
import { Product } from "@/lib/schemas/productSchema";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if the session exists first
  if (!session) {
    console.error("Needs to be in session");
    return NextResponse.json(
      {
        message: "You must be signed in to fetch products.",
        status: 401,
      },
      { status: 401 }
    );
  }

  // Check if the user has the appropriate role
  if (session.user.role !== "technician" && session.user.role !== "admin") {
    console.error("Needs to be Technician or Admin");
    return NextResponse.json(
      {
        message: "You are not authorized to view this resource.",
      },
      { status: 403 }
    );
  }

  try {
    await dbConnect();
    const products = await Product.find();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred: " + error,
      },
      { status: 500 }
    );
  }
}
