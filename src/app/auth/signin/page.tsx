"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/',
        });

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            window.location.href = result?.url || '/';
        }

        
    };

    const goToShoppingPage = () => {
        router.push('/shop/browse'); // Navigate to the shopping page
    }

    return (
        <div className="signin-page">
            <h1>Sign In</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignIn} className="signin-form">
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="email-input"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="password-input"
                    />
                </div>
                <button type="submit" className="signin-button">Sign in</button>
                <button type="button" onClick={goToShoppingPage} className="shopping-button">Go to Shopping</button>
            </form>
        </div>
    );
};

export default SignInPage;
