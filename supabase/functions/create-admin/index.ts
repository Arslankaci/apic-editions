import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if admin already exists
    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) {
      throw new Error("Erreur lors de la vérification: " + countError.message);
    }

    if (req.method === "GET") {
      return new Response(
        JSON.stringify({ adminExists: (count ?? 0) > 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if ((count ?? 0) > 0) {
      return new Response(
        JSON.stringify({ error: "Un administrateur existe déjà. Setup terminé." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email et mot de passe requis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Format d'email invalide." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate strong password
    if (
      typeof password !== "string" ||
      password.length < 12 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userId: string;

    // Try to create user, handle case where user already exists
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      // If user already exists, find them by email
      if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
        const { data: listData, error: listError } =
          await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
          throw new Error("Erreur recherche utilisateur: " + listError.message);
        }

        const existingUser = listData.users.find((u) => u.email === email);
        if (!existingUser) {
          throw new Error("Utilisateur introuvable malgré l'erreur de doublon.");
        }
        userId = existingUser.id;
      } else {
        throw new Error("Erreur création utilisateur: " + createError.message);
      }
    } else {
      userId = userData.user.id;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (roleError) {
      throw new Error("Erreur assignation rôle: " + roleError.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
