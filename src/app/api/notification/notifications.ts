"use server";

export async function sendEmailNotificationsAboutUpdate(receivers: string[], subject: string, body: string) {
    return fetch(`${process.env.NOTIFICATION_SERVICE_URL}/email-notification-about-update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receivers,
            subject,
            body,
        }),
    });
}

export async function subscribeOnEmailNotificationsRequest(
    receiver: string,
    competitionDate: Date,
    subject: string,
    body: string,
) {
    return fetch(`${process.env.NOTIFICATION_SERVICE_URL}/email-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receiver,
            competitionDate,
            subject,
            body,
        }),
    });
}
