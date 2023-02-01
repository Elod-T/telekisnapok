export default function areArraysEqual(
  arr1: any[] | undefined,
  arr2: any[] | undefined
) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
