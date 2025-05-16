
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-transparent bg-clip-text">
            PopupLinkCraft
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/links">
            <Button variant="ghost">My Links</Button>
          </Link>
          <Link to="/create">
            <Button>Create New Link</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
