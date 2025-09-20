import { Box, Button, Divider } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const DocsPage: React.FC = () => {
  return (
    <Box className="text-left max-w-3xl w-full mx-4 p-8 space-y-8">
        <img
            src="/banner.jpg"
            alt="CapYap Banner"
            className="w-full h-auto rounded-xl shadow-md mb-6"
        />
    
        <h1 className="text-4xl font-bold">CapYap Docs</h1>
        <p className="text-lg">
            Welcome to the official documentation for <strong>CapYap</strong>, a secure
            screenshot capture and sharing app built by <strong>Marakusa</strong>.
        </p>

        <Divider />

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold pt-4">What is CapYap?</h2>
            <p>
                CapYap lets you capture screenshots, upload them securely, and share them
                easily. Screenshots are encrypted with a unique key and stored safely on
                our servers. You remain in full control of your data. You can delete
                individual screenshots or your entire account at any time.
            </p>
        </section>

        <Divider />

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold pt-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Secure Authentication:</strong> Sign in with Discord OAuth.
                </li>
                <li>
                    <strong>Encrypted Storage:</strong> All uploads are protected with a unique
                    encryption key.
                </li>
                <li>
                    <strong>Data Control:</strong> Delete screenshots or your account permanently
                    whenever you choose to.
                </li>
                <li>
                    <strong>No Ads or Tracking:</strong> Your data is never used outside of CapYap
                    and its related services.
                </li>
            </ul>
        </section>

        <Divider />

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold pt-4">Legal & Policies</h2>
            <p>
            Please review the following documents to understand how your data is handled
            and the terms of using CapYap:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    component={Link}
                    to="/docs/privacy"
                    variant="contained"
                    color="primary"
                >
                    Privacy Policy
                </Button>
                <Button
                    component={Link}
                    to="/docs/terms"
                    variant="outlined"
                    color="primary"
                >
                    Terms of Service
                </Button>
            </div>
        </section>

        <Divider />

        <section>
            <h2 className="text-2xl font-semibold pt-4">Contact</h2>
            <p>
                Have questions? Reach out to us at{" "}
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

export default DocsPage;
