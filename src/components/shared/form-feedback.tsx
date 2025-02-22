import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";

type Props = {
    errorMessage?: string;
    successMessage?: string;
};

export function FormFeedback({ errorMessage, successMessage }: Props) {
    if (!errorMessage && !successMessage) {
        return null;
    }

    if (errorMessage) {
        return (
            <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
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
