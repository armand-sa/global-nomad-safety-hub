"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <hr className="my-6" />

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            At Global Nomad Safety, we respect your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <p className="mb-3">
            We may collect the following types of personal information:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              <strong>Personal Identifiers:</strong> Name, email address, phone number, and similar identifiers.
            </li>
            <li className="mb-2">
              <strong>Account Information:</strong> Username, password, and account preferences.
            </li>
            <li className="mb-2">
              <strong>Usage Data:</strong> Information on how you use our website, including browser type, IP address, pages visited, and time spent on the website.
            </li>
            <li className="mb-2">
              <strong>Location Data:</strong> General location information based on IP address.
            </li>
            <li className="mb-2">
              <strong>Cookies and Similar Technologies:</strong> Information collected through cookies, web beacons, and similar technologies.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="mb-3">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              To provide and maintain our services, including safety alerts and recommendations.
            </li>
            <li className="mb-2">
              To improve and personalize your experience on our website.
            </li>
            <li className="mb-2">
              To communicate with you about updates, security alerts, and support messages.
            </li>
            <li className="mb-2">
              To detect, prevent, and address technical issues or security breaches.
            </li>
            <li className="mb-2">
              To comply with legal obligations and enforce our terms of service.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Legal Basis for Processing (EU/EEA Users)</h2>
          <p className="mb-3">
            For users in the European Union or European Economic Area, we process your personal data under the following legal bases:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              <strong>Consent:</strong> You have given consent for processing for specific purposes.
            </li>
            <li className="mb-2">
              <strong>Contractual Necessity:</strong> Processing is necessary for the performance of a contract.
            </li>
            <li className="mb-2">
              <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests, such as improving our services.
            </li>
            <li className="mb-2">
              <strong>Legal Obligation:</strong> Processing is necessary for compliance with legal obligations.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
          <p className="mb-3">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf.
            </li>
            <li className="mb-2">
              <strong>Legal Requirements:</strong> If required by law, regulation, or legal process.
            </li>
            <li className="mb-2">
              <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
          <p className="mb-3">
            We implement appropriate technical and organizational measures to protect your personal data.
            However, no method of transmission over the Internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Your Data Protection Rights</h2>
          <p className="mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              <strong>Access:</strong> The right to request copies of your personal data.
            </li>
            <li className="mb-2">
              <strong>Rectification:</strong> The right to request correction of inaccurate or incomplete information.
            </li>
            <li className="mb-2">
              <strong>Erasure:</strong> The right to request deletion of your personal data.
            </li>
            <li className="mb-2">
              <strong>Restriction:</strong> The right to request restriction of processing.
            </li>
            <li className="mb-2">
              <strong>Data Portability:</strong> The right to receive your personal data in a structured, machine-readable format.
            </li>
            <li className="mb-2">
              <strong>Objection:</strong> The right to object to processing of your personal data.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">8. California Privacy Rights (CCPA/CPRA)</h2>
          <p className="mb-3">
            California residents have specific rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), including:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2">
              The right to know what personal information is collected, used, shared, or sold.
            </li>
            <li className="mb-2">
              The right to delete personal information held by businesses.
            </li>
            <li className="mb-2">
              The right to opt-out of the sale or sharing of personal information.
            </li>
            <li className="mb-2">
              The right to non-discrimination for exercising privacy rights.
            </li>
          </ul>
          <p className="mb-3">
            To exercise your rights under the CCPA/CPRA, please contact us using the information provided in the "Contact Information" section.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
          <p className="mb-3">
            Your information may be transferred to countries outside your country of residence,
            including the United States. We ensure appropriate safeguards are in place to protect your information,
            such as Standard Contractual Clauses for EU data transfers.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">10. Data Retention</h2>
          <p className="mb-3">
            We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
            unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">11. Children's Privacy</h2>
          <p className="mb-3">
            Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">12. Changes to This Privacy Policy</h2>
          <p className="mb-3">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">13. Contact Information</h2>
          <p className="mb-3">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-3">Email: privacy@globalnomadsafety.com</p>
        </section>

        <div className="mt-8 text-center">
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