export default function isAdmin(email: string | null | undefined) {
  if (!email) {
    return false;
  }
  const admins = ["tobak.elod@sztbg.hu"];
  return admins.includes(email);
}
