import { loginWithDiscord } from "./auth";
import type { Models } from "appwrite";
import LoadingDots from "./LoadingDots";
import Button from '@mui/material/Button';
import { Image, Login } from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

function Header({user, loadingUser, logout}: {user: Models.User | undefined | null, loadingUser: boolean, logout: () => void}) {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <header className="App-header flex flex-row justify-center items-center gap-6">
            <h1 className="select-none cursor-pointer" onClick={() => navigate("/")}>CapYap</h1>
            <div className="w-9/10 max-w-128 h-24 flex flex-row justify-end items-center gap-6">
                {loadingUser ?
                (
                    <LoadingDots size="sm" className="text-gray-500" />
                ) : (user ? (
                <>
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