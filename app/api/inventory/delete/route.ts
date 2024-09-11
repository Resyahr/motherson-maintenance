import { dbConnect } from "@/utils/dbConnect";
import { Product, IProducts } from "@/lib/schemas/productSchema";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { NextResponse } from "next/server";

// Helper function to delete image from Firebase Storage
const deleteImageFromFirebase = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted successfully from Firebase");
  } catch (error) {
    console.error("Error deleting image from Firebase:", error);
  }
};

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session || session?.user.role !== "admin") {
    return NextResponse.json(
      {
        message: "Must be an admin to delete products",
        status: 401,
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const product = (await Product.findById(id)) as IProducts;

    if (!product) {
      return NextResponse.json(
        {
          message: `Product with id: ${id} not found`,
          status: 404,
        },
        { status: 404 }
      );
    }

    // If the product has an image, delete it from Firebase Storage
    if (product.productImage) {
      await deleteImageFromFirebase(product.productImage);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: `Item "${product.name}" deleted successfully`,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        message: `An error occurred on the server: ${error}`,
        status: 500,
      },
      { status: 500 }
    );
  }
}
