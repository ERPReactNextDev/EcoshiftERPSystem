'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!Email || !Password || !Department) {
            toast.error("All fields are required!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email, Password, Department }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.Department && result.Department !== Department) {
                    toast.error("Department mismatch! Please check your selection.");
                    setLoading(false);
                    return;
                }

                toast.success("Login successful!");
                setTimeout(() => {
                    if (result.Department === "CSR") {
                        router.push(`/ModuleCSR/CSR/Dashboard?id=${encodeURIComponent(result.userId)}`);
                    } else if (result.Department === "Sales") {
                        router.push(`/ModuleSales/Sales/Dashboard?id=${encodeURIComponent(result.userId)}`);
                    } else {
                        toast.error("Invalid department selection");
                    }
                }, 1500);
            } else {
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred while logging in!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center relative p-4"
            style={{ backgroundImage: "url('/reactmode.jpg')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 shadow-lg"></div>
            <ToastContainer className="text-xs" />
            <div className="relative z-10 w-full max-w-md p-8 bg-white backdrop-blur-lg rounded-lg shadow-xl text-center">
                <Image src="/next.svg" alt="Ecoshift Corporation" width={100} height={100} className="mx-auto mb-4 drop-shadow-[2px_2px_3px_white]" />
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-dark mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-dark mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="6+ Characters, 1 Capital letter"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-dark mb-1">Department</label>
                        <select
                            value={Department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                        >
                            <option value="">Select Department</option>
                            <option value="CSR">CSR</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full text-xs py-3 bg-green-800 text-white font-medium rounded-md hover:bg-green-600 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <footer className="mt-4 text-xs text-dark font-bold">
                    <p>Developer Mode - IT Department | Leroux Y Xchire</p>
                </footer>
            </div>
        </div>
    );
};

export default Login;
