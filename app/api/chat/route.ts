import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt = '' } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
  return NextResponse.json({ reply });
}
