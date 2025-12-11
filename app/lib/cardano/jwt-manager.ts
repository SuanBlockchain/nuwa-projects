import { cookies } from 'next/headers';

const JWT_COOKIE_NAME = 'cardano_wallet_token';

export async function setWalletJWT(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getWalletJWT(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(JWT_COOKIE_NAME)?.value;
}

export async function clearWalletJWT() {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE_NAME);
}
