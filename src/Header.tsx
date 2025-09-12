import { loginWithDiscord } from "./auth";
import type { Models } from "appwrite";
import LoadingDots from "./LoadingDots";
import Button from '@mui/material/Button';
import { Download, Image, Login } from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

function Header({user, loadingUser, logout}: {user: Models.User | undefined | null, loadingUser: boolean, logout: () => void}) {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    function downloadInstaller() {
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

    return (
        <header className="App-header flex flex-row justify-center items-center gap-6">
            <h1 className="select-none cursor-pointer" onClick={() => navigate("/")}>CapYap</h1>
            <div className="w-9/10 max-w-128 h-24 flex flex-row justify-end items-center gap-6">
                {loadingUser ?
                (
                    <LoadingDots size="sm" className="text-gray-500" />
                ) : (user ? (
                <>
                    {downloadLoading ? (
                        <Button variant="contained" color="primary" className="mb-4" startIcon={<LoadingDots size="xs" />}>
                            Please wait...
                        </Button>
                    ) : (
                        <Button variant="outlined" color="secondary" onClick={downloadInstaller} className="mb-4" startIcon={<Download />}>
                            Download
                        </Button>
                    )}
                    {downloadError && (<p className="text-red-400">Error, try again</p>)}
                    <Button variant="contained" color="primary" onClick={() => navigate("/gallery")} startIcon={<Image />}>
                    Gallery
                    </Button>
                    <div>
                        <Avatar 
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            className="cursor-pointer"
                            onClick={handleClick}
                            src={user?.prefs["photoURL"] || undefined}
                        />
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                        >
                            <div className="px-2 py-1">
                                <p>{user.name}</p>
                                <p className="opacity-50">{user.email}</p>
                            </div>
                            <hr className="my-2 w-full border-t-0 border-b-1 border-gray-800"></hr>
                            <MenuItem onClick={() => {navigate("/upload");handleClose();}}>Upload</MenuItem>
                            <MenuItem onClick={() => {navigate("/gallery");handleClose();}}>Gallery</MenuItem>
                            <MenuItem onClick={() => {navigate("/settings");handleClose();}}>Settings</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </>
                ) : (
                <Button variant="contained" color="primary" onClick={loginWithDiscord} startIcon={<Login />}>
                    Sign In
                </Button>
                ))}
            </div>
        </header>
    );
}

export default Header;