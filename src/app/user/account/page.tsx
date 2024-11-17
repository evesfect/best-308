"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface AccountSettingsProps{
    useData: User;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ useData }) => {

    // Directly access properties with optional chaining
    const username = useData?.username ?? "N/A";
    const email = useData?.email ?? "N/A";
    const address = useData?.address ?? "N/A";
    const role = useData?.role ?? "N/A";

    // Helper function to render each field
    const RenderObject = (label: string, value: string) => (
        <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <p className="text-gray-900 dark:text-white">{value}</p>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Account Settings</h1>
            </div>
            <div className="mt-12">
                <form>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        {RenderObject("User Name", username)}
                        {RenderObject("E-Mail", email)}
                        {RenderObject("Home Address", address)}
                        {RenderObject("User Role", role)}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;
