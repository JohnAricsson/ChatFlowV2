import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-4 border-b border-white/5 bg-base-100/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary shadow-lg">
              <div className="bg-base-100 size-full rounded-full p-0.5">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-tight">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <p className="text-[10px] font-bold text-success uppercase tracking-wider">
                    Online
                  </p>
                </div>
              ) : (
                <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                  Offline
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <div className="hidden sm:flex items-center gap-1 mr-2">
            <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary transition-colors">
              <Phone size={18} />
            </button>
            <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary transition-colors">
              <Video size={18} />
            </button>
          </div> */}

          <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
