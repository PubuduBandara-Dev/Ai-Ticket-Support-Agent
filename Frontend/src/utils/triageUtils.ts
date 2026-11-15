function normalizeValue(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

export function normalizeStatus(status: string | null | undefined): string {
  return normalizeValue(status);
}

export function isPendingApproval(status: string | null | undefined): boolean {
  return normalizeStatus(status) === 'pending approval';
}

export function isApproved(status: string | null | undefined): boolean {
  return normalizeStatus(status) === 'approved';
}

export function isRejected(status: string | null | undefined): boolean {
  return normalizeStatus(status) === 'rejected';
}

export function normalizePriority(priority: string | null | undefined): string {
  return normalizeValue(priority);
}
