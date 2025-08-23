import { toast, ToastContainer, Zoom } from "react-toastify";

export function successToast(msg: string) {
    toast.success(msg);
}

export function errorToast(msg: string) {
    toast.error(msg);
}

export function linkCopiedToast() {
    successToast("Link copied to clipboard!");
}

export default function CapYapToastContainer() {
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Zoom} />
        </>
    );
}
