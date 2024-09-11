import { dbConnect } from "@/utils/dbConnect";
import { User } from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    await dbConnect();

    const users = await User.find().select(
      "_id name lastName email role createdBy createdAt updatedAt"
    );

    return Response.json(users);
  } catch (error) {
    console.log("An error occured: " + error);
    throw new Error("An error occured: " + error);
  }
}
