import { NextRequest, NextResponse } from "next/server";
import { addSubscription } from "@/lib/pushSubscriptions";

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription: missing endpoint" },
        { status: 400 },
      );
    }

    addSubscription(subscription);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
