"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface AccountSettingsProps{
    useData: User;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ useData }) => {

    // initial data that is stoder in the backend
    const [initialData, setInitialData] = useState({
        firstName: useData.firstName || "",
        lastName: useData.lastName || "",
        email: useData.email,
        phoneNumber: useData.phoneNumber || "",
        address: useData.address || "",
        taxId: useData.taxId || "",
      });

    const [isChanged,setIsChanged] = useState(false);
    const [currentData, setCurrentData] = useState(initialData); // current data entering by the user
    const [errorMessage, setErrorMessage] = useState('');

    // Function for revent saving if a previously non-empty field is now empty.
    const hasInvalidFields = (): boolean => {
        return Object.keys(initialData).some((key) => {
            const initialValue = initialData[key as keyof typeof initialData];
            const currentValue = currentData[key as keyof typeof currentData];
            if (initialValue !== "" && currentValue === "") {
                return true;
            }
            return false;
        });
    };

    // Dynamic rendering object for each field in the form
    const RenderObject = (
        label: string,
        value: string,
        fieldName: string,
        editableObject: boolean = true,
        placeholder: string = `Enter your ${label}`
      ) => (
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {label}
          </label>
          {editableObject ? (
            <input
              value={value}
              placeholder={placeholder}
              onChange={(e) =>
                setCurrentData((prev) => ({
                  ...prev,
                  [fieldName]: e.target.value, // Updating the field dynamically
                }))
              }
              className="bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            ></input>
          ) : (
            <input
                value={value}
                readOnly // Makes the input box non-editable
                className="bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
            />
            )}
        </div>
      );

    // tracking changes made by user
    useEffect(() => {
        const isDataChanged = Object.keys(initialData).some((key) => {
            return (
                currentData[key as keyof typeof currentData] !== initialData[key as keyof typeof initialData]
            );
        });
        setIsChanged(isDataChanged  && !hasInvalidFields());
    }, [currentData]);

    // submit function that handles saving new information and server communication
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`/api/users?_id=${useData._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentData),
            });

            const data = await response.json();

            if (!response.ok) {
                setCurrentData(initialData);
                throw new Error(data.message || "An error occurred while saving changes.");
            }
    
            alert("Changes saved successfully!");
            setInitialData(currentData); // Updating initial data after saving
            setErrorMessage('');

        } catch (error: any) {
            setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
        }
    };
    

    return (
        <div>
            {/* Header and Edit Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Account Settings</h1>
            </div>

            {/* The Form */}
            <div className="mt-12">
                <form onSubmit={handleSubmit}>
                    {/* User Information Objects */}
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        {RenderObject("Name", currentData.firstName, "firstName")}
                        {RenderObject("Surname", currentData.lastName, "lastName")}
                        {RenderObject("E-Mail", currentData.email, "email", false)}
                        {RenderObject("Phone Number", currentData.phoneNumber, "phoneNumber", true, "Enter your Phone Number (5xxxxxxxxx)")}
                        {RenderObject("Home Address", currentData.address, "address")}
                        {RenderObject("Tax ID", currentData.taxId, "taxId")}
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="flex justify-end mt-9">
                        {errorMessage && <p className="text-red-600 mr-4">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2
                                        disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
                            disabled={!isChanged}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentData(initialData);
                            }}
                            className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
};

export default AccountSettings;