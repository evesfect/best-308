"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/StaticTopBar";
import AccountSettings from "./account/page";
import UserSidebar from "@/components/UserSidebar";
import { User } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import UserOrders from "./order/page";

interface MainContentProps {
    activeItem: string;
    userData: User;
}

const MainContent: React.FC<MainContentProps> = ({ activeItem, userData }) => {
    return (
        <div className="flex-1 p-6 bg-white bg-opacity-95 border border-gray-200 rounded-lg shadow-lg overflow-y-auto overflow-x-auto hide-scrollbar">
        {/* Rendering according to the active sidebar item */}
        {activeItem === 'accountSettings' && (
          <div>
            <AccountSettings useData={userData}/>
          </div>
        )}
        {activeItem === 'orders' && (
          <div>
            <UserOrders userId={userData._id}/>
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
        <div className="bg-white min-h-full">
            <TopBar />
            <div {...handleTabClick} className="flex-grow flex mt-[96px] gap-10 p-20 px-20">
                <div className="bg-gray-100 bg-white bg-opacity-95 border border-gray-200 rounded-lg shadow-lg flex flex-col h-full">
                    <UserSidebar onItemClick={setActiveItem} />
                </div>
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
