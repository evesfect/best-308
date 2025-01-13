"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";

interface AccountSettingsProps {
  useData: User;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ useData }) => {
  const [initialData, setInitialData] = useState({
    firstName: useData.firstName || "",
    lastName: useData.lastName || "",
    email: useData.email,
    phoneNumber: useData.phoneNumber || "",
    address: useData.address || "",
    taxId: useData.taxId || "",
    id: useData._id.toString() || "",
  });

  const [currentData, setCurrentData] = useState(initialData);
  const [isChanged, setIsChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const formatPhoneNumber = (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, "TR"); // Default region: Türkiye
    return phoneNumber ? phoneNumber.formatInternational() : phone;
  };

  const handlePhoneChange = (phone: string) => {
    const isValid = isValidPhoneNumber(phone, "TR");
    if (!isValid && phone !== "") {
      setErrorMessage("Invalid phone number.");
    } else {
      setErrorMessage("");
    }

    setCurrentData((prev) => ({
      ...prev,
      phoneNumber: phone,
    }));
  };

  const RenderObject = (
    label: string,
    value: string,
    fieldName: string,
    editableObject: boolean = true,
    placeholder: string = `Enter your ${label}`
  ) => {
    if (fieldName === "phoneNumber") {
      return (
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {label}
          </label>
          <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          />
          {errorMessage && (
            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      );
    }

    return (
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
                [fieldName]: e.target.value,
              }))
            }
            className="bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          />
        ) : (
          <input
            value={value}
            readOnly
            className="bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    const isDataChanged = Object.keys(initialData).some((key) => {
      return (
        currentData[key as keyof typeof currentData] !==
        initialData[key as keyof typeof initialData]
      );
    });
    setIsChanged(isDataChanged && !hasInvalidFields());
  }, [currentData]);

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
      setInitialData(currentData);
      setErrorMessage("");
      setIsChanged(false);
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <h1 className="text-1xl">{initialData.id}</h1>
      </div>

      <div className="mt-12">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {RenderObject("Name", currentData.firstName, "firstName")}
            {RenderObject("Surname", currentData.lastName, "lastName")}
            {RenderObject("E-Mail", currentData.email, "email", false)}
            {RenderObject(
              "Phone Number",
              formatPhoneNumber(currentData.phoneNumber),
              "phoneNumber"
            )}
            {RenderObject("Home Address", currentData.address, "address")}
            {RenderObject("Tax ID", currentData.taxId, "taxId")}
          </div>

          <div className="flex justify-end mt-9">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
              disabled={!isChanged || errorMessage !== ""}
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
  );
};

export default AccountSettings;
