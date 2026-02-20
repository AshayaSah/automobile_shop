import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Search,
  Car,
  UserCircle,
  MessageSquare,
  Bell,
  Plus,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-vehicles", label: "My Vehicles", icon: Car },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useNavigate();
  const navigate = useNavigate();
  const loc = useLocation();

  const [notifCount] = useState(3);
  const [msgCount] = useState(2);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav className="w-full bg-background border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      {/* ── Brand ─────────────────────────────────── */}
      <Link to="/" className="shrink-0">
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Vehicle<span className="text-primary">Mart</span>
        </span>
      </Link>

      {/* ── Nav Links ─────────────────────────────── */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-1 mx-8">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {isActive && <Icon size={14} />}
                {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Right Side ────────────────────────────── */}
      <div className="flex items-center gap-3 ml-auto">
        {isAuthenticated ? (
          <>
            {/* Add Vehicle */}
            <Link
              to="/add-vehicle"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={13} />
              Add Vehicle
            </Link>

            {/* Messages */}
            <button
              onClick={() => navigate("/messages")}
              className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={19} />
              {msgCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {msgCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell size={19} />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </button>

            {/* User — avatar + name/email inline, dropdown on click */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 ml-1 outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-foreground">
                      {user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCircle size={14} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-vehicles")}>
                  <Car size={14} className="mr-2" />
                  My Vehicles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut size={14} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
