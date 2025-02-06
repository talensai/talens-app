import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { error } = await supabase.from("interviews").insert([
      {
        answers: data.answers,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving to database:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
