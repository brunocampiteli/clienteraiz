import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import {
  getAllSubscriptions,
  removeSubscription,
} from "@/lib/pushSubscriptions";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@clienteraiz.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, url } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 },
      );
    }

    const payload = JSON.stringify({
      title,
      body: body || "",
      url: url || "/app",
      tag: `cr-push-${Date.now()}`,
    });

    const subscriptions = getAllSubscriptions();

    if (subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, total: 0 });
    }

    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, payload);
          sent++;
        } catch (err: unknown) {
          failed++;
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 410 || statusCode === 404) {
            removeSubscription(sub.endpoint);
          }
        }
      }),
    );

    return NextResponse.json({ sent, failed, total: subscriptions.length });
  } catch {
    return NextResponse.json(
      { error: "Falha ao enviar" },
      { status: 500 },
    );
  }
}
