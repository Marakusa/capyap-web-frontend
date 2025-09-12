import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import type { Models } from "appwrite";
import { GiEmptyWoodBucket } from "react-icons/gi";
import config from './local.config.json';
import { createJWT } from "./auth";
import LoadingDots from "./LoadingDots";
import Button from "@mui/material/Button";
import CapYapToastContainer from "./Toasts";
import { socket } from "./socket.ts";
import type { Gallery } from "./gallery.ts";
import CapView from "./CapView.tsx";

function GalleryPage({ user }: { user: Models.User | undefined | null }) {
    const [capView, setCapView] = useState<string | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [galleryPictures, setGalleryPictures] = useState<string[]>([]);
    const [maxPages, setMaxPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);

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
    
    if (gallery == null && !fetching && !fetched) {
        setFetched(true);
        readGallery(1);
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

        let pagesShown = 6; // Number of page buttons to show around the current page

        for (let i = 1; i <= totalPages; i++) {
            // If there are fewer pages, show all page buttons
            if (totalPages <= pagesShown) {
                output.push(<PageButton page={i} />);
                continue;
            }

            // If the current page is 1, show the first 8 pages and the last page
            if (currentPage <= 4) {
                if (i <= pagesShown) {
                    output.push(<PageButton page={i} />);
                }
                if (i == pagesShown + 1) {
                    output.push(<MiddleDots />);
                }
                if (i == totalPages) {
                    output.push(<PageButton page={totalPages} />);
                }
                continue;
            }

            // If the current page is in the middle, show the first page, 3 pages before and after the current page, and the last page
            if (currentPage > 4 && currentPage < totalPages - 3) {
                if (i == 1) {
                    output.push(<PageButton page={1} />);
                    output.push(<MiddleDots />);
                    continue;
                }
                if (i > currentPage - 3 && i < currentPage + 3) {
                    output.push(<PageButton page={i} />);
                    continue;
                }
                if (i == totalPages) {
                    output.push(<MiddleDots />);
                    output.push(<PageButton page={totalPages} />);
                    continue;
                }
            }

            // If the current page is near the end, show the first page and the previous pages
            if (currentPage >= totalPages - 3) {
                if (i == 1) {
                    output.push(<PageButton page={1} />);
                    output.push(<MiddleDots />);
                    continue;
                }
                if (i >= totalPages - pagesShown + 1) {
                    output.push(<PageButton page={i} />);
                    continue;
                }
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
                                        onClick={async () => {
                                            setCapView(source);
                                        }}></div>)}
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
                <CapView capView={capView} setCapView={setCapView} gallery={gallery} setGallery={setGallery} setGalleryPictures={setGalleryPictures} user={user} />
            )}
            <CapYapToastContainer />
        </>
    );
}

export default GalleryPage;