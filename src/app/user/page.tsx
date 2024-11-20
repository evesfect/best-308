"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/StaticTopBar";
import AccountSettings from "./account/page";
import UserSidebar from "@/components/UserSidebar";
import { User } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";

interface MainContentProps {
    activeItem: string;
    userData: User;
}

const MainContent: React.FC<MainContentProps> = ({ activeItem, userData }) => {
    return (
      <div className="flex-1 p-6 bg-white rounded-lg overflow-y-auto overflow-x-hidden hide-scrollbar">
        {/* Rendering according to the active sidebar item */}
        {activeItem === 'accountSettings' && (
          <div>
            <AccountSettings useData={userData}/>
          </div>
        )}
        {activeItem === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p>Here you can view and manage your orders.</p>
          </div>
        )}
        {activeItem === 'wishlist' && (
          <div>
            <h1 className="text-2xl font-bold">Wishlist</h1>
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

const UserPanel: React.FC = () => {
    const { data: session, status } = useSession();
    const [activeItem, setActiveItem] = useState<string>("accountSettings");
    const [userData, setUserData] = useState<User | null>(null);

    const handleTabClick = (tabName: React.SetStateAction<string>) => {
        setActiveItem(tabName);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "authenticated" && session?.user?.id) {
                try {
                    const response = await axios.get(`/api/users`, {
                        params: { _id: session.user.id },
                    });
                    setUserData(response.data.user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        if (status === "authenticated") {
            fetchUserData();
        }
    }, [status]);

    return (
        <div>
            <TopBar />
            <div {...handleTabClick} className="flex mt-20 gap-10 p-20 px-20 h-[calc(100vh-96px)]">
                <UserSidebar onItemClick={setActiveItem} />
                {userData ? (
                    <MainContent activeItem={activeItem} userData={userData} />
                ) : (
                    <div className="flex justify-center items-center w-full">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-4"></div>
                        <p className="text-lg font-semibold">Loading account information...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPanel;
