// Email notification dispatcher for new customer quote requests and contact messages

export type LeadNotificationData = {
  type: "quote" | "contact";
  name: string;
  contact: string;
  brand?: string;
  product?: string;
  quantity?: string;
  message?: string;
};

export async function sendLeadEmailNotification(data: LeadNotificationData): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "rafiqsonslabels@gmail.com";
  const fromEmail = process.env.FROM_EMAIL || "Rafiq Sons Leads <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.log("Email notification skipped: RESEND_API_KEY is not set yet in Vercel environment variables.");
    return false;
  }

  const isQuote = data.type === "quote";
  const subject = isQuote
    ? `✨ New Quote Request from ${data.name || "Customer"}${data.brand ? ` (${data.brand})` : ""}`
    : `📩 New Contact Message from ${data.name || "Customer"}`;

  const cleanPhone = data.contact.replace(/[^0-9]/g, "");
  const waUrl = cleanPhone.length >= 7 ? `https://wa.me/${cleanPhone}` : null;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0b09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f1e8;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0b09; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #151411; border: 1px solid #c6a15b; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 35px 30px 25px; background-color: #1a1814; border-bottom: 1px solid rgba(198, 161, 91, 0.2);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #c6a15b; letter-spacing: 2px; text-transform: uppercase;">
                RAFIQ SONS LABELS
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; color: #a39c8f; text-transform: uppercase; letter-spacing: 3px;">
                ${isQuote ? "New Customer Quote Request" : "New Website Inquiry"}
              </p>
            </td>
          </tr>

          <!-- Content Details -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #f5f1e8; line-height: 1.5;">
                A new customer has just submitted an inquiry on <a href="https://www.rafiqsonslabels.com" style="color: #c6a15b; text-decoration: none; font-weight: 600;">rafiqsonslabels.com</a>:
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0b09; border-radius: 12px; border: 1px solid rgba(245,241,232,0.1); margin-bottom: 25px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 13px; color: #a39c8f; width: 35%;">
                    Client Name
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 14px; color: #f5f1e8; font-weight: 600;">
                    ${data.name || "Not provided"}
                  </td>
                </tr>

                ${data.brand ? `
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 13px; color: #a39c8f;">
                    Brand / Company
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 14px; color: #c6a15b; font-weight: 600;">
                    ${data.brand}
                  </td>
                </tr>` : ""}

                ${data.product ? `
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 13px; color: #a39c8f;">
                    Selected Product
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 14px; color: #f5f1e8; font-weight: 600;">
                    ${data.product}
                  </td>
                </tr>` : ""}

                ${data.quantity ? `
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 13px; color: #a39c8f;">
                    Estimated Quantity
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 14px; color: #f5f1e8; font-weight: 600;">
                    ${data.quantity}
                  </td>
                </tr>` : ""}

                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 13px; color: #a39c8f;">
                    Contact Info
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(245,241,232,0.08); font-size: 14px; color: #25D366; font-weight: 600;">
                    ${data.contact || "Not provided"}
                  </td>
                </tr>

                ${data.message ? `
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #a39c8f; vertical-align: top;">
                    Notes / Artwork
                  </td>
                  <td style="padding: 14px 18px; font-size: 13px; color: #f5f1e8; line-height: 1.6;">
                    ${data.message.replace(/\n/g, "<br>")}
                  </td>
                </tr>` : ""}
              </table>

              <!-- Call to Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 25px;">
                    ${waUrl ? `
                    <a href="${waUrl}" style="display: inline-block; background-color: #25D366; color: #0c0b09; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-right: 10px;">
                      💬 Reply on WhatsApp
                    </a>
                    ` : ""}
                    <a href="https://www.rafiqsonslabels.com/admin" style="display: inline-block; background-color: #c6a15b; color: #0c0b09; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;">
                      ⚡ Open Admin Studio
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #0c0b09; border-top: 1px solid rgba(198, 161, 91, 0.15); font-size: 11px; color: #a39c8f;">
              Rafiq Sons Labels Atelier Notification System • <a href="https://www.rafiqsonslabels.com" style="color: #c6a15b; text-decoration: none;">www.rafiqsonslabels.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error("Resend API notification error:", errJson);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send lead email notification:", err);
    return false;
  }
}
