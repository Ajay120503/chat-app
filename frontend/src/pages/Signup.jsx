import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const { signup, isSigningUp } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const { fullName, email, password } = formData;

        if (!fullName || fullName.trim().length < 5) {
            toast.error("Full name must be at least 6 characters");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            signup(formData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-12">
            <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-base-200 rounded-xl shadow-xl overflow-hidden border border-primary/20">

                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div className="text-center">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="size-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                                <p className="text-base-content/60">Get started with your free account</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Full Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Full Name</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-2 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="size-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-2 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="size-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Password</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-2 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="size-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="input input-bordered w-full pl-10 pr-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isSigningUp}
                            >
                                {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Sign Up"}
                            </button>

                            {/* Redirect to Login */}
                            <p className="text-sm text-center text-base-content/60">
                                Already have an account?{' '}
                                <Link to="/login" className="link link-primary">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="w-full max-w-sm p-6">
                        <img
                            src="/ChatImg.png"
                            alt="Signup Illustration"
                            className="w-full h-auto object-contain rounded-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
