import { UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserInterface {
    image?: string | null;
}

export function UserAvatar({
    user,
    className,
}: {
    user: UserInterface;
    className?: string;
}): React.ReactNode {
    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="border border-black/30 bg-transparent">
                <UserIcon className="text-gray-500" />
            </AvatarFallback>
        </Avatar>
    );
}
