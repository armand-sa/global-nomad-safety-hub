"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      // In a real implementation, this would call your API to send a reset email
      // For now, we'll just simulate success
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
        
        {!isSubmitted ? (
          <>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Enter your email address below and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </div>
              
              {error && (
                <div className="mb-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-green-500 text-xl">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Reset Link Sent!</p>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/login?auth=true" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 