import { CheckIcon } from "lucide-react";

import { getServerSession } from "next-auth";

interface TgAuthPageProps {
    params: Promise<{ token: string }>;
}

export default async function TgAuthPage({ params }: TgAuthPageProps) {
    const token = decodeURIComponent((await params).token);

    const decodedToken = Buffer.from(token, "base64").toString("utf-8");
    const url = decodedToken.split("|")[1];

    const response = await fetch(`${url}/authorization/${token}`);
    if (!response.ok) {
        throw new Error("Not expected");
    }

    const session = await getServerSession();
    if (!session) {
        throw new Error("Not expected");
    }

    return (
        <div className="flex w-[400px] flex-col items-center justify-center space-y-4 gap-y-4">
            <h1 className="text-center text-3xl font-semibold">Подключение бота прошло успешно!</h1>
            <div className="flex w-full items-center justify-center">
                <CheckIcon className="h-32 w-32 text-green-500" />
            </div>
            <p>Вы можете закрыть эту страницу.</p>
        </div>
    );
}
