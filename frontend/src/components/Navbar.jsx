import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Menu } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 fixed top-0 z-50 backdrop-blur-md bg-base-100/80">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">CWF</h1>
          </Link>
        </div>

        {/* Right Side: Desktop Menu */}
        <div className="hidden md:flex gap-2">
          <Link to="/settings" className="btn btn-sm btn-ghost gap-2">
            <Settings className="size-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className="btn btn-sm btn-ghost gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={logout} className="btn btn-sm btn-ghost gap-2">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-sm">
            <Menu className="w-5 h-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/settings">
                <Settings className="size-4" />
                Settings
              </Link>
            </li>
            {authUser && (
              <>
                <li>
                  <Link to="/profile">
                    <User className="size-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
