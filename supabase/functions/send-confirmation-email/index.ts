import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: RegistrationRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kundalini Yoga Masterclass <onboarding@resend.dev>",
        to: [email],
        subject: "🧘 Tu Clase Gratuita de Kundalini Yoga está Lista",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Georgia', serif; background-color: #faf9f7; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #c4a77d; font-size: 28px; margin: 0;">Kundalini Yoga Masterclass</h1>
              </div>
              
              <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <h2 style="color: #2a2a2a; font-size: 24px; margin-top: 0;">¡Bienvenido/a, ${name}!</h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.8;">
                  Nos alegra que hayas dado el primer paso hacia tu transformación personal. Tu clase gratuita de 
                  <strong>Kirtan Kriya</strong> está lista para ti.
                </p>
                
                <div style="background: linear-gradient(135deg, #c4a77d 0%, #d4b896 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                  <p style="color: #ffffff; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
                    Tu acceso exclusivo
                  </p>
                  <a href="https://clase.kundaliniyoga.com" style="display: inline-block; background-color: #ffffff; color: #c4a77d; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Acceder a mi Clase Ahora →
                  </a>
                </div>
                
                <h3 style="color: #2a2a2a; font-size: 18px;">Lo que aprenderás:</h3>
                <ul style="color: #555; font-size: 15px; line-height: 2; padding-left: 20px;">
                  <li>Técnica de Kirtan Kriya en solo 12 minutos</li>
                  <li>Mudras y respiración consciente</li>
                  <li>Reducción del estrés y claridad mental</li>
                  <li>Equilibrio emocional duradero</li>
                </ul>
                
                <p style="color: #888; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  Si tienes alguna pregunta, responde a este correo. Estamos aquí para acompañarte en tu camino.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Kundalini Yoga Masterclass</p>
                <p>Todos los derechos reservados</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
