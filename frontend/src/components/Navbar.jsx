import { Link, useLocation } from "react-router-dom"; // 1. Import useLocation
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Sparkles,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  return (
    <header className="bg-base-100/60 border-b border-white/5 fixed w-full top-0 z-40 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all group"
            >
              <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/10">
                <div className="bg-base-100 size-full rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <MessageSquare className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="md:text-2xl text-lg font-black tracking-tight leading-none">
                  CHATFLOW
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all rounded-lg"
            >
              <Settings className="md:w-5 md:h-5 w-4 h-4 text-base-content/70" />
              <span className="hidden sm:inline font-medium md:text-lg">
                Settings
              </span>
            </Link>

            {authUser ? (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-ghost btn-sm gap-2 hover:bg-secondary/10 transition-all rounded-lg"
                >
                  <User className="size-4" />
                  <span className="md:text-lg hidden sm:inline font-medium">
                    Profile
                  </span>
                </Link>

                <button
                  className="btn btn-sm btn-error btn-outline gap-2 rounded-lg ml-2"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="md:text-lg hidden sm:inline">Logout</span>
                </button>
              </>
            ) : location.pathname === "/login" ? (
              <Link
                to="/signup"
                className="btn btn-primary btn-sm rounded-lg gap-2 shadow-lg shadow-primary/20 md:text-lg"
              >
                <UserPlus className="size-4" />
                Sign Up
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm rounded-lg gap-2 shadow-lg shadow-primary/20 md:text-xl"
              >
                <Sparkles className="size-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
