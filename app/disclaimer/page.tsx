"use client";

import React from 'react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Disclaimer</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <hr className="my-6" />

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Information Accuracy</h2>
          <p className="mb-3">
            The information provided on Global Nomad Safety is for general informational purposes only. While we strive to keep the 
            information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the 
            completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related 
            graphics contained on the website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. Safety Recommendations</h2>
          <p className="mb-3">
            The safety recommendations, alerts, and scores provided by Global Nomad Safety are based on available data and algorithmic 
            analysis. These recommendations should not be considered as professional or expert advice. Users should always exercise 
            their own judgment and caution when traveling and should consult multiple sources of information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. External Links</h2>
          <p className="mb-3">
            Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with 
            Global Nomad Safety. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any 
            information on these external websites.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Professional Advice</h2>
          <p className="mb-3">
            The information on this website is not intended to replace professional advice. For specific travel, safety, or health 
            concerns, please consult with appropriate professionals or government agencies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="mb-3">
            In no event will Global Nomad Safety be liable for any loss or damage including without limitation, indirect or 
            consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, 
            or in connection with, the use of this website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Affiliate Disclosure</h2>
          <p className="mb-3">
            Some of the links on our website may be affiliate links. This means if you click on the link and purchase the item, 
            we may receive an affiliate commission at no extra cost to you. All opinions remain our own, and we only recommend 
            products that we believe will be of value to our users.
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
