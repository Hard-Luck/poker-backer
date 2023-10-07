import { toast } from "sonner"

export function toastDefaultSuccess(message: string) {
    toast.success(message, {
        position: "top-center",
        duration: 3000,
    })
}

export function toastDefaultError(message: string) {
    toast.error(message, {
        position: "top-center",
        duration: 3000,
    })
}