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

interface Gallery {
    total: number,
    limit: number,
    page: number,
    totalPages: number,
    documents: string[]
}

function GalleryPage({ user }: { user: Models.User | undefined | null }) {
    const [capView, setCapView] = useState<string | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [galleryPictures, setGalleryPictures] = useState<string[]>([]);
    const [maxPages, setMaxPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);
    const [deleteSure, setDeleteSure] = useState<boolean>(false);

    const readGallery = async (page: number) => {
        if (fetching) {
            return;
        }

        setFetching(true);
        const formData = new FormData();
        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        const galleryReadUrl = config.backend.url + "/f/fetchGallery?limit=24&page=" + page;
        const response = await fetch(galleryReadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(errorMessage);
            setError(errorMessage);
            setFetching(false);
            return;
        }
        const data = await response.json() as Gallery;

        if (data?.documents && data.documents.length > 0) {
            setGallery(data);
            setGalleryPictures(data.documents);
            setMaxPages(data?.totalPages ?? 1);
        }

        setFetching(false);
        setCurrentPage(page);
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

    if (gallery == null && !fetching && !fetched) {
        setFetched(true);
        readGallery(1);
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

    useEffect(() => {
        async function onAddImageEvent() {
            if (currentPage == 1) {
                await readGallery(1);
            }
        }

        socket.on('addImage', onAddImageEvent);

        return () => {
            socket.off('addImage', onAddImageEvent);
        };
    }, [readGallery]);

    function setPage(page: number) {
        setGallery(null);
        setGalleryPictures([]);
        readGallery(page);
    }

    function PageButtons() {
        let output = [];
        let totalPages: number = maxPages;

        for (let i = 1; i <= totalPages; i++) {
            if (i <= currentPage - 2) {
                if (i == 2 && i <= totalPages - 8) {
                    output.push(<PageButton page={1} />);
                    output.push(<MiddleDots />);
                }
                else if (i > totalPages - 8) {
                    output.push(<PageButton page={i} />);
                }
            }
            if (i > currentPage - 2 && i < currentPage + 7) {
                output.push(<PageButton page={i} />);
            }
            if (i == currentPage + 7) {
                if (i !== totalPages) {
                    output.push(<MiddleDots />);
                }
                output.push(<PageButton page={totalPages} />);
                break;
            }
        }

        return (output);
    }

    const PrevButton = () => { return (<Button variant="outlined" color="primary" onClick={() => { setPage(currentPage - 1); }}>&lt;</Button>); }
    const NextButton = () => { return (<Button variant="outlined" color="primary" onClick={() => { setPage(currentPage + 1); }}>&gt;</Button>); }
    const MiddleDots = () => { return (<p className="mt-4 mx-2">...</p>); }
    const PageButton = ({page}: {page: number}) => { return (<Button variant={currentPage === page ? "contained" : "outlined"} color="primary" onClick={() => { setPage(page); }}>{page}</Button>); }
    const PageControls = () => {
        return (
            <div className="flex flex-row gap-2 justify-center align-middle text-center">
                {currentPage > 1 && (<PrevButton />)}
                <PageButtons />
                {currentPage < maxPages && (<NextButton />)}
            </div>
        );
    }
    
    return (
        <>
            {user ? (
                <div className="flex justify-center items-center min-h-[80vh]">
                    <Card className="w-9/10 max-w-600 min-h-70 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold">Your Caps</h1>
                        
                        {fetching && gallery == null ? (<>
                            <LoadingDots size="sm" className="text-gray-500" />
                        </>) : (<>
                            <PageControls />

                            {!gallery?.documents || gallery.documents.length <= 0 ? (
                                <div className="flex flex-col justify-center items-center">
                                    <GiEmptyWoodBucket className="opacity-50 m-2" style={{width: 96, height: 96}} />
                                    <p className="opacity-50">Start taking or uploading screenshots and they will appear here!</p>
                                    {error && (<p className="text-red-400">{error}</p>)}
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-4">
                                    {galleryPictures.map((source) => <div 
                                        style={{backgroundImage: `url(${source + "&noView=1"})`}} 
                                        className="bg-cover bg-center rounded-lg cursor-pointer hover:scale-102 transition-transform w-48 h-48"
                                        onClick={() => {setCapView(source); setDeleteSure(false);}}></div>)}
                                </div>
                            )}
                        
                            {!gallery?.documents || gallery.documents.length > 12 && (<PageControls />)}
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
                </>
            )}
            <CapYapToastContainer />
        </>
    );
}

export default GalleryPage;