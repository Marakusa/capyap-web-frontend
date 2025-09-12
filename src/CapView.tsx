import config from './local.config.json';
import { Close, Delete, Download, Person, Share, Warning } from "@mui/icons-material";
import { Button, Card } from "@mui/material";
import LoadingDots from "./LoadingDots";
import { toast } from "react-toastify";
import { createJWT } from "./auth";
import { useEffect, useState } from "react";
import type { Gallery } from "./gallery";
import copy from "copy-to-clipboard";
import { linkCopiedToast } from "./Toasts";
import type { Models } from "appwrite";

interface ImageStats {
    views: number,
    size: string,
    uploadedAt: string
}

function CapView({ capView, setCapView, gallery, setGallery, setGalleryPictures, user }: { 
        capView: string | null, 
        setCapView: React.Dispatch<React.SetStateAction<string | null>>, 
        gallery: Gallery | null, 
        setGallery: React.Dispatch<React.SetStateAction<Gallery | null>>,
        setGalleryPictures: React.Dispatch<React.SetStateAction<string[]>>,
        user: Models.User | undefined | null }) {
    const [error, setError] = useState<string | null>(null);
    const [fetchingImageStats, setFetchingImageStats] = useState<boolean>(false);
    const [imageStats, setImageStats] = useState<ImageStats | null>(null);
    const [deleteSure, setDeleteSure] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    
    const deleteCap = async (file: string) => {
        if (!gallery) {
            return;
        }

        setCapView(null);

        await toast.promise(async () => {
            const formData = new FormData();
            const sessionJwt = await createJWT();
            if (sessionJwt) {
                formData.append("sessionKey", sessionJwt);
            }

            const parsedUrl = new URL(file);
            // Remove leading "/f/" from pathname
            const parsedFilename = parsedUrl.pathname.split('/').pop() || "";
            formData.append("file", parsedFilename);

            const galleryReadUrl = config.backend.url + "/f/delete";
            const response = await fetch(galleryReadUrl, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(errorMessage);
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        
            const newGallery = gallery.documents.filter((item) => item !== file);
            gallery.documents = newGallery;
            setGallery(gallery);
            setGalleryPictures(newGallery);
            setError(null);
        }, {
            pending: "Deleting cap",
            success: "Cap successfully deleted",
            error: "Deleting a cap failed"
        });
    };

    function closeView() {
        setCapView(null);
    }

    function download(url: string) {
        const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';

        // Extract the 'c' query parameter (the encryption key)
        const urlObj = new URL(url);
        const key = urlObj.searchParams.get('c'); // get the key from ?c=

        // Remove query parameters from the URL
        urlObj.search = '';

        fetch(urlObj.toString(), {
            method: 'GET',
            headers: {
                'X-File-Key': key || '' // send the key in the custom header
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.arrayBuffer();
            })
            .then(buffer => {
                const blob = new Blob([buffer]);
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(err => {
                console.error('Download error:', err);
                alert('Failed to download the image. Check the console for details.');
            });
    }

    async function fetchStats(file: string) {
        setFetchingImageStats(true);
        setImageStats(null);
        const formData = new FormData();
        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        formData.append("file", file);
        
        const statsReadUrl = config.backend.url + "/f/stats";
        const response = await fetch(statsReadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(errorMessage);
            toast.error("Failed to fetch image stats: " + errorMessage);
            setFetchingImageStats(false);
            setImageStats(null);
            return;
        }
        const data = await response.json() as ImageStats;

        setFetchingImageStats(false);

        if (!data) {
            setImageStats(null);
            return;
        }

        setImageStats(data);
    }

    async function setAsAvatar(file: string) {
        if (!user) {
            return;
        }

        await toast.promise(async () => {
            const formData = new FormData();

            const sessionJwt = await createJWT();

            if (sessionJwt) {
                formData.append("sessionKey", sessionJwt);
            }

            let parsedFilename = file || "";
            if (file && !file.endsWith("&noView=1")) {
                parsedFilename = parsedFilename + "&noView=1";
            }
            formData.append("file", parsedFilename);

            const avatarSetUrl = config.backend.url + "/user/setAvatar";
            const response = await fetch(avatarSetUrl, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        }, {
            pending: "Setting avatar",
            success: "Avatar successfully set",
            error: "Setting avatar failed"
        });
    }

    useEffect(() => {
        if (!isLoading) {
            setLoading(true);
            if (capView) {
                setDeleteSure(false);
                fetchStats(new URL(capView).pathname.split("/f/").pop() || "");
            }
        }
    }, [capView]);

    return (
        <>
            {capView && (
                <>
                    {error && (<p className="text-red-400">{error}</p>)}
                    <div id="view-bg" className="backdrop-blur-3xl fixed top-0 left-0 w-full h-full flex flex-col gap-4 p-8 justify-center items-center overflow-y-scroll md:overflow-y-hidden">
                        <div className="flex flex-col lg:flex-row gap-8 h-full w-full items-center justify-center">
                            <div className="flex-0 absolute w-full h-full z-9" onClick={() => closeView()}></div>
                            <div className="flex flex-col gap-4 justify-center items-center h-1/2 lg:h-full z-10">
                                <img src={capView + "&noView=1"} className="max-h-[90%] max-w-[90%] object-contain" />
                                <div className="flex flex-row gap-4">
                                    <Button variant="contained" color="primary" onClick={() => {download(capView);}} startIcon={<Download />}>
                                        Download
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={() => {copy(capView);linkCopiedToast();}} startIcon={<Share />}>
                                        Share
                                    </Button>
                                    {!deleteSure ? (
                                        <Button variant="outlined" color="secondary" onClick={() => setDeleteSure(true)} startIcon={<Delete />}>
                                            Delete
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="secondary" onClick={() => deleteCap(capView)} startIcon={<Warning />}>
                                            Are you sure?
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <Card className="flex flex-col w-full md:w-120 z-10">
                                <div className="p-3 pb-0 flex flex-row items-center justify-between w-full">
                                    <h2
                                        className="flex-1 truncate text-left text-base font-medium"
                                        title={new URL(capView).pathname.split('/').pop()}
                                    >
                                        {new URL(capView).pathname.split('/').pop()}
                                    </h2>
                                    <div
                                        onClick={() => closeView()}
                                        className="ml-3 shrink-0 hover:bg-white/10 rounded-md p-2 cursor-pointer"
                                    >
                                        <Close />
                                    </div>
                                </div>
                                {fetchingImageStats ? (<LoadingDots size="sm" className="text-gray-500 p-3" />) : imageStats == null ? (<p className="px-3 py-0 w-full text-left opacity-75">No stats available</p>) : (
                                    <>
                                        <p className="px-3 py-0 w-full text-left opacity-75" title={new Date(imageStats?.uploadedAt ?? "0").toLocaleString()}>{new Date(imageStats?.uploadedAt ?? "0").toDateString()}</p>
                                        <div className="flex flex-row justify-between items-stretch">
                                            <div className="grid grid-rows-2 text-left h-24 p-4 text-nowrap overflow-hidden w-full">
                                                <h3>Views</h3>
                                                <h1 className="content-end">{imageStats?.views}</h1>
                                            </div>
                                            <div className="grid grid-rows-2 text-left h-24 p-4 text-nowrap overflow-hidden w-full">
                                                <h3>Size</h3>
                                                <h1 className="content-end">{imageStats?.size.toUpperCase()}</h1>
                                            </div>
                                        </div>
                                        <Button variant="contained" color="primary" onClick={async () => await setAsAvatar(capView)} startIcon={<Person />}>
                                            Set as Avatar
                                        </Button>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default CapView;