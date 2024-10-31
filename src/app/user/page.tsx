"use client";

import { useState } from "react";
import { Role } from "@/types/roles";
import TopBar from "@/components/StaticTopBar";
import AccountSettings from "./account/page";
import UserSidebar from "@/components/UserSidebar";

interface User {
    _id: string;
    username: string;
    email: string;
    password: string; // Hashed password
    role: Role;
}

interface MainContentProps {
    activeItem: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeItem }) => {
    return (
      <div className="flex-1 p-6 bg-white rounded-lg overflow-y-auto overflow-x-hidden hide-scrollbar">
        {/* Rendering according to the active sidebar item */}
        {activeItem === 'accountSettings' && (
          <div>
            <AccountSettings/>
          </div>
        )}
        {activeItem === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p>Here you can view and manage your orders.</p>
          </div>
        )}
        {activeItem === 'favorites' && (
          <div>
            <h1 className="text-2xl font-bold">Favorites</h1>
            <p>Here are your favorite items.</p>
          </div>
        )}
        {activeItem === 'comments' && (
          <div>
            <h1 className="text-2xl font-bold">Comments & Ratings</h1>
            <p>Here you can manage your comments and ratings.</p>
          </div>
        )}
        {activeItem === 'changePassword' && (
          <div>
            <h1 className="text-2xl font-bold">Change Password</h1>
            <p>Here you can change your password.</p>
          </div>
        )}
      </div>
    );
  };

const UserPanel = () => {
    const [activeItem, setActiveItem] = useState<string>('accountSettings');

    const handleTabClick = (tabName: React.SetStateAction<string>) => {
        setActiveItem(tabName);
    };

    return (
        <div>
            <TopBar/>
            <div {...handleTabClick} className="flex mt-20 gap-10 p-20 px-20 h-[calc(100vh-96px)]">
                <UserSidebar onItemClick={setActiveItem}/>
                <MainContent activeItem={activeItem} />
            </div>
        </div>
    );
};

export default UserPanel;
