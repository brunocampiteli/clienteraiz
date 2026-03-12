import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      db: { schema: "public" },
    });

    // Read the schema file
    const schemaPath = join(process.cwd(), "supabase", "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    // Execute via Supabase's rpc (pg_execute) or direct SQL
    // We use the REST API to run SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    });

    return NextResponse.json({
      message:
        "Schema file is ready. Please execute it manually in the Supabase SQL Editor at: " +
        supabaseUrl.replace(".supabase.co", ".supabase.co/project/wzaaivrmmvardagxipiu/sql"),
      schemaLines: schema.split("\n").length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
