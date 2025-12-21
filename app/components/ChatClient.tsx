"use client";

import { CreateChatMessage } from "../lib/actions";

interface ChatClientProps {
  userMessages: any;
  chatId?: string;
  userId?: string;
}

const ChatClient = ({ userMessages, chatId, userId }: ChatClientProps) => {
  const sessionMessages = JSON.parse(userMessages)

  const HandleChatQuery = async (e:any) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const userChat = form.UserChat.value;
    const payload = {
      chatId: chatId,
      userChat: userChat,
      userId: userId,
    }
    try {
      const res = await CreateChatMessage(payload)
      console.log(res)
      form.reset()
    } catch (error) {
      console.error("Error handling chat query:", error);
      
    }
  }


  return (
    <div>

      {sessionMessages.length === 0 ? (
        <p>No messages yet. Start the conversation!</p>
      ) : (
        <ul>
          {sessionMessages.map((msg, index) => (
            <li key={index}>
              <div>{msg.message}</div>
              <div>{msg.botMessage}</div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={HandleChatQuery}>
        <textarea name="UserChat" id="UserChat"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatClient;
