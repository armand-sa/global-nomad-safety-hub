"use client";

import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Cookie Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <hr className="my-6" />

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            This Cookie Policy explains how Global Nomad Safety uses cookies and similar technologies 
            to recognize you when you visit our website. It explains what these technologies are and 
            why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. What Are Cookies?</h2>
          <p className="mb-3">
            Cookies are small data files that are placed on your computer or mobile device when you visit 
            a website. Cookies are widely used by website owners to make their websites work, or to work 
            more efficiently, as well as to provide reporting information.
          </p>
          <p className="mb-3">
            Cookies set by the website owner (in this case, Global Nomad Safety) are called "first-party cookies." 
            Cookies set by parties other than the website owner are called "third-party cookies." Third-party 
            cookies enable third-party features or functionality to be provided on or through the website 
            (e.g., advertising, interactive content, and analytics).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Types of Cookies We Use</h2>
          <p className="mb-3">We use the following types of cookies:</p>
          
          <div className="ml-6 mb-3">
            <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
            <p className="mb-3">
              These cookies are necessary for the website to function and cannot be switched off in our systems. 
              They are usually only set in response to actions made by you which amount to a request for services, 
              such as setting your privacy preferences, logging in, or filling in forms.
            </p>
          </div>
          
          <div className="ml-6 mb-3">
            <h3 className="text-xl font-medium mb-2">Performance and Analytics Cookies</h3>
            <p className="mb-3">
              These cookies allow us to count visits and traffic sources so we can measure and improve the 
              performance of our site. They help us to know which pages are the most and least popular and 
              see how visitors move around the site.
            </p>
          </div>
          
          <div className="ml-6 mb-3">
            <h3 className="text-xl font-medium mb-2">Functionality Cookies</h3>
            <p className="mb-3">
              These cookies enable the website to provide enhanced functionality and personalization. 
              They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. How Can You Control Cookies?</h2>
          <p className="mb-3">
            You can set or amend your web browser controls to accept or refuse cookies. If you choose 
            to reject cookies, you may still use our website though your access to some functionality 
            and areas of our website may be restricted.
          </p>
          <p className="mb-3">
            Most web browsers allow some control of most cookies through the browser settings. To find 
            out more about cookies, including how to see what cookies have been set, visit 
            <a href="https://www.allaboutcookies.org" className="text-blue-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
              www.allaboutcookies.org
            </a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. EU Cookie Law Compliance</h2>
          <p className="mb-3">
            In compliance with the EU Cookie Law (ePrivacy Directive), we inform users about the cookies 
            used on our website and obtain consent for non-essential cookies. This is done through our 
            cookie consent banner that appears when you first visit our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Changes to This Cookie Policy</h2>
          <p className="mb-3">
            We may update this Cookie Policy from time to time. We will notify you of any changes by 
            posting the new Cookie Policy on this page.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="mb-3">
            If you have any questions about our Cookie Policy, please contact us at:
          </p>
          <p className="mb-3">Email: privacy@globalnomadsafety.com</p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-blue-500 hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
} 