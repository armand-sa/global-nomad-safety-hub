"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <hr className="my-6" />

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            Welcome to Global Nomad Safety. These Terms of Service govern your use of our website, 
            including any content, functionality, and services offered on or through the website.
          </p>
          <p className="mb-3">
            By using our website, you accept and agree to be bound by these Terms of Service. 
            If you do not agree with any part of these terms, you may not use our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. User Conduct</h2>
          <p className="mb-3">
            When using our website, you agree not to:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              Use our website in any way that violates applicable laws or regulations.
            </li>
            <li className="mb-2">
              Engage in any conduct that restricts or inhibits anyone's use of the website.
            </li>
            <li className="mb-2">
              Use the website to transmit or send unsolicited commercial communications.
            </li>
            <li className="mb-2">
              Attempt to gain unauthorized access to our systems or user accounts.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Account Registration</h2>
          <p className="mb-3">
            To access certain features of our website, you may need to register for an account. 
            You agree to provide accurate information during the registration process and to keep 
            your account information updated.
          </p>
          <p className="mb-3">
            You are responsible for maintaining the confidentiality of your account credentials 
            and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
          <p className="mb-3">
            The website and its entire contents, features, and functionality are owned by Global Nomad Safety 
            and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Disclaimer of Warranties</h2>
          <p className="mb-3">
            Our website is provided on an "as is" and "as available" basis. We make no warranties, 
            expressed or implied, regarding the operation or availability of the website.
          </p>
          <p className="mb-3">
            We do not guarantee that the information provided on our website is accurate, complete, or up-to-date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p className="mb-3">
            In no event shall Global Nomad Safety be liable for any direct, indirect, incidental, 
            special, or consequential damages arising out of or in any way connected with the use of our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
          <p className="mb-3">
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which you reside.
          </p>
          <p className="mb-3">
            For EU users, these terms are governed by the laws of Ireland, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
          <p className="mb-3">
            We may revise these Terms of Service at any time without notice. By continuing to use our website after 
            any changes, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
          <p className="mb-3">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-3">Email: support@globalnomadsafety.com</p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-blue-500 hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="text-blue-500 hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
} 