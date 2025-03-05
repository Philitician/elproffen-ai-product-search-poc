import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  const users = await sql`SELECT * FROM users`;
  return new Response(JSON.stringify(users));
}
