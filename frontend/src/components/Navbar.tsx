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
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";

const navLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-vehicles", label: "My Vehicles", icon: Car },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      {/* ── Container ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ── Brand ─────────────────────────────────── */}
        <Link to="/" className="shrink-0">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Vehicle<span className="text-primary">Mart</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ──────────────────────── */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 mx-4 flex-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = loc.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Right Side ────────────────────────────── */}
        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <>
              {/* Add Vehicle — desktop */}
              <Link
                to="/add-vehicle"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus size={13} />
                Add Vehicle
              </Link>

              <ModeToggle />

              {/* Messages */}
              <button
                onClick={() => navigate("/messages")}
                className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <MessageSquare size={18} />
                {msgCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {msgCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <Bell size={18} />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Avatar dropdown — desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2.5 ml-1 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                        {user?.email}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
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

              {/* ── Mobile Hamburger ── */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                  >
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-72 p-0 flex flex-col">
                  {/* Sheet Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <span className="text-lg font-extrabold tracking-tight text-foreground">
                      Vehicle<span className="text-primary">Mart</span>
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-muted/40">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Nav links */}
                  <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
                    {navLinks.map(({ to, label, icon: Icon }) => {
                      const isActive = loc.pathname === to;
                      return (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                            ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                          <Icon size={16} />
                          {label}
                        </Link>
                      );
                    })}

                    <Separator className="my-2" />

                    <Link
                      to="/add-vehicle"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Plus size={16} />
                      Add Vehicle
                    </Link>
                  </nav>

                  {/* Logout at bottom */}
                  <div className="px-3 pb-6 pt-2 border-t border-border">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <ModeToggle />
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
      </div>
    </nav>
  );
}
