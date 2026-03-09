import { NextRequest, NextResponse } from "next/server";

// Vercel serverless functions restrict body sizes to 4MB by default.
// Since we are proxying potentially large files (PDFs/Images) to the Python backend,
// we need to bypass the default bodyParser size limit.
// We are proxying NextRequest natively.
export const maxDuration = 60; // Set max duration if doing long OCR




export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
    return handleProxy(req, params);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
    return handleProxy(req, params);
}

async function handleProxy(req: NextRequest, paramsPromise: Promise<{ slug: string[] }>) {
    try {
        const { slug } = await paramsPromise;
        const slugPath = slug.join("/");

        // If Vercel env var is missing, default directly to the new Alibaba Cloud HK backend (Proxy via Nginx on Port 80)
        let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://47.238.82.250";
        if (backendUrl.endsWith("/")) {
            backendUrl = backendUrl.slice(0, -1);
        }

        const targetUrl = `${backendUrl}/api/${slugPath}${req.nextUrl.search}`;
        console.log(`[Proxy] Incoming request for /api/${slugPath}`);
        console.log(`[Proxy] Forwarding to: ${targetUrl}`);

        const headers = new Headers(req.headers);
        // Remove host header to avoid backend host mismatch issues
        headers.delete("host");
        headers.delete("connection");

        const fetchInit: RequestInit = {
            method: req.method,
            headers: headers,
            // NextJS requires duplex: 'half' for streaming requests
            // @ts-expect-error Fetch RequestInit is missing duplex but undici needs it
            duplex: "half",
        };

        if (req.method !== "GET" && req.method !== "HEAD") {
            const body = await req.text();
            if (body) {
                fetchInit.body = body;
                console.log(`[Proxy] Request body size: ${(body.length / 1024 / 1024).toFixed(2)} MB`);
            }
        }

        const response = await fetch(targetUrl, fetchInit);
        console.log(`[Proxy] Backend responded with status: ${response.status} ${response.statusText}`);

        // Forward the backend response back to the client
        // We MUST strip 'content-encoding' because 'fetch' might have decompressed the body,
        // and 'content-length' because the decompressed body size differs from the compressed one.
        const resHeaders = new Headers(response.headers);
        resHeaders.delete("content-encoding");
        resHeaders.delete("content-length");
        resHeaders.delete("transfer-encoding");

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: resHeaders,
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error(`[Proxy] Request failed:`, err);
        return NextResponse.json(
            { error: "Proxy Request Failed", details: err.message },
            { status: 502 }
        );
    }
}

