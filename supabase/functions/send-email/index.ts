import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_EMAILS_PER_DAY = 4;

interface EmailRequest {
  type: "contact" | "quote";
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// HTML escape function to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function checkRateLimit(supabase: any, ipAddress: string): Promise<{ allowed: boolean; count: number }> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { count, error } = await supabase
    .from('email_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ipAddress)
    .gte('sent_at', oneDayAgo);

  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, count: 0 }; // Allow on error to not block legitimate users
  }

  return { allowed: (count || 0) < MAX_EMAILS_PER_DAY, count: count || 0 };
}

async function recordEmailSent(supabase: any, ipAddress: string): Promise<void> {
  const { error } = await supabase
    .from('email_rate_limits')
    .insert({ ip_address: ipAddress });

  if (error) {
    console.error('Failed to record email sent:', error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check rate limit
    const { allowed, count } = await checkRateLimit(supabase, ipAddress);
    if (!allowed) {
      console.log(`Rate limit exceeded for IP: ${ipAddress}, count: ${count}`);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Maximum 4 emails per day allowed.",
          remaining: 0 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { type, name, email, phone, message }: EmailRequest = await req.json();

    // Input validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 255 || message.length > 5000 || (phone && phone.length > 20)) {
      return new Response(
        JSON.stringify({ error: "Field length exceeded" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${type} email from ${escapeHtml(name)} (${escapeHtml(email)}), IP: ${ipAddress}`);

    const subject = type === "contact" 
      ? "Nieuw contactbericht via website"
      : "Nieuwe offerte aanvraag via website";

    // Escape all user inputs before HTML interpolation
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : null;
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const emailHtml = `
      <h2>${subject}</h2>
      <p><strong>Naam:</strong> ${safeName}</p>
      <p><strong>E-mail:</strong> ${safeEmail}</p>
      ${safePhone ? `<p><strong>Telefoon:</strong> ${safePhone}</p>` : ""}
      <p><strong>Bericht/Aanvraag:</strong></p>
      <p>${safeMessage}</p>
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

    // Record successful email send for rate limiting
    await recordEmailSent(supabase, ipAddress);

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        ...data, 
        remaining: MAX_EMAILS_PER_DAY - count - 1 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
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
