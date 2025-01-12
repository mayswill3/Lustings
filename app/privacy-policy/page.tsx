import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Websites</h2>
                <p className="mb-4">We operate the following websites:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>www.tinsellink.com</li>
                    <li>developers.tinsellink.com</li>
                    <li>TinselLink.com "My Sites"</li>
                    <li>platform.tinsellink.com (Unified Login)</li>
                </ul>
                <p>All parties and websites mentioned above are hereafter referred to as "TL".</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Purpose of this Policy</h2>
                <p className="mb-4">
                    This Privacy Policy aims to give you information on how we collect and process your Personal Data through your use of the TL site(s),
                    including any data you may provide through this website when you sign up to our newsletter, purchase a product or service or take part
                    in a competition. It will also inform you as to how we look after your Personal Data when you visit our website(s), regardless of where
                    you visit it from, and tells you about your privacy rights and how the law protects you.
                </p>
                <p className="mb-4">
                    At TL, we understand that your privacy is very important and treat it accordingly; we are committed to protecting your Personal Data.
                </p>
                <p className="mb-4">
                    This website is not intended for use by anyone under the age of 18 years and we do not knowingly collect data relating to children.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Important Information and Who We Are</h2>
                <h3 className="text-xl font-semibold mb-3">Controller</h3>
                <p className="mb-4">
                    TL is the Data Controller and is responsible for your Personal Data (collectively referred to as "TL", "we", "us" or "our" in this policy).
                </p>
                <p className="mb-4">
                    We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this Privacy Policy.
                    If you have any questions about the policy, including any requests to exercise your legal rights, please contact the DPO via email
                    at privacy@tinsellink.com
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">The Data We Collect About You</h2>
                <p className="mb-4">
                    Personal Data, or personally identifiable information, means any information about an individual from which that person can be identified.
                    It does not include data where the identity has been removed (anonymous data).
                </p>

                <h3 className="text-xl font-semibold mb-3">Data Categories</h3>
                <div className="space-y-4">
                    <div>
                        <p className="font-medium">Identity Data</p>
                        <p>First name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</p>
                    </div>
                    <div>
                        <p className="font-medium">Contact Data</p>
                        <p>Billing address, delivery address, email address and telephone numbers.</p>
                    </div>
                    <div>
                        <p className="font-medium">Financial Data</p>
                        <p>Bank account and payment card details.</p>
                    </div>
                    <div>
                        <p className="font-medium">Technical Data</p>
                        <p>Internet Protocol (IP) address, login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Legal Rights</h2>
                <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your Personal Data:</p>

                <div className="space-y-4">
                    <div>
                        <p className="font-medium">Right to Erasure</p>
                        <p>Every individual has the right to be forgotten upon request.</p>
                    </div>
                    <div>
                        <p className="font-medium">Right to Access</p>
                        <p>Every individual has the right to access their Personal Data held about them upon request.</p>
                    </div>
                    <div>
                        <p className="font-medium">Right to Portability</p>
                        <p>Every individual has the right to request their Personal Data and use it for other parties they wish to engage with.</p>
                    </div>
                </div>
            </section>

            <footer className="mt-12 text-sm text-gray-600">
                <p>Last Updated: Friday 12 January 2025</p>
                <p>Email: info@tinsellink.com</p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;