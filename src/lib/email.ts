// Email notification dispatcher for new customer quote requests and contact messages

export type LeadNotificationData = {
  type: "quote" | "contact";
  name: string;
  contact: string;
  brand?: string;
  product?: string;
  quantity?: string;
  country?: string;
  city?: string;
  dimensions?: string;
  colors?: string;
  material?: string;
  deliveryPreference?: string;
  items?: { name: string; quantity: string; specs?: string }[];
  message?: string;
};

export async function sendLeadEmailNotification(data: LeadNotificationData): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "hamzashoukat178@gmail.com";
  const fromEmail = process.env.FROM_EMAIL || "Rafiq Sons Leads <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.log("Email notification skipped: RESEND_API_KEY is not set in environment.");
    return false;
  }

  const isQuote = data.type === "quote";
  const subject = isQuote
    ? `⚡ [New Quote] ${data.name || "Client"}${data.brand ? ` (${data.brand})` : ""} - ${data.country || "Direct Inquiry"}`
    : `📩 [New Message] ${data.name || "Customer"}`;

  const cleanPhone = (data.contact || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone.length >= 7 ? `https://wa.me/${cleanPhone}` : null;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="620" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 30px 25px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                RAFIQ SONS LABELS
              </h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #fbbf24; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                ${isQuote ? "New Customer Quotation Request" : "New Website Contact Inquiry"}
              </p>
            </td>
          </tr>

          <!-- Content Details -->
          <tr>
            <td style="padding: 25px 30px;">
              <p style="margin: 0 0 18px; font-size: 15px; color: #334155; line-height: 1.5;">
                A customer just requested a custom quote on <a href="https://www.rafiqsonslabels.com" style="color: #b45309; text-decoration: none; font-weight: 700;">rafiqsonslabels.com</a>:
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%; font-weight: 600;">
                    Client Name
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">
                    ${data.name || "Not provided"}
                  </td>
                </tr>

                ${data.brand ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Brand / Company
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #b45309; font-weight: 700;">
                    ${data.brand}
                  </td>
                </tr>` : ""}

                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Contact Info
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #16a34a; font-weight: 700;">
                    ${data.contact || "Not provided"}
                  </td>
                </tr>

                ${data.country || data.city ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Location
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 600;">
                    ${[data.city, data.country].filter(Boolean).join(", ")}
                  </td>
                </tr>` : ""}

                ${data.product ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Product(s)
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">
                    ${data.product}
                  </td>
                </tr>` : ""}

                ${data.quantity ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Estimated Quantity
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">
                    ${data.quantity}
                  </td>
                </tr>` : ""}

                ${data.dimensions ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Size / Dimensions
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
                    ${data.dimensions}
                  </td>
                </tr>` : ""}

                ${data.material ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Material / Finish
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
                    ${data.material}
                  </td>
                </tr>` : ""}

                ${data.deliveryPreference ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">
                    Delivery Speed
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
                    ${data.deliveryPreference}
                  </td>
                </tr>` : ""}

                ${data.message ? `
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #64748b; vertical-align: top; font-weight: 600;">
                    Instructions / Notes
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; color: #334155; line-height: 1.6;">
                    ${data.message.replace(/\n/g, "<br>")}
                  </td>
                </tr>` : ""}
              </table>

              <!-- Call to Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 20px;">
                    ${waUrl ? `
                    <a href="${waUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-right: 8px;">
                      💬 Chat on WhatsApp
                    </a>
                    ` : ""}
                    <a href="https://www.rafiqsonslabels.com/admin" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                      ⚡ Open Admin Studio
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 16px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              Rafiq Sons Labels • Direct Factory Manufacturer • <a href="https://www.rafiqsonslabels.com" style="color: #b45309; text-decoration: none; font-weight: 600;">www.rafiqsonslabels.com</a>
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
