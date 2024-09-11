import { dbConnect } from "@/utils/dbConnect";
import { Product } from "@/lib/schemas/productSchema";
import { NextResponse } from "next/server";

// API Route to get a single product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Find the product by its ID using the dynamic param from the URL
    const product = await Product.findById(params.id);

    // If product not found, return 404
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", status: 404 },
        { status: 404 }
      );
    }

    // Return the product data as JSON with status 200
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    // Handle any errors and return a 500 status
    return NextResponse.json(
      { message: "An error occurred: " + error.message, status: 500 },
      { status: 500 }
    );
  }
}
