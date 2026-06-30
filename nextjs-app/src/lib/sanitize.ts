export function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 5000);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-() ]/g, "").trim().slice(0, 20);
}

export function sanitizeName(name: string): string {
  return name.replace(/<[^>]*>/g, "").replace(/[^\w\s\-'.]/g, "").trim().slice(0, 100);
}
