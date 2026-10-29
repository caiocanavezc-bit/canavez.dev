export function whatsappUrl(phoneE164Digits: string, message: string): string {
  return `https://wa.me/${phoneE164Digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
