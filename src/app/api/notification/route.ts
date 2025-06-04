import { NextResponse } from "next/server";

import { createMessages, updateMessages } from "@/app/api/data/constants";
import { sendEmailNotificationsAboutUpdate } from "@/app/api/notification/notifications";
import { getAllUserEmails } from "@/data/user";

export async function POST() {
    try {
        const body =
            "НОВЫЕ СОБЫТИЯ:\n" + createMessages.join("\n") + "\n\nОБНОВЛЁННЫЕ СОБЫТИЯ:" + updateMessages.join("\n");

        const receivers = await getAllUserEmails();

        if (receivers.length < 1) {
            throw new Error("User emails count is 0");
        }

        const subject = "Обновление ЕКП";

        const response = await sendEmailNotificationsAboutUpdate(receivers, subject, body);

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        createMessages.splice(0);
        updateMessages.splice(0);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something goes wrong" }, { status: 400 });
    }
}
