import { dbConnect } from "@/utils/dbConnect";
import { Product } from "@/lib/schemas/productSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const id = req.url;

  console.log(id)

  try {
    // Authenticate the user and check their role
    if (
      !session ||
      (session.user.role !== "technician" && session.user.role !== "admin")
    ) {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Parse the request body (the new form data)
    const body = await req.json();
    const { productImage, ...updatedData } = body;

    // Connect to the database
    await dbConnect();

    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", status: 404 },
        { status: 404 }
      );
    }

    // If the product has an old image and a new image is uploaded, delete the old image
    if (product.productImage && product.productImage !== productImage) {
      const oldImageRef = ref(storage, product.productImage);
      await deleteObject(oldImageRef)
        .then(() => {
          console.log("Old image deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting old image:", error);
        });
    }

    // Update the product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updatedData, productImage }, // Add productImage URL to the update data
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Failed to update product", status: 500 },
        { status: 500 }
      );
    }

    // Return the updated product
    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "An error occurred: " + error.message, status: 500 },
      { status: 500 }
    );
  }
}
