import { Box, Divider } from "@mui/material";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Box className="text-left max-w-3xl w-full mx-4 p-8 space-y-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p>
            <strong>Effective Date:</strong> September 20, 2025
        </p>
        <p>
            Marakusa ("we," "our," or "us") operates the CapYap application ("CapYap," "the app").
            We are committed to protecting your privacy and ensuring the security of your information.
            This Privacy Policy explains how we collect, use, store, and safeguard your data when you use CapYap.
        </p>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>
                <strong>Discord Authentication Data:</strong> To use CapYap, you must sign in using Discord OAuth. We may collect limited profile information provided by Discord (such as your Discord ID, username, avatar, and email address) solely for account identification and authentication.
            </li>
            <li>
                <strong>Screenshots:</strong> When you take and upload screenshots using CapYap, the files are encrypted with a unique key and stored on our servers.
            </li>
            <li>
                <strong>Account Data:</strong> Information necessary to manage your account within CapYap.
            </li>
            </ul>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 pb-2">
            <li>To authenticate and provide access to CapYap through Discord OAuth.</li>
            <li>To securely store, encrypt, and allow sharing of screenshots.</li>
            <li>To enable you to delete screenshots at any time.</li>
            <li>To allow you to manage and delete your account and associated data.</li>
            </ul>
            <p>We <strong>do not</strong> use your information for advertising, profiling, or any other purpose outside of CapYap and its related services.</p>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">3. Data Storage and Security</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>All uploaded screenshots are encrypted with a unique key.</li>
            <li>When you delete a screenshot, it is permanently removed from our servers.</li>
            <li>When you delete your account, all of your data, including screenshots and authentication information, is permanently removed from our servers.</li>
            <li>We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse.</li>
            </ul>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">4. Data Deletion and User Control</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>You may delete individual screenshots at any time.</li>
            <li>You may request deletion of your account at any time, which will result in the removal of all data and screenshots associated with your account.</li>
            <li>Once deleted, your data cannot be recovered.</li>
            </ul>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">5. Sharing of Information</h2>
            <p>We do not sell, rent, or share your data with third parties, except as required by law or necessary to operate CapYap and its related services (such as secure cloud storage or server providers).</p>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">6. Third-Party Services</h2>
            <p>
            <strong>Discord OAuth</strong> is used to authenticate your account. By signing in with Discord, you are also subject to{" "}
            <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Discord's Privacy Policy
            </a>.
            </p>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">7. Children's Privacy</h2>
            <p>CapYap is not intended for use by individuals under the age of 13 (or the minimum legal age in your jurisdiction). We do not knowingly collect personal information from children.</p>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">8. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app and updated with a new effective date.</p>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold py-4">9. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or your data, you can contact us at:</p>
            <p><strong>Marakusa</strong><br />Email: <a href="mailto:contact.marakusa@gmail.com" className="text-blue-600 underline">contact.marakusa@gmail.com</a></p>
        </section>
    </Box>
  );
};

export default PrivacyPolicy;
