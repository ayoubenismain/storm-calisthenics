import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import StormSettings from "@/models/StormSettings";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Please write a message." },
        { status: 400 }
      );
    }

    // Try to get recipient email from database settings
    let receiverEmail: string | undefined = undefined;
    try {
      await connectDB();
      const settings = await StormSettings.findOne().lean();
      if (settings && (settings as any).contactEmail) {
        receiverEmail = (settings as any).contactEmail;
      }
    } catch (dbErr) {
      console.warn("Could not fetch contactEmail from database settings:", dbErr);
    }

    // Send emails
    const result = await sendContactEmails({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      subject: subject ? subject.trim() : undefined,
      message: message.trim(),
      receiverEmail,
    });

    return NextResponse.json({
      success: true,
      simulated: result.simulated,
      message:
        "Thank you! Your message has been sent successfully. We will respond shortly.",
    });
  } catch (error: any) {
    console.error("Error handling contact form submission:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "An error occurred while sending your message. Please try again.",
      },
      { status: 500 }
    );
  }
}
