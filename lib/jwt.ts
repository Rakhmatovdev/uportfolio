const JWT_SECRET = process.env.AUTH_SECRET || 'secure-random-auth-jwt-secret-key-bexa-studio-2026';

// Helper to encode string to Base64Url
function base64UrlEncode(str: string, isBinary: boolean = false): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, isBinary ? 'binary' : 'utf-8').toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  // Fallback for non-Node environments (Edge runtime)
  const encoder = new TextEncoder();
  const bytes = isBinary ? new Uint8Array(str.split('').map(c => c.charCodeAt(0))) : encoder.encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Helper to decode Base64Url
function base64UrlDecode(str: string, isBinary: boolean = false): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString(isBinary ? 'binary' : 'utf-8');
  }
  // Fallback for non-Node environments
  const binary = atob(base64);
  if (isBinary) return binary;
  const bytes = new Uint8Array(binary.split('').map(c => c.charCodeAt(0)));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// HMAC-SHA256 Sign using Web Crypto API (Edge Runtime Compatible)
async function signHMAC256(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataData);
  
  // Convert ArrayBuffer to binary string then base64url
  const hashBytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < hashBytes.byteLength; i++) {
    binary += String.fromCharCode(hashBytes[i]);
  }
  return base64UrlEncode(binary, true); // Keep binary encoding for hash signatures
}

// Create secure JWT
export async function signJWT(payload: any, expiresInSeconds: number = 86400 * 7): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const fullPayload = {
    ...payload,
    exp,
    iat: Math.floor(Date.now() / 1000)
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header), false);
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload), false);
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  
  const signature = await signHMAC256(tokenInput, JWT_SECRET);
  return `${tokenInput}.${signature}`;
}

// Verify secure JWT
export async function verifyJWT(token: string): Promise<any | null> {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const tokenInput = `${headerB64}.${payloadB64}`;
    
    // Verify signature
    const expectedSignature = await signHMAC256(tokenInput, JWT_SECRET);
    if (signatureB64 !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(payloadB64, false));
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (e) {
    return null;
  }
}

