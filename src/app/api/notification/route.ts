import { NextResponse } from "next/server";

import { messages } from "@/app/api/data/route";

export async function sendNotification(body: string): Promise<Response> {
    return await fetch("http://localhost:5265/email-notification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receiver: "rustamov.vladislav@gmail.com",
            competitionDate: "2025-06-03T16:59:59.658Z",
            subject: "Обновление ЕКП",
            body: body,
        }),
    });
}

export async function POST() {
    try {
        const body = messages.join("\n");

        const response = await sendNotification(body);

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        messages.splice(0);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something goes wrong" }, { status: 400 });
    }
}
