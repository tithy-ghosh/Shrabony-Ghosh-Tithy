"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim();

  if (honeypot) return { status: "idle" };

  if (name.length < 2) {
    return { status: "error", message: "Please tell me your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "That email doesn't look right." };
  }
  if (message.length < 10) {
    return {
      status: "error",
      message: "A few more words would help — 10 characters minimum.",
    };
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;

    if (apiKey && to) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to,
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      });
    } else {
      // No key configured yet — works locally, nothing leaves the server.
      console.log(`[contact] ${name} <${email}>: ${message}`);
    }

    return {
      status: "success",
      message: "Message sent — I'll get back to you within a day.",
    };
  } catch (err) {
    console.error("[contact] failed", err);
    return {
      status: "error",
      message: "Delivery failed — please email me directly instead.",
    };
  }
}
