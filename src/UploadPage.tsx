import { useState, type SetStateAction } from "react";
import type { Models } from "appwrite";
import { FileUploader } from "react-drag-drop-files";
import LoadingDots from "./LoadingDots";
import config from './local.config.json';
import { createJWT } from "./auth";

const fileTypes = ["JPG", "PNG", "GIF"];

function UploadPage({ user }: { user: Models.User | undefined | null }) {
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
        if (sessionJwt?.jwt) {
            formData.append("sessionKey", sessionJwt.jwt);
        }
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
                            <img src={uploadedFileUrl} className="max-h-100 rounded-2xl" />
                        </>
                    )}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default UploadPage;