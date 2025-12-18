import ChatClient from '@/app/components/ChatClient'
import React from 'react'

const page = () => {

    const messages = [
        
    ]


  return (
    <section>
        <header>
            <h2>Chat with Agent</h2>
            <p>This is an agent that is turns your query into code translations</p>
        </header>

        <ChatClient userMessages={messages} />

    </section>
  )
}

export default page