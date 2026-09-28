import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getShipments, getShipmentsByOwner, saveShipments } from "@/lib/store";
import { generateUniqueCourierTrackingNumber } from "@/lib/tracking";
import { isFile, saveUploadedImage } from "@/lib/uploads";
import { sendShipmentNotification } from "@/lib/email";
import { getSessionUserId } from "@/lib/auth";
import { getCourier } from "@/data/couriers";
import type { CourierId } from "@/data/couriers";
import type { Shipment, StatusCode } from "@/types";

export const dynamic = "force-dynamic";

const VALID_STATUSES: StatusCode[] = [
  "order_created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const shipments = await getShipmentsByOwner(userId);
  return NextResponse.json({ shipments });
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const productName = String(formData.get("productName") ?? "").trim();
    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    const rawCourier = String(formData.get("courier") ?? "").trim();
    if (!getCourier(rawCourier)) {
      return NextResponse.json(
        { error: "Please select a valid delivery service." },
        { status: 400 }
      );
    }
    const courier = rawCourier as CourierId;

    const allShipments = await getShipments();
    const trackingNumber = generateUniqueCourierTrackingNumber(
      courier,
      allShipments.map((s) => s.trackingNumber)
    );

    // Image: uploaded file takes precedence, otherwise a pasted URL.
    let productImage: string | null = null;
    const file = formData.get("productImage");
    if (isFile(file) && file.size > 0) {
      productImage = await saveUploadedImage(file);
    } else {
      const url = String(formData.get("productImageUrl") ?? "").trim();
      if (url) productImage = url;
    }

    const rawStatus = String(formData.get("statusCode") ?? "in_transit");
    const statusCode: StatusCode = VALID_STATUSES.includes(
      rawStatus as StatusCode
    )
      ? (rawStatus as StatusCode)
      : "in_transit";

    const now = new Date().toISOString();
    const shipment: Shipment = {
      id: crypto.randomUUID(),
      trackingNumber,
      courier,
      ownerId: userId,
      productName,
      productImage,
      recipientName: String(formData.get("recipientName") ?? "").trim(),
      clientEmail: String(formData.get("clientEmail") ?? "").trim() || undefined,
      senderName: String(formData.get("senderName") ?? "").trim() || undefined,
      senderEmail:
        String(formData.get("senderEmail") ?? "").trim() || undefined,
      senderAddress:
        String(formData.get("senderAddress") ?? "").trim() || undefined,
      origin: String(formData.get("origin") ?? "").trim(),
      destinationAddress: String(
        formData.get("destinationAddress") ?? ""
      ).trim(),
      destinationCity: String(formData.get("destinationCity") ?? "").trim(),
      destinationState: String(formData.get("destinationState") ?? "").trim(),
      destinationZip: String(formData.get("destinationZip") ?? "").trim(),
      statusCode,
      statusLabel:
        String(formData.get("statusLabel") ?? "").trim() || "In Transit",
      description: String(formData.get("description") ?? "").trim(),
      estimatedDelivery: String(
        formData.get("estimatedDelivery") ?? ""
      ).trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      createdAt: now,
      updatedAt: now,
    };

    allShipments.unshift(shipment);
    await saveShipments(allShipments);

    // Send tracking details to the recipient and sender. We await this because
    // fire-and-forget promises can be terminated early on serverless hosts
    // (e.g. Vercel) before the email is actually dispatched.
    try {
      await sendShipmentNotification(shipment);
    } catch (err) {
      console.error("Failed to send tracking email:", err);
    }

    return NextResponse.json({ shipment }, { status: 201 });
  } catch (err) {
    console.error("Failed to create shipment:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong while creating the shipment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
