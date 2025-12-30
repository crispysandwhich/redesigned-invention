"use server"

import { getSession } from "@/app/lib/actions"
import { verifyToken } from "@/app/lib/jwt"
import { GetSingleUser } from "@/app/lib/UserActions"
import Image from "next/image"

const page = async () => {

  const userToken = await getSession()
  const verifyUser = verifyToken(userToken.token as string)
  const UserData = (await GetSingleUser(verifyUser!.userId)).message

  console.log(UserData)


  return (
    <section className='w-full min-h-screen'>
      <h1 className='text-3xl font-bold underline'>{UserData?.username || "Ano"} Profile Page</h1>
      <div className="relative w-[300px] h-[300px]">
        <Image
          src={UserData.image || "/file.svg"}
          alt="Profile image" 
          fill />
      </div>
      <p>{UserData.description || "No description available"}</p>

      <h3>info</h3>
      <div className="flex items-center gap-2">
        <h2>Metamask:</h2>
        <p>{UserData?.metaAddress || "Not connected"}</p>
      </div>
      <div className="flex items-center gap-2">
        <h2>Email:</h2>
        <p>{UserData?.email || "Not connected"}</p>
      </div>
      <div className="flex items-center gap-2">
        <h2>Member:</h2>
        <p>{UserData?.isPro ? "Pro Member" : "Not Member"}</p>
      </div>
      <div className="flex items-center gap-2">
        <h2>tokens:</h2>
        <p>{UserData?.tokens || 0}</p>
      </div>

    </section>
  )
}

export default page