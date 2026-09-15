type InvoiceAmount = {
  amount_sek: number;
  amount_due_sek?: number;
  status: string;
  traditional_requested?: boolean;
  traditional_fee_sek?: number;
};

export function invoiceMoney(amount: number): string {
  return `${amount.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} kr`;
}

/** The API owns the actual payable amount; the fallback supports old payloads. */
export function invoiceAmountDue(invoice: InvoiceAmount): number {
  if (typeof invoice.amount_due_sek === "number" && Number.isFinite(invoice.amount_due_sek)) {
    return invoice.amount_due_sek;
  }
  return invoice.amount_sek + (invoice.traditional_requested ? (invoice.traditional_fee_sek ?? 0) : 0);
}

export function invoiceEmailRequestConfirmation(invoice: InvoiceAmount): string | null {
  const fee = invoice.traditional_fee_sek;
  if (invoice.status !== "sent" || invoice.traditional_requested || invoiceAmountDue(invoice) <= 0
    || typeof fee !== "number" || !Number.isFinite(fee) || fee < 0) return null;
  return `Begär e-postfaktura? En fakturaavgift på ${invoiceMoney(fee)} tillkommer. `
    + `Totalt att betala blir ${invoiceMoney(invoiceAmountDue(invoice) + fee)}. `
    + "Vi hanterar din begäran och skickar fakturan via e-post. Vill du fortsätta?";
}
