import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { createJWT } from "./auth";
import config from './local.config.json';
import LoadingDots from "./LoadingDots";

interface Stats {
    spaceUsed: string,
    views: number,
    files7Days: number,
    totalFiles: number
}

function MainPage({ user, isDesktop }: { user: Models.User | undefined | null, isDesktop: boolean }) {
    const [totalViews, setTotalViews] = useState<number>(0);
    const [files7Days, setFiles7Days] = useState<number>(0);
    const [totalSpaceUsed, setTotalSpaceUsed] = useState<string>("0 KB");
    const [totalFiles, setTotalFiles] = useState<number>(0);
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchStats() {
        if (fetching) {
            return;
        }

        setFetching(true);
        const formData = new FormData();
        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        const galleryReadUrl = config.backend.url + "/f/all/stats";
        const response = await fetch(galleryReadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(errorMessage);
            setError(errorMessage);
            setFetching(false);
            setTotalViews(0);
            setFiles7Days(0);
            setTotalSpaceUsed("0 KB");
            setTotalFiles(0);
            return;
        }
        const data = await response.json() as Stats;

        setFetching(false);

        if (data) {
            setTotalViews(data.views);
            setFiles7Days(data.files7Days);
            setTotalSpaceUsed(data.spaceUsed);
            setTotalFiles(data.totalFiles);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <>
            {user ? (
                <>
                    {!isDesktop ? (
                        <div className="flex justify-center items-center min-h-[60vh]">
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
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 justify-center">
                        <Card className="flex-1 text-left">
                            <div className="grid grid-rows-2 text-left p-4 h-full justify-between text-nowrap overflow-hidden">
                                <h3>Disk used</h3>
                                {fetching ? (
                                    <LoadingDots size="sm" className="text-gray-500" />
                                ) : (
                                    <h1 className="content-end">{totalSpaceUsed}</h1>
                                )}
                            </div>
                        </Card>
                        <Card className="flex-1 text-left">
                            <div className="grid grid-rows-2 text-left p-4 h-full justify-between text-nowrap overflow-hidden">
                                <h3>Total views</h3>
                                {fetching ? (
                                    <LoadingDots size="sm" className="text-gray-500" />
                                ) : (
                                    <h1 className="content-end">{totalViews}</h1>
                                )}
                            </div>
                        </Card>
                        <Card className="flex-1 text-left">
                            <div className="grid grid-rows-2 text-left p-4 h-full justify-between text-nowrap overflow-hidden">
                                <h3>Files (All time)</h3>
                                {fetching ? (
                                    <LoadingDots size="sm" className="text-gray-500" />
                                ) : (
                                    <h1 className="content-end">{totalFiles}</h1>
                                )}
                            </div>
                        </Card>
                        <Card className="flex-1 text-left">
                            <div className="grid grid-rows-2 text-left p-4 h-full justify-between text-nowrap overflow-hidden">
                                <h3>Files (7 days)</h3>
                                {fetching ? (
                                    <LoadingDots size="sm" className="text-gray-500" />
                                ) : (
                                    <h1 className="content-end">{files7Days}</h1>
                                )}
                            </div>
                        </Card>
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default MainPage;