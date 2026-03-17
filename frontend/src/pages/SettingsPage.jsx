import { useState } from "react";
import { THEMES } from "../theme.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { Send, Palette, Layout } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! Check out this new glass theme. ✨", isSent: false },
  {
    id: 2,
    content: "Looks incredibly sharp! I love the blur effects.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [previewTheme, setPreviewTheme] = useState(theme);

  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl relative z-10">
        <div className="bg-base-100/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl space-y-10">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit mb-2">
              <Palette className="size-3" /> Appearance
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              Interface Settings
            </h2>
            <p className="text-base-content/60 font-medium">
              Personalize your chat experience with custom themes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/50 ml-1">
              Select Theme
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`group flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-300 border-2 ${
                    theme === t
                      ? "border-primary bg-base-200 shadow-lg"
                      : "border-transparent bg-base-200/40 hover:bg-base-200/80"
                  }`}
                  onClick={() => {
                    setTheme(t);
                    setPreviewTheme(t);
                  }}
                  onMouseEnter={() => setPreviewTheme(t)}
                  onMouseLeave={() => setPreviewTheme(theme)}
                >
                  <div
                    className="relative h-10 w-full rounded-xl overflow-hidden shadow-inner"
                    data-theme={t}
                  >
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5">
                      <div className="rounded-lg bg-primary"></div>
                      <div className="rounded-lg bg-secondary"></div>
                      <div className="rounded-lg bg-accent"></div>
                      <div className="rounded-lg bg-neutral"></div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold truncate w-full text-center uppercase tracking-tighter ${
                      theme === t ? "text-primary" : "text-base-content/60"
                    }`}
                  >
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/50 ml-1 flex items-center gap-2">
              <Layout className="size-4" /> Live Preview
            </h3>
            <div className="rounded-3xl border border-white/5 overflow-hidden bg-base-200/50 p-4 md:p-8 shadow-inner">
              <div className="max-w-md mx-auto">
                <div
                  data-theme={previewTheme}
                  className="bg-base-100 rounded-[2.5rem] shadow-2xl border-[6px] border-base-300 overflow-hidden relative transition-all duration-500 ease-in-out"
                >
                  <div className="px-5 py-4 border-b border-base-300 bg-base-100/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5">
                        <div className="bg-base-100 size-full rounded-[14px] flex items-center justify-center text-primary font-black text-xs">
                          JD
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">John Doe</h3>
                        <p className="text-[10px] text-success font-bold flex items-center gap-1">
                          <span className="size-1.5 bg-success rounded-full animate-pulse" />{" "}
                          Online
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 min-h-[220px] max-h-[220px] overflow-y-auto bg-base-100/30">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-200/80 backdrop-blur-sm border border-white/5"
                          }`}
                        >
                          <p className="text-xs leading-relaxed font-medium">
                            {message.content}
                          </p>
                          <p
                            className={`text-[9px] mt-1.5 font-bold ${message.isSent ? "text-primary-content/60" : "text-base-content/40"}`}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-base-300 bg-base-100/50 backdrop-blur-md">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          className="input input-bordered w-full text-xs h-10 rounded-xl bg-base-200/50"
                          placeholder="Type a message..."
                          value="Design is looking great! ✨"
                          readOnly
                        />
                      </div>
                      <button className="btn btn-primary h-10 min-h-0 w-10 p-0 rounded-xl">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
