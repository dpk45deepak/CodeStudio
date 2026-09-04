import { db } from "@/lib/db";

export async function getGithubAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "github",
    },
    select: {
      access_token: true,
    },
  });

  return account?.access_token ?? null;
}