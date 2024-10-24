// Page that displays an edit the user data
// UI and some cases may be reupdated in the future when applying backend, this is just a sample template to have a starting point
// Including adding error messages, or updating button disablement cases & handilng them properly
"use client";

import { useEffect, useState } from "react";

const AccountSettings = () => {

    const [isEditable,setIsEditable] = useState(false);
    const [isChanged,setIsChanged] = useState(false);
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false); // To track if passwords match
    const [isPasswordCorrect,setIsPasswordCorrect] = useState(false); // To track if password is correct

    // after backend implementation done, data will be updated
    const initialUserData = {
        userName: 'magic14',
        firstName: 'Fernando',
        lastName: 'Alonso',
        taxID: "6431-2861-5697",
        phone: '+34 123 456 789',
        email: 'magicalonso@gmail.com',
        address: 'Oviedo, Spain',
        password: '12345',
    }

    const [userData, setUserData] = useState(initialUserData);

    const toggleEdit = () => setIsEditable(!isEditable);

    //Tracking user activity
    useEffect(() => {
        const isDataChanged = Object.keys(initialUserData).some(
          (key) => userData[key as keyof typeof userData] !== initialUserData[key as keyof typeof initialUserData]
        );
        setIsChanged(isDataChanged);

        if (password === confirmPassword && password === initialUserData.password && password && confirmPassword){
            setIsPasswordValid(true);
        } else if (password && confirmPassword && password !== confirmPassword){
            setIsPasswordValid(false);
        } else {
            setIsPasswordValid(false);
        }
      }, [userData, password, confirmPassword]);

    //Rendering each object
    const RenderObject = (label: string, value: string, fieldName: string, type: string = 'text') => (
        <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            {isEditable ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => setUserData({ ...userData, [fieldName]: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                >
                </input>
            ) : (
                <p className="text-gray-900 dark:text-white">{value}</p>
            )}
        </div>
    );

    return (
        <div>
            {/* Header and Edit Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Account Settings</h1>
                <button
                    onClick={() => {
                        if(isEditable){
                            setUserData(initialUserData);
                            setPassword('');
                            setConfirmPassword('');
                        }
                        toggleEdit();
                    }}
                    className="text-blue-700 hover:text-blue-900 font-medium mt-2"
                >
                    {isEditable ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {/* The Form */}
            <div className="mt-12">
                <form>
                    {/* User Information Objects */}
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        {RenderObject('First Name', userData.firstName, 'firstName')}
                        {RenderObject('Last Name', userData.lastName, 'lastName')}
                        {RenderObject('User Name', userData.userName, 'userName')}
                        {RenderObject('Tax ID', userData.taxID, 'taxID')}
                        {RenderObject('Phone number', userData.phone, 'phone', 'tel')}
                        {RenderObject('Email Address', userData.email, 'email', 'email')}
                        {RenderObject('Home Address', userData.address, 'address')}
                    </div>

                    {/* Password Implementation */}
                    {isEditable && (
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    placeholder = "Enter your password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <input
                                    placeholder = "Confirm your password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Save and Cancel Buttons */}
                    {isEditable && (
                        <div className="flex justify-end mt-3">
                            <button
                                type="submit"
                                onClick={() => {
                                    alert('Changes saved!');
                                    toggleEdit();
                                    setPassword('');
                                    setConfirmPassword('');
                                }}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2
                                            disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
                                disabled={!isPasswordValid || !isChanged}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    toggleEdit();
                                    setUserData(initialUserData);
                                    setPassword('');
                                    setConfirmPassword('');
                                }}
                                className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>

        </div>
    )
}

export default AccountSettings;
