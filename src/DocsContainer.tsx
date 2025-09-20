import { Box, Container, Link } from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router";

const DocsContainer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="flex flex-row gap-6">
            <Box
                sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    gap: 1,
                }}
                className="flex flex-col max-w-3xs w-1/5 mx-4 pt-12 border-r border-white/10"
            >
                <p className="text-left font-bold">General</p>
                <div className="flex flex-col gap-1 pl-2 pb-4 text-left">
                    <Link
                        color="text.primary"
                        variant="body2"
                        component="button"
                        onClick={() => navigate("/docs")}
                    >
                        Docs
                    </Link>
                </div>

                <p className="text-left font-bold">Legal</p>
                <div className="flex flex-col gap-1 pl-2 pb-4 text-left">
                    <Link
                        color="text.primary"
                        variant="body2"
                        component="button"
                        onClick={() => navigate("/docs/privacy")}
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        color="text.primary"
                        variant="body2"
                        component="button"
                        onClick={() => navigate("/docs/terms")}
                    >
                        Terms of Service
                    </Link>
                </div>
            </Box>
            <Outlet />
        </Container>
    );
};

export default DocsContainer;
