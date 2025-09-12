import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { createJWT } from "./auth";
import config from './local.config.json';
import LoadingDots from "./LoadingDots";
import type { Gallery } from "./gallery";
import { socket } from "./socket.ts";
import { GiEmptyWoodBucket } from "react-icons/gi";
import CapView from "./CapView.tsx";

interface Stats {
    spaceUsed: string,
    views: number,
    files7Days: number,
    totalFiles: number
}

function MainPage({ user, isDesktop }: { user: Models.User | undefined | null, isDesktop: boolean }) {
    const [capView, setCapView] = useState<string | null>(null);
    const [totalViews, setTotalViews] = useState<number>(0);
    const [files7Days, setFiles7Days] = useState<number>(0);
    const [totalSpaceUsed, setTotalSpaceUsed] = useState<string>("0 KB");
    const [totalFiles, setTotalFiles] = useState<number>(0);
    const [fetching, setFetching] = useState<boolean>(false);
    const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [galleryPictures, setGalleryPictures] = useState<string[]>([]);
    const [galleryError, setGalleryError] = useState<string | null>(null);
    const [galleryFetching, setGalleryFetching] = useState<boolean>(false);
    const [galleryFetched, setGalleryFetched] = useState<boolean>(false);
    //const [error, setError] = useState<string | null>(null);

    const readGallery = async () => {
        if (galleryFetching) {
            return;
        }

        setGalleryFetching(true);
        const formData = new FormData();
        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        const galleryReadUrl = config.backend.url + "/f/fetchGallery?limit=3";
        const response = await fetch(galleryReadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(errorMessage);
            setGalleryError(errorMessage);
            setGalleryFetching(false);
            return;
        }
        const data = await response.json() as Gallery;

        if (data?.documents && data.documents.length > 0) {
            setGallery(data);
            setGalleryPictures(data.documents);
        }

        setGalleryFetching(false);
    };
    
    if (user && gallery == null && !galleryFetching && !galleryFetched) {
        setGalleryFetched(true);
        readGallery();
    }

    useEffect(() => {
        async function onAddImageEvent() {
            await readGallery();
        }

        socket.on('addImage', onAddImageEvent);

        return () => {
            socket.off('addImage', onAddImageEvent);
        };
    }, [readGallery]);

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
            //setError(errorMessage);
            setFetching(false);
            setTotalViews(0);
            setFiles7Days(0);
            setTotalSpaceUsed("0 KB");
            setTotalFiles(0);
            return;
        }
        const data = await response.json() as Stats;

        setFetching(false);

        //setError(null);

        if (data) {
            setTotalViews(data.views);
            setFiles7Days(data.files7Days);
            setTotalSpaceUsed(data.spaceUsed);
            setTotalFiles(data.totalFiles);
        }
    }

    function downloadInstaller(){
        setDownloadLoading(true);
        setDownloadError(null);
        try {
            fetch("https://api.github.com/repos/Marakusa/capyap/releases/latest").then((res) => {
                res.json().then((data) => {
                    if (res.status > 299) {
                        console.error(data.message);
                        setDownloadLoading(false);
                        setDownloadError(data.message);
                        return;
                    }

                    let downloadUrl: string | null = null;
                    if (data.assets.length > 0) {
                        downloadUrl = data.assets[0].browser_download_url;
                    }
                    if (downloadUrl === null) {
                        setDownloadLoading(false);
                        return;
                    }
                    setDownloadLoading(false);
                    window.location.href = downloadUrl;
                });
            }).catch((error) => {
                console.error(error);
                setDownloadLoading(false);
                setDownloadError(error);
            });
        } catch (ex) {
            console.error(ex);
            setDownloadLoading(false);
            setDownloadError("Download failed, please try again.");
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <>
            {user ? (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        {!isDesktop ? (
                            <Card className="w-9/10 max-w-100 min-h-50 flex flex-col justify-center items-center">
                                <h1 className="text-2xl font-bold">Download CapYap</h1>
                                {downloadLoading ? (
                                    <Button variant="contained" color="primary" className="mb-4" startIcon={<LoadingDots size="xs" />}>
                                        Please wait...
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={downloadInstaller} className="mb-4" startIcon={<Download />}>
                                        Download Now
                                    </Button>
                                )}
                                {downloadError && (<p className="text-red-400">{downloadError}</p>)}
                                <p className="text-gray-600">
                                    Thank you for using CapYap! Click the button above to download the latest version of the app.
                                </p>
                            </Card>
                        ) : (
                            <Card className="w-9/10 max-w-100 min-h-50 flex flex-col justify-center items-center">
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
                        )}
                        <Card className="w-full min-h-50 flex flex-col justify-center items-center">
                            <h1 className="text-2xl font-bold">Recent files</h1>
                            <div>
                                {fetching && gallery == null ? (<>
                                    <LoadingDots size="sm" className="text-gray-500" />
                                </>) : (<>
                                    {!gallery?.documents || gallery.documents.length <= 0 ? (
                                        <div className="flex flex-col justify-center items-center">
                                            <GiEmptyWoodBucket className="opacity-50 m-2" style={{width: 96, height: 96}} />
                                            <p className="opacity-50">Start taking or uploading screenshots and they will appear here!</p>
                                            {galleryError && (<p className="text-red-400">{galleryError}</p>)}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {galleryPictures.map((source) => <div 
                                                style={{backgroundImage: `url(${source + "&noView=1"})`}} 
                                                className="bg-cover bg-center rounded-lg cursor-pointer hover:scale-102 transition-transform w-48 h-48"
                                                onClick={async () => {
                                                    setCapView(source);
                                                }}></div>)}
                                        </div>
                                    )}
                                </>)}
                            </div>
                        </Card>
                    </div>
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
                </div>
            ) : (
                <>
                    {!isDesktop && (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <Card className="w-9/10 max-w-120 min-h-50 flex flex-col justify-center items-center">
                                <h1 className="text-2xl font-bold">Download CapYap</h1>
                                {downloadLoading ? (
                                    <Button variant="contained" color="primary" className="mb-4" startIcon={<LoadingDots size="xs" />}>
                                        Please wait...
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={downloadInstaller} className="mb-4" startIcon={<Download />}>
                                        Download Now
                                    </Button>
                                )}
                                {downloadError && (<p className="text-red-400">{downloadError}</p>)}
                                <p className="text-gray-600">
                                    Thank you for using CapYap! Click the button above to download the latest version of the app.
                                </p>
                            </Card>
                        </div>
                    )}
                </>
            )}
            {capView && (
                <CapView capView={capView} setCapView={setCapView} gallery={gallery} setGallery={setGallery} setGalleryPictures={setGalleryPictures} user={user} />
            )}
        </>
    );
}

export default MainPage;