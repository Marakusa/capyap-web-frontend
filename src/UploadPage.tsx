import { useState, type SetStateAction } from "react";
import type { Models } from "appwrite";
import { FileUploader } from "react-drag-drop-files";
import LoadingDots from "./LoadingDots";
import config from './local.config.json';
import { createJWT, fetchUploadKey } from "./auth";
import copy from 'copy-to-clipboard';
import { Button } from "@mui/material";
import { BrowseGallery, Image, Share } from "@mui/icons-material";
import CapYapToastContainer, { linkCopiedToast } from "./Toasts";
import { useNavigate } from "react-router";

const fileTypes = ["JPG", "PNG", "GIF"];

function UploadPage({ user }: { user: Models.User | undefined | null }) {
    let navigate = useNavigate();
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const handleChange = async (file: SetStateAction<File | File[] | null>) => {
        try {
            for (const f of Array.isArray(file) ? file : [file]) {
                if (!(f instanceof File)) {
                    throw new Error("Invalid file type");
                }
                await uploadFile(f);
            }
        }
        catch (error) {
            console.error("Error handling file change:", error);
            setUploadError(`Error handling file change: ${error}`);
            setFileUploading(false);
        }
    };

    const uploadFile = async (file: File) => {
        setUploadedFileUrl(null);
        setFileUploading(true);
        if (!file) {
            console.error("No file selected for upload.");
            setFileUploading(false);
            setUploadError(`No file selected for upload.`);
            return;
        }
        console.log("File to upload:", file);
        const uploadUrl = `${config.backend.url}/f/upload`;
        const formData = new FormData();
        formData.append("file", file instanceof File ? file : file[0]);

        const sessionJwt = await createJWT();
        if (sessionJwt) {
            formData.append("sessionKey", sessionJwt);
        }

        var uploadKey = localStorage.getItem("uploadKey");
        if (!uploadKey) {
            uploadKey = await fetchUploadKey();
        }
        
        formData.append("uploadKey", uploadKey ?? "");
        try {
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`${errorMessage}`);
            }
            const data = await response.json();
            console.log("Upload successful:", data);
            setUploadedFileUrl(data.url);
            setUploadError(null);
        } catch (error) {
            console.error(error);
            setUploadError(`${error instanceof Error ? error.message : "Unknown error"}`);
        }
        setFileUploading(false);
    }
    
    return (
        <>
            {user ? (
                <div className="flex flex-col justify-center items-center min-h-[70vh]">
                    {!fileUploading ? (
                        <>
                            <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                            {uploadError && (
                                <p className="text-red-500 mt-2">{uploadError}</p>
                            )}
                        </>
                    ) : (
                        <LoadingDots size="sm" className="text-gray-500" />
                    )}
                    {uploadedFileUrl && (
                        <>
                            <p className="p-4">Screenshot uploaded successfully!</p>
                            <img src={uploadedFileUrl} className="rounded-2xl mb-8" style={{maxHeight: "calc(100dvh / 2)"}} />
                            <div className="flex flex-row gap-4">
                                <Button variant="contained" color="primary" onClick={() => {copy(uploadedFileUrl);linkCopiedToast();}} startIcon={<Share />}>
                                    Share
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => navigate("/gallery")} startIcon={<Image />}>
                                    View in Gallery
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <></>
            )}
            <CapYapToastContainer />
        </>
    );
}

export default UploadPage;