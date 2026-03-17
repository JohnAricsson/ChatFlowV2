import { MessageSquare, Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import welcomeAnimation from "../assets/animations/Chat.json";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-md text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="w-64 h-64 mx-auto">
              <Lottie animationData={welcomeAnimation} loop={true} />
            </div>

            <div className="absolute -bottom-4 -right-4 size-16 rounded-3xl bg-base-100 shadow-2xl flex items-center justify-center border border-white/10 animate-bounce">
              <MessageSquare className="size-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="size-3" /> Ready to connect
          </div>

          <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-base-content to-base-content/50 bg-clip-text text-transparent">
            Welcome to ChatFlow!
          </h2>
        </div>
      </div>{" "}
      {/* End max-w-md */}
    </div>
  );
};

export default NoChatSelected;
