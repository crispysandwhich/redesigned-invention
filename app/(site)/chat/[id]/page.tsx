"use server"
import ChatClient from '@/app/components/ChatClient'
import { getSession, GetSingleAgentHistory } from '@/app/lib/actions'
import { verifyToken } from '@/app/lib/jwt'

type PageProps = {
  params: Promise<{ id: string }>
}

const page = async ({ params }: PageProps) => {
  const session = await getSession()
  const verifyedUser = verifyToken(session?.token || "")
  const { id } = await params
  const CurrentChatSession = await GetSingleAgentHistory(id)
  const messages = CurrentChatSession.message?.messages || []
  
  
  // console.log(CurrentChatSession.message.messages)
  // console.log(CurrentChatSession.message.messages[0].owner)
  // console.log(messages)
  // console.log(session)
  // console.log(verifyedUser)

  return (
    <section>
        <header className='mb-4'>
            <h2 className='text-xl font-bold'>Chat with Agent</h2>
            <p className='text-sm '>{CurrentChatSession.message?.title}</p>
        </header>

        <ChatClient 
          userMessages={JSON.stringify(CurrentChatSession.message)} 
          chatId={id} 
          userId={verifyedUser?.userId.toString()} 
        />

    </section>
  )
}

export default page