import { useState, type SetStateAction } from "react";
import type { Models } from "appwrite";
import { FileUploader } from "react-drag-drop-files";
import LoadingDots from "./LoadingDots";

const fileTypes = ["JPG", "PNG", "GIF"];

function UploadPage({ user }: { user: Models.User | undefined | null }) {
    const [file, setFile] = useState<File | Array<File> | null>(null);
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const handleChange = async (file: SetStateAction<File | File[] | null>) => {
        try {
            setFile(file);
            await uploadFile();
        }
        catch (error) {
            console.error("Error handling file change:", error);
            setFileUploading(false);
        }
    };

    const uploadFile = async () => {
        setFileUploading(true);
        if (!file) {
            setFileUploading(false);
            return;
        }
        console.log("File to upload:", file);
        setFileUploading(false);
    }
    
    return (
        <>
            {user ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    {!fileUploading ? (
                        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                    ) : (
                        <LoadingDots size="sm" className="text-gray-500" />
                    )}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default UploadPage;