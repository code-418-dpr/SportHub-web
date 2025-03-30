import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";

interface Props {
    errorMessage?: string;
    successMessage?: string;
}

export function FormFeedback({ errorMessage, successMessage }: Props) {
    if (!errorMessage && !successMessage) {
        return null;
    }

    if (errorMessage) {
        return (
            <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-sm">
                <TriangleAlertIcon className="h-4 w-4" />
                <p>{errorMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
            <CircleCheckIcon className="h-4 w-4" />
            <p>{successMessage}</p>
        </div>
    );
}
