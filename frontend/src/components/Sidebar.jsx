import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { Users, Circle, Pin, PinOff, Trash2, Star } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    pinChat,
    removeChat,
    pinnedChats,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
    .sort((a, b) => {
      const aPinned = pinnedChats?.includes(a._id) || false;
      const bPinned = pinnedChats?.includes(b._id) || false;
      return bPinned - aPinned;
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100/50 backdrop-blur-xl">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <span className="md:text-lg font-bold tracking-tight hidden lg:block">
              Contacts
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-3">
          <label className="cursor-pointer group flex items-center justify-between p-2 rounded-xl hover:bg-base-200 transition-all">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm rounded-md"
              />
              <span className="text-xs font-semibold text-base-content/60">
                Online Only
              </span>
            </div>
            <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
              {Math.max(0, onlineUsers.length - 1)} online
            </span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 px-2 custom-scrollbar">
        {filteredUsers.map((user) => {
          const isPinned = pinnedChats?.includes(user._id);
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div key={user._id} className="relative group">
              <button
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 rounded-2xl mb-1 transition-all duration-300 relative
                  ${
                    selectedUser?._id === user._id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                  }
                `}
              >
                <div className="relative shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-11 object-cover rounded-full border-2 border-base-100"
                  />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100 shadow-lg" />
                  )}

                  {isPinned && (
                    <span className="absolute -top-1 -right-1 text-primary">
                      <Star className="size-3.5 fill-current" />
                    </span>
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div
                    className={`font-bold text-sm truncate ${isPinned ? "text-primary" : ""}`}
                  >
                    {user.fullName}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-tighter opacity-60">
                    {isOnline ? (
                      <span className="text-success">Active now</span>
                    ) : (
                      <span className="text-base-content/40">Offline</span>
                    )}
                  </div>
                </div>
              </button>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-base-100 shadow-xl border border-base-300 p-1.5 rounded-xl z-10">
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    pinChat(user._id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isPinned
                      ? "text-primary bg-primary/10"
                      : "text-base-content/40 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {isPinned ? (
                    <PinOff className="size-3.5" />
                  ) : (
                    <Pin className="size-3.5" />
                  )}
                </button>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    removeChat(user._id);
                  }}
                  className="p-1.5 text-base-content/40 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 opacity-40 text-sm">
            {showOnlineOnly ? "No online contacts" : "No conversations found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
