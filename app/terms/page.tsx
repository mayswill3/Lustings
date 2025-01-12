import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Terms and Conditions Agreement</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Websites</h2>
                <p className="mb-4">"TL," "we," or "us", is the operator of:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>www.tinsellink.com</li>
                    <li>developers.tinsellink.com</li>
                    <li>TinselLink.com "My Sites"</li>
                    <li>platform.tinsellink.com (Unified Login)</li>
                </ul>
                <p>collectively, "Websites".</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="mb-4">
                    It is important to us that you and other visitors have the best experience while using our Websites,
                    and that, when you use our Websites, you understand your legal rights and obligations. This agreement
                    and our other policies and agreements govern your use of the Websites, including any content,
                    functionality, and services offered on or through them.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Access and Registration</h2>
                <div className="space-y-4">
                    <p>
                        1.1 Access and registration to our Websites are free. By accessing any part of our Websites,
                        you agree to this agreement and our other policies and agreements.
                    </p>
                    <p>
                        1.2 Only individuals who are at least 18-years old and have reached the age of majority where
                        they live may access our Websites.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Account Creation</h2>
                <div className="space-y-4">
                    <p>
                        2.1 To access many of our Websites' features, you must create an account. You must provide
                        accurate information during registration, including a valid email address.
                    </p>
                    <p>
                        2.2 You are responsible for maintaining the confidentiality of your account and password.
                        You must notify us immediately of any unauthorized use of your account.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property Rights</h2>
                <div className="space-y-4">
                    <p>
                        3.1 We own and operate our Websites. All content, features, functionality, and materials
                        found on our Websites are protected by intellectual property laws.
                    </p>
                    <p>
                        3.2 We grant you a limited, non-sublicensable license to access and use our Websites
                        for your personal, non-commercial use only.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Prohibited Uses</h2>
                <div className="space-y-4">
                    <p>You must not use our Websites:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>In any way that violates applicable laws or regulations</li>
                        <li>To transmit harmful code or attempt to gain unauthorized access</li>
                        <li>To impersonate or attempt to impersonate others</li>
                        <li>For any fraudulent purpose or activity</li>
                    </ul>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Content Standards</h2>
                <p className="mb-4">
                    All content must comply with applicable laws and regulations. Content must not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Be defamatory, obscene, or offensive</li>
                    <li>Infringe any patent, trademark, or copyright</li>
                    <li>Violate any person's privacy rights</li>
                    <li>Contain malicious code or harmful content</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
                <p className="mb-4">
                    We may update these terms at any time. We will notify users of any material changes at least
                    15 days before they become effective. Your continued use of our Websites after changes indicates
                    your acceptance of the updated terms.
                </p>
            </section>

            <footer className="mt-12 text-sm text-gray-600">
                <p className="mb-2">Contact us: legal@tinsellink.com</p>
                <p className="mb-2">For complaints: support@tinsellink.com</p>
                <p>Last Updated: Friday 12 January 2025</p>
            </footer>
        </div>
    );
};

export default TermsAndConditions;