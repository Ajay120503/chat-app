import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      {/* Center container */}
      <div className="flex items-center justify-center pt-16 px-2 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-[1440px] h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar handles its own responsiveness */}
            <Sidebar />

            {/* Main Chat Area */}
            <div className="flex-1">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
