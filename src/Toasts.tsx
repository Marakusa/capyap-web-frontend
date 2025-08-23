import { toast, ToastContainer, Zoom } from "react-toastify";

export function successToast(msg: string) {
    toast.success(msg, {
        className: 'p-0 w-[400px] border border-gray-600/40 bg-gray-800',
    });
}

export function errorToast(msg: string) {
    toast.error(msg, {
        className: 'p-0 w-[400px] border border-gray-600/40 bg-gray-800',
    });
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
