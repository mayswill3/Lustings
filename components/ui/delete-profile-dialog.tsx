import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface DeleteProfileDialogProps {
    onConfirmDelete: () => Promise<void>
    isDeleting: boolean
}

export function DeleteProfileDialog({
    onConfirmDelete,
    isDeleting
}: DeleteProfileDialogProps) {
    const [open, setOpen] = React.useState(false)

    const handleDelete = async () => {
        await onConfirmDelete()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 text-sm font-normal"
                >
                    Delete profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Delete Profile
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Are you sure you want to delete your profile? This action cannot be undone.
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-start gap-2">
                                • Your profile and personal data will be permanently removed
                            </li>
                            <li className="flex items-start gap-2">
                                • You'll need to create a new account to use our services again
                            </li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="mt-2 sm:mt-0"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="mt-2 sm:mt-0"
                    >
                        {isDeleting ? "Deleting..." : "Delete Profile"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}