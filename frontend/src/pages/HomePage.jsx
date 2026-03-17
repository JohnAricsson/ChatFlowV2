import { useState } from "react";
import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, searchUsers, searchResults, setSelectedUser } =
    useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] flex flex-col overflow-visible">
          <div className="px-6 py-4 border-b border-base-300 bg-base-100/40 backdrop-blur-xl flex items-center justify-between gap-4 rounded-t-lg relative z-[100]">
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold tracking-tight">Messages</h2>
              <p className="text-xs text-base-content/50">Stay connected</p>
            </div>

            <div className="relative w-full max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="size-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
              </div>

              <input
                type="text"
                placeholder="Search for a user.."
                className="font-bold w-full pl-10 pr-4 py-2 bg-base-200/50 border border-primary/30 focus:border-primary focus:bg-base-100 rounded-xl outline-none transition-all duration-200 text-sm shadow-inner"
                value={searchTerm}
                onChange={handleSearch}
              />

              {searchTerm && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[90vw] md:w-full bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-[200] overflow-hidden">
                  <div className="p-2 max-h-[380px] overflow-y-auto">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                      Search Results
                    </div>

                    {searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <button
                          key={user._id}
                          onMouseDown={(event) => {
                            event.preventDefault(); // Prevents input blur
                            setSelectedUser(user);
                            setSearchTerm("");
                            useChatStore.setState({ searchResults: [] });
                          }}
                          className="cursor-pointer flex items-center gap-3 w-full p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                        >
                          <img
                            src={user.profilePic || "/avatar.png"}
                            alt={user.fullName}
                            className="size-10 rounded-full object-cover shrink-0"
                          />

                          <div className="text-left flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {user.fullName}
                            </div>
                            <div className="text-[11px] text-base-content/50 truncate">
                              {user.email}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center text-sm text-base-content/50">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 h-full overflow-hidden relative">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
