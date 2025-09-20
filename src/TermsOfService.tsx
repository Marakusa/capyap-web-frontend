import { Box, Divider } from "@mui/material";
import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <Box className="text-left max-w-3xl w-full mx-4 p-8 space-y-8">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p>
        <strong>Effective Date:</strong> September 20, 2025
      </p>
      <p>
        Welcome to CapYap! These Terms of Service ("Terms") govern your use of the
        CapYap application ("CapYap," "the app") provided by Marakusa ("we," "our,"
        or "us"). By accessing or using CapYap, you agree to these Terms. If you do
        not agree, you may not use the app.
      </p>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">1. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction) to use CapYap. By using the app, you represent and warrant
          that you meet this requirement.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">2. Account Registration</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>CapYap requires you to sign in using Discord OAuth.</li>
          <li>You are responsible for maintaining the security of your Discord account.</li>
          <li>
            We are not liable for any unauthorized access caused by failure to secure
            your credentials.
          </li>
        </ul>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">3. Use of the Service</h2>
        <p>
          You agree to use CapYap in compliance with all applicable laws and
          regulations. You must not:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Upload, share, or distribute unlawful, harmful, or infringing content.</li>
          <li>Attempt to disrupt or compromise the security or integrity of CapYap.</li>
          <li>
            Reverse engineer, decompile, or misuse the app in any unauthorized way.
          </li>
        </ul>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">4. Screenshots and Data</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Screenshots uploaded to CapYap are encrypted and stored securely.</li>
          <li>
            You may delete your screenshots at any time, and they will be permanently
            removed from our servers.
          </li>
          <li>
            If you delete your account, all of your data, including screenshots, will
            be permanently removed.
          </li>
        </ul>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to CapYap if you
          violate these Terms or misuse the service. You may also delete your account
          at any time.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">6. Disclaimer of Warranties</h2>
        <p>
          CapYap is provided "as is" and "as available" without warranties of any kind,
          whether express or implied. We do not guarantee that the app will always be
          secure, error-free, or available without interruptions.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Marakusa shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of
          CapYap, including but not limited to data loss or service interruptions.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">8. Changes to These Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Any changes will be
          posted within the app and updated with a new effective date. Continued use
          of CapYap after changes constitutes acceptance of the updated Terms.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-2xl font-semibold py-4">9. Contact Us</h2>
        <p>If you have any questions about these Terms, you can contact us at:</p>
        <p>
          <strong>Marakusa</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:contact.marakusa@gmail.com"
            className="text-blue-600 underline"
          >
            contact.marakusa@gmail.com
          </a>
        </p>
      </section>
    </Box>
  );
};

export default TermsOfService;
