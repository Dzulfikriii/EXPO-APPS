import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  console.log("apy key", process.env.RESEND_API_KEY);
  try {
    console.log("📥 Received POST request to /api/audience");

    const body = await request.json();
    console.log("📝 Request body:", JSON.stringify(body, null, 2));

    const { email } = body;

    if (!email) {
      console.log("❌ Email is missing from request body");
      return Response.json({ success: false, error: "Email is required" });
    }

    console.log("✉️ Creating contact with email:", email);

    const response = await resend.contacts.create({
      email: email,
      firstName: "test",
      lastName: "test",
      unsubscribed: false,
    });

    console.log("✅ Contact created successfully:", response);
    return Response.json({ success: true, data: response });
  } catch (error) {
    console.error("🔴 Error in POST /api/audience:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create contact",
      },
      { status: 500 }
    );
  }
}