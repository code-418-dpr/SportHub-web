import { UserIcon } from "lucide-react";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    user: {
        image?: string | null;
    };
    className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="bg-background border">
                <UserIcon />
            </AvatarFallback>
        </Avatar>
    );
}
