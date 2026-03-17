import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/5 flex flex-col transition-all duration-200 bg-base-100/30 backdrop-blur-sm">
      <div className="border-b border-white/5 w-full p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-base-content/5">
            <Users className="size-6 text-base-content/20" />
          </div>
          <div className="hidden lg:block space-y-2">
            <div className="skeleton h-4 w-20 opacity-50" />
            <div className="skeleton h-3 w-12 opacity-30" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 space-y-1">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 opacity-80"
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full ring-4 ring-base-content/5" />

              <div className="absolute bottom-0 right-0 size-3 bg-base-300 rounded-full border-2 border-base-100" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded-lg" />
              <div className="skeleton h-3 w-1/2 rounded-lg opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
