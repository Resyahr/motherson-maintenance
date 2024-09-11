import { dbConnect } from "@/utils/dbConnect";
import { Product } from "@/lib/schemas/productSchema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  try {
    await dbConnect();

    const product = await Product.findById(id); // Find product by ID
    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found", status: 404 }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error: any) {
    console.error("Error:", error.message); // Log any errors
    return new Response(
      JSON.stringify({
        message: `An error occurred: ${error.message}`,
      }),
      { status: 500 }
    );
  }
}
