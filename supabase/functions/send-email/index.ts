import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "contact" | "quote";
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, name, email, phone, message }: EmailRequest = await req.json();

    console.log(`Processing ${type} email from ${name} (${email})`);

    const subject = type === "contact" 
      ? "Nieuw contactbericht via website"
      : "Nieuwe offerte aanvraag via website";

    const emailHtml = `
      <h2>${subject}</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefoon:</strong> ${phone}</p>` : ""}
      <p><strong>Bericht/Aanvraag:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Feest Fundament <onboarding@resend.dev>",
        to: ["info@feest-fundament.nl"],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
