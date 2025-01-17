import { signOut } from 'next-auth/react';
import React, { useState } from 'react';

interface SidebarProps {
    onItemClick: (item: string) => void;
}

const UserSidebar: React.FC<SidebarProps> = ({onItemClick}) => {

    return (
        <div className="w-64 bg-white p-6 rounded-lg">
          {/* Sidebar Title & Header */}
          <div className="pb-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">My Account</h2>
          </div>
    
          {/* Sidebar Menu */}
          <div className='pb-4 border-b'>
          <nav className="pt-4">
            <ul>
              <li className="py-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                <button onClick={() => onItemClick('accountSettings')} className="block text-gray-700">Account Settings</button>
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                <button onClick={() => onItemClick('orders')} className="block text-gray-700">Orders</button>
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                <button onClick={() => onItemClick('comments')} className="block text-gray-700">Comments & Ratings</button>
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                <button onClick={() => onItemClick('changePassword')} className="block text-gray-700">Change Password</button>
              </li>
            </ul>
          </nav>
          </div>

          {/* Logout Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-6" onClick={() => signOut({ callbackUrl: "/" })} >
                <img src="/icons/logout.svg" alt="icon" className="h-5 w-5" />
                <span>Sign Out</span>
            </button>
        </div>
      );
}

export default UserSidebar;

