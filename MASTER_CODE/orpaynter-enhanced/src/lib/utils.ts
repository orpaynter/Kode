import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDamageUrgency(severity: string, urgencyLevel: number): string {
  if (severity === 'emergency' || urgencyLevel >= 9) return 'EMERGENCY'
  if (severity === 'severe' || urgencyLevel >= 7) return 'HIGH'
  if (severity === 'moderate' || urgencyLevel >= 5) return 'MEDIUM'
  return 'LOW'
}

export function getBudgetRangeOptions(): string[] {
  return [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000 - $50,000',
    '$50,000+',
    'Insurance will cover'
  ]
}

export function getTimelineOptions(): string[] {
  return [
    'Immediately (Emergency)',
    'Within 1 week',
    'Within 2 weeks',
    'Within 1 month',
    'Within 3 months',
    'Planning for next year'
  ]
}

export function getRoofMaterialOptions(): string[] {
  return [
    'Asphalt Shingles',
    'Metal Roofing',
    'Tile (Clay/Concrete)',
    'Slate',
    'Wood Shingles/Shakes',
    'Flat/Built-up Roof',
    'Not Sure'
  ]
}
