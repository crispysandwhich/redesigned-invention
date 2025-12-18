"use client";

interface ChatClientProps {
  userMessages: any[];
}

const ChatClient = ({ userMessages }: ChatClientProps) => {
  return (
    <div>
      {userMessages.length === 0 ? (
        <p>No messages yet. Start the conversation!</p>
      ) : (
        <ul>
          {userMessages.map((msg, index) => (
            <li key={index}>{msg.content}</li>
          ))}
        </ul>
      )}

      <form>
        <textarea name="UserChat" id="UserChat"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatClient;
