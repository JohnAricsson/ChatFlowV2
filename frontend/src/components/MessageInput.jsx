import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100/50 backdrop-blur-lg border-t border-white/5">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-2xl border-2 border-primary shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-error text-error-content 
              flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              type="button"
            >
              <X className="size-4" />
            </button>
            <div className="absolute inset-0 bg-primary/10 rounded-2xl pointer-events-none" />
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-base-content/40">
            Ready to send...
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-base-200/50 rounded-2xl p-1.5 border border-white/5 focus-within:border-primary/50 transition-all">
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-sm 
                     ${imagePreview ? "text-primary" : "text-base-content/40 hover:text-primary"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input
            type="text"
            className="input input-ghost w-full focus:outline-none focus:bg-transparent h-10 text-sm font-medium"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-circle shadow-lg transition-all duration-300
            ${
              text.trim() || imagePreview
                ? "btn-primary shadow-primary/20 scale-105"
                : "btn-ghost bg-base-200/50 text-base-content/20 cursor-not-allowed"
            }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send
            size={20}
            className={text.trim() || imagePreview ? "translate-x-0.5" : ""}
          />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
