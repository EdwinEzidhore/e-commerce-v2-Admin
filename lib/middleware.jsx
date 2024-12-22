import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const isAuthenticated = async() => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect('/')
    }

    return session.user;

}