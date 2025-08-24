import Card from "@mui/material/Card";
import type { Models } from "appwrite";
import CapYapToastContainer from "./Toasts";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { Cancel, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import config from './local.config.json';
import { createJWT, fetchUploadKey } from "./auth";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import copy from "copy-to-clipboard";

function Settings({ user }: { user: Models.User | undefined | null }) {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploadKey, setUploadKey] = useState<string | null>(null);

    const handleClickOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    const handleDeleteAccount = async () => {
        try {
            if (deleting) {
                return;
            }

            setDeleting(true);
            
            await toast.promise(async () => {
                const deleteUrl = `${config.backend.url}/user/delete`;
                const formData = new FormData();
                const sessionJwt = await createJWT();
                if (sessionJwt) {
                    formData.append("sessionKey", sessionJwt);
                }
                const response = await fetch(deleteUrl, {
                    method: "POST",
                    body: formData
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`${errorMessage}`);
                }
                localStorage.removeItem("aw_jwt");
                localStorage.removeItem("cookieFallback");
                localStorage.removeItem("uploadKey");
                window.location.href = "/";
            }, {
                pending: "Deleting account",
                success: "Account deleted successfully",
                error: "Account deletion failed"
            });
        } catch(ex) {
            console.error(`Account deletion failed: ${ex}`);
            setDeleting(false);
            setOpenDeleteConfirm(false);
        }
    };

    useEffect(() => {
        fetchUploadKey().then((key) => {
            setUploadKey(key);
        });
    }, [uploadKey]);

    return (
        <>
            {user ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Card className="w-9/10 max-w-200 min-h-70 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <div className="settingsItem disabled">
                            <p>Username:</p>
                            <OutlinedInput id="outlined-basic" disabled value={user.name} />
                        </div>
                        <div className="settingsItem disabled">
                            <p>Email address:</p>
                            <OutlinedInput id="outlined-basic" disabled value={user.email} />
                        </div>
                        <i className="opacity-40">These values come from your Discord account.</i>
                        <div className="settingsItem disabled">
                            <p>Upload address:</p>
                            <OutlinedInput id="outlined-basic" disabled value={uploadKey ? `${config.backend.url}/f/u?k=${uploadKey}` : "Please wait..."} 
                                onClick={() => {copy(`${config.backend.url}/f/u?k=${uploadKey}`)}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="Copy URL"
                                    onClick={() => {}}
                                    edge="end"
                                    style={{marginRight: "-10px"}}
                                    >
                                        <FaCopy />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        </div>
                        <div className="dangerZone">
                            <h1>Danger Zone</h1>
                            <p>The actions listed below are permanent and cannot be reversed. If you delete your account, <strong>ALL</strong> your files and data will be <strong>REMOVED</strong>.</p>
                            <Button variant="contained" color="primary" className="mb-4" startIcon={<Delete />} onClick={handleClickOpenDeleteConfirm}>
                                Delete account
                            </Button>
                        </div>
                    </Card>
                </div>
            ) : (
                <></>
            )}
            <CapYapToastContainer />
            <Dialog
                open={openDeleteConfirm}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete your account?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action is permanent and irreversable. If you delete your account, <strong>ALL</strong> your files and data will be <strong>REMOVED</strong>. You can make a new account by signing in again.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" color="primary" onClick={handleCloseDeleteConfirm} autoFocus startIcon={<Cancel />}>Go Back</Button>
                <Button variant="outlined" color="secondary" onClick={handleDeleteAccount} startIcon={<Delete />}>
                    DELETE ALL MY DATA
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Settings;