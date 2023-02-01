export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function base64ToBuffer(base64: string): Buffer {
  const arr = base64.split(",");
  const bstr = Buffer.from(arr[1], "base64");
  return bstr;
}
