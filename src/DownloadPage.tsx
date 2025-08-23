import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";

function DownloadPage({ user }: { user: Models.User | undefined | null }) {
    return (
        <>
            {user ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Card className="w-9/10 max-w-120 min-h-50 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold">Download CapYap</h1>
                        <Button variant="contained" color="primary" href="/download" className="mb-4" startIcon={<Download />}>
                            Download Now
                        </Button>
                        <p className="text-gray-600">
                            Thank you for using CapYap! Click the button above to download the latest version of the app.
                        </p>
                    </Card>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default DownloadPage;