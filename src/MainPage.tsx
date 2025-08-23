import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";

function MainPage({ user, isDesktop }: { user: Models.User | undefined | null, isDesktop: boolean }) {
    return (
        <>
            {user ? (
                !isDesktop ? (
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
                    <div className="flex justify-center items-center min-h-[70vh]">
                        <Card className="w-9/10 max-w-120 min-h-50 flex flex-col justify-center items-center">
                            <h1 className="text-2xl font-bold">Now press</h1>
                            <div className="shortcut">
                                <div>
                                    Right Ctrl
                                </div>
                                <span>+</span>
                                <div>
                                    Print Screen
                                </div>
                            </div>
                            <p className="text-gray-600">
                                To take a screenshot. It will be uploaded to your gallery, and a link will be copied to your clipboard.
                            </p>
                        </Card>
                    </div>
                )
            ) : (
                <></>
            )}
        </>
    );
}

export default MainPage;