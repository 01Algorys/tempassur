import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface CreateContractParams {
  paymentIntentId: string
  devisId: string
  values: SubscriptionFormValues
}

const MAX_ATTEMPTS = 3
const RETRY_DELAYS_MS = [800, 2000]

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function attemptCreateContract(
  params: CreateContractParams
): Promise<{ success: boolean; numero?: string }> {
  const response = await fetch("/api/create-contract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentIntentId: params.paymentIntentId,
      devisId: params.devisId,
      marque: params.values.marque,
      modele: params.values.modele,
      immatriculation: params.values.immatriculation,
      dateEffet: params.values.dateEffet,
      heureEffet: params.values.heureEffet,
      duree: params.values.duree,
    }),
  })

  if (!response.ok) return { success: false }
  const data = (await response.json()) as { success?: boolean; numero?: string }
  return { success: !!data.success, numero: data.numero }
}

// The payment already succeeded by the time this is called. Transforming the devis into
// a contrat can hit a transient CRM issue, so this retries up to MAX_ATTEMPTS times and
// stops at the first success — never throws, but the caller is expected to check
// `.success` and act on a final failure rather than ignore it (the CRM transform is
// idempotent server-side, so retrying after a real success just gets a harmless 409).
export async function createContract(
  params: CreateContractParams
): Promise<{ success: boolean; numero?: string }> {
  let last: { success: boolean; numero?: string } = { success: false }
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      last = await attemptCreateContract(params)
    } catch {
      last = { success: false }
    }
    if (last.success) return last
    if (attempt < MAX_ATTEMPTS - 1) await sleep(RETRY_DELAYS_MS[attempt])
  }
  return last
}
