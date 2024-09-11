import { NextRequest } from "next/server";
import { Product } from "@/lib/schemas/productSchema";
import { dbConnect } from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const {
    name,
    description,
    product_code,
    manufacturer,
    supplier,
    category,
    location,
    quantity,
    low_stock_threshold,
    productImage,
  } = await req.json();

  const product = {
    name: name,
    description: description,
    product_code: product_code,
    manufacturer: manufacturer,
    supplier: supplier,
    category: category,
    location: location,
    quantity: quantity,
    low_stock_threshold: low_stock_threshold,
    productImage: productImage,
  };

  const requiredFields = [
    { field: "name", value: name },
    { field: "manufacturer", value: manufacturer },
    { field: "location", value: location },
    { field: "quantity", value: quantity },
    { field: "low_stock_threshold", value: low_stock_threshold },
  ];

  for (const { field, value } of requiredFields) {
    if (!value) {
      return Response.json({
        message: `Field '${field}' is required.`,
        status: 400,
      });
    }
  }
  const alreadyExist = await Product.findOne({ name: name });

  if (alreadyExist) {
    return Response.json({
      message: "Item already exist in database",
      status: 409,
    });
  }

  try {
    await dbConnect();
    if (session && session?.user.role === "admin") {
      await Product.create(product);
    } else {
      return Response.json({
        message: "User role must be admin to create new inventory items",
      });
    }

    return Response.json({ message: "Item created successfully", status: 200 });
  } catch (error) {
    console.error("An error occurred: ", error);
    return Response.json(
      { message: "An error occurred: " + error },
      { status: 500 }
    );
  }
}
