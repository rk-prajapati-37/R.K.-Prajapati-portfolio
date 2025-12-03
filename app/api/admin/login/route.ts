import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword || !jwtSecret) {
      return new Response(
        JSON.stringify({ error: 'Admin credentials not configured' }),
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err: any) {
    console.error('Login error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Login failed' }),
      { status: 500 }
    );
  }
}
