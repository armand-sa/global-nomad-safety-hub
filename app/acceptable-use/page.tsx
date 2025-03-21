"use client";

import React from 'react';
import Link from 'next/link';

export default function AcceptableUsePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Acceptable Use Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <hr className="my-6" />

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            This Acceptable Use Policy outlines the acceptable uses of Global Nomad Safety's website, services, and related applications. 
            By accessing or using our services, you agree to comply with this policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. Prohibited Activities</h2>
          <p className="mb-3">
            When using our services, you agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              Violating any applicable laws, regulations, or third-party rights
            </li>
            <li className="mb-2">
              Posting, uploading, or distributing any content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable
            </li>
            <li className="mb-2">
              Engaging in any activity that interferes with or disrupts our services or networks connected to our services
            </li>
            <li className="mb-2">
              Attempting to gain unauthorized access to our systems, user accounts, or networks
            </li>
            <li className="mb-2">
              Using automated means to access our services without our authorization
            </li>
            <li className="mb-2">
              Collecting or harvesting any personally identifiable information from our services
            </li>
            <li className="mb-2">
              Using our services to transmit any viruses, malware, or other malicious code
            </li>
            <li className="mb-2">
              Impersonating another person or entity, or falsely stating or misrepresenting your affiliation with a person or entity
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Content Guidelines</h2>
          <p className="mb-3">
            When contributing content to our platform (such as comments, reviews, or user-generated content), you must ensure that your content:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              Is accurate and truthful to the best of your knowledge
            </li>
            <li className="mb-2">
              Does not infringe on any third-party intellectual property rights
            </li>
            <li className="mb-2">
              Does not contain personal or sensitive information about others without their explicit consent
            </li>
            <li className="mb-2">
              Is not spam, machine-generated, or nonsensical content
            </li>
            <li className="mb-2">
              Does not promote illegal activities or contain instructions for dangerous or harmful activities
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Account Usage</h2>
          <p className="mb-3">
            If you create an account with Global Nomad Safety, you are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              Maintaining the confidentiality of your account credentials
            </li>
            <li className="mb-2">
              All activities that occur under your account
            </li>
            <li className="mb-2">
              Ensuring that any person who accesses your account is aware of and complies with these terms
            </li>
            <li className="mb-2">
              Notifying us immediately of any unauthorized access to or use of your account
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Enforcement</h2>
          <p className="mb-3">
            We reserve the right, but are not obligated, to monitor and review content and activity on our services. If we believe a violation 
            of this policy has occurred, we may take any of the following actions:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              Issue a warning to the user
            </li>
            <li className="mb-2">
              Temporarily or permanently suspend or terminate the user's account
            </li>
            <li className="mb-2">
              Remove or block access to content that violates this policy
            </li>
            <li className="mb-2">
              Report the activity to law enforcement authorities if appropriate
            </li>
            <li className="mb-2">
              Take any other action we deem appropriate
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Reporting Violations</h2>
          <p className="mb-3">
            If you encounter content or behavior on our services that you believe violates this Acceptable Use Policy, please report it to us at 
            support@globalnomadsafety.com.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p className="mb-3">
            We may update this Acceptable Use Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-blue-500 hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-blue-500 hover:underline mr-4">
            Terms of Service
          </Link>
          <Link href="/cookies" className="text-blue-500 hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
