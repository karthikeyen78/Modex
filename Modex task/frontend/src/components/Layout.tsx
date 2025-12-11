import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { label: 'User Home', path: '/', icon: Home },
        { label: 'Admin Dashboard', path: '/admin', icon: Shield },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient drop-shadow-lg">
                                    MOVIEX
                                </span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={clsx(
                                                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'border-indigo-400 text-indigo-300'
                                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                                            )}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};
