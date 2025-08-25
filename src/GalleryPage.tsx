import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";
import { GiEmptyWoodBucket } from "react-icons/gi";
import config from './local.config.json';
import { createJWT } from "./auth";
import LoadingDots from "./LoadingDots";
import Button from "@mui/material/Button";
import copy from "copy-to-clipboard";
import { Delete, Download, Share, Warning } from "@mui/icons-material";
import CapYapToastContainer, { linkCopiedToast } from "./Toasts";
import { toast } from "react-toastify";
import { socket } from "./socket.ts";

function GalleryPage({ user }: { user: Models.User | undefined | null }) {
    const [capView, setCapView] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);
    const [deleteSure, setDeleteSure] = useState<boolean>(false);
    const [lastFetch, setLastFetch] = useState<string | null>(null);

    const readGallery = async () => {
        if (fetching) {
            return;
        }

        setFetching(true);
        const formData = new FormData();
        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        const galleryReadUrl = config.backend.url + "/f/fetchGallery" + (lastFetch ? ("?from=" + lastFetch) : "");
        const response = await fetch(galleryReadUrl, {
            method: "POST",
            body: formData
        });
        setLastFetch(new Date().toISOString());

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(errorMessage);
            setError(errorMessage);
            setFetching(false);
            return;
        }
        const data = await response.json() as string[];

        if (data && data.length > 0) {
            setGallery((prevItems) => [...data, ...prevItems]);
        }

        setFetching(false);
    };
    
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
            const parsedFilename = parsedUrl.pathname.replace(/^\/f\//, '');
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
        
            const newGallery = gallery.filter((item) => item !== file);
            setGallery(newGallery);
            setError(null);
        }, {
            pending: "Deleting cap",
            success: "Cap successfully deleted",
            error: "Deleting a cap failed"
        });
    };

    if (gallery.length <= 0 && !fetching && !fetched) {
        setFetched(true);
        readGallery();
    }

    function closeView(e: React.MouseEvent<HTMLElement>) {
        if ((e.target as HTMLTextAreaElement).id) {
            setCapView(null);
        }
    }

    function download(url: string) {
        const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';
        fetch(url, {
            method: 'GET',
            headers: {},
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.arrayBuffer();
            })
            .then(buffer => {
                const blob = new Blob([buffer]);
                const blobUrl = window.URL.createObjectURL(blob).replace('http://', 'https://');
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

    useEffect(() => {
        async function onAddImageEvent() {
            await readGallery();
        }

        socket.on('addImage', onAddImageEvent);

        return () => {
            socket.off('addImage', onAddImageEvent);
        };
    }, [readGallery]);
    
    return (
        <>
            {user ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Card className="w-9/10 max-w-200 min-h-70 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold">Your Caps</h1>
                        {fetching && gallery.length <= 0 ? (<>
                            <LoadingDots size="sm" className="text-gray-500" />
                        </>) : (<>
                            {!gallery || gallery.length <= 0 ? (
                                <div className="flex flex-col justify-center items-center">
                                    <GiEmptyWoodBucket className="opacity-50 m-2" style={{width: 96, height: 96}} />
                                    <p className="opacity-50">Start taking or uploading screenshots and they will appear here!</p>
                                    {error && (<p className="text-red-400">{error}</p>)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {gallery.map((source) => <img src={source} 
                                                                className="rounded-lg cursor-pointer hover:scale-102 transition-transform" 
                                                                width={"280em"} 
                                                                onClick={() => {setCapView(source); setDeleteSure(false);}} />)}
                                </div>
                            )}
                        </>)}
                    </Card>
                </div>
            ) : (
                <></>
            )}
            {capView && (
                <>
                    {error && (<p className="text-red-400">{error}</p>)}
                    <div id="view-bg" className="backdrop-blur-3xl fixed top-0 left-0 w-full h-full flex flex-col gap-4 p-8 justify-center items-center" onClick={closeView}>
                        <img src={capView} className="max-h-[90%] max-w-[90%] object-contain" />
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
                </>
            )}
            <CapYapToastContainer />
        </>
    );
}

export default GalleryPage;