// Formes des enregistrements renvoyés par wn-conseil-api (voir son schema.prisma).
// Seuls les champs utilisés par le panel sont typés précisément.

export interface Reference {
  id: string
  nom: string
  couleur?: string | null
}

export interface ClientRecord {
  id: string
  type?: "PARTICULIER" | "PROFESSIONNEL"
  statutRelation?: "PROSPECT" | "CLIENT"
  civilite?: string | null
  nom?: string | null
  prenom?: string | null
  telephone?: string | null
  email?: string | null
  telephones?: string[]
  emails?: string[]
  raisonSociale?: string | null
  siret?: string | null
  secteurActivite?: string | null
  nationalite?: string | null
  adresse?: string | null
  codePostal?: string | null
  ville?: string | null
  pays?: string | null
  dateNaissance?: string | null
  paysNaissance?: string | null
  paysResidence?: string | null
  territoireResidence?: string | null
  numeroPermis?: string | null
  paysPermis?: string | null
  dateObtentionPermis?: string | null
  notes?: string | null
  isVip?: boolean
  createdAt?: string
  updatedAt?: string
  _count?: { contrats?: number; devis?: number; documents?: number }
}

interface DossierCommon {
  id: string
  numero: string | null
  clientId: string
  client: ClientRecord | null
  categorie: "TEMPASSUR" | "VITRE_ASSUR" | "AUTRE" | null
  sousCategorie: string | null
  details: Record<string, unknown> | null
  natureRemuneration: string | null
  encaissement: number | null
  prime: number | null
  honoraires: number | null
  distributeurId?: string | null
  produitId?: string | null
  distributeur?: Reference | null
  besoinsExprimes?: string | null
  createdAt: string
  updatedAt?: string
}

export interface DevisRecord extends DossierCommon {
  statutPipeline: string
  montantEstime: number | null
  dateCreation: string
  dateRelance: string | null
  probabilite: number | null
  motifPerte: string | null
  notes: string | null
  contratId: string | null
  produit?: Reference | null
}

export interface ContratRecord extends DossierCommon {
  numero: string
  numeroDemande: string | null
  statutRefId: string | null
  statutRef?: Reference | null
  produitRef?: Reference | null
  marque: string | null
  modele: string | null
  immatriculation: string | null
  dateDebut: string
  dateFin: string
  dateSouscription: string | null
  dateEffet: string | null
  dureeJours: number | null
  dateResiliation: string | null
  motifResiliation: string | null
  dateRappel: string | null
  notesInternes: string | null
  prime: number
  honoraires: number
}

export interface TacheRecord {
  id: string
  titre: string
  type: string
  description: string | null
  statut: "A_TRAITER" | "EN_COURS" | "TRAITE" | "ANNULE"
  priorite: string
  echeance: string | null
  clientId: string | null
  contratId: string | null
  devisId: string | null
  client?: ClientRecord | null
  contrat?: (Pick<ContratRecord, "id" | "numero"> & { client?: ClientRecord | null; statutRef?: Reference | null }) | null
  devis?: (Pick<DevisRecord, "id" | "numero" | "statutPipeline"> & { client?: ClientRecord | null }) | null
  createdAt: string
}

export interface DocumentRecord {
  id: string
  nom: string
  nomAffiche?: string
  type: string
  url: string
  taille: number | null
  note: string | null
  libelleAutre: string | null
  statutDocument: string
  createdAt: string
  clientId: string | null
  contratId: string | null
  devisId: string | null
  typeDocumentId: string | null
  typeDocumentRef?: Reference | null
  client?: ClientRecord | null
  contrat?: { id: string; numero: string; categorie?: string | null } | null
  devis?: { id: string; numero: string | null; categorie?: string | null } | null
}

export function clientFullName(client: Pick<ClientRecord, "prenom" | "nom" | "raisonSociale"> | null | undefined) {
  if (!client) return ""
  return [client.prenom, client.nom].filter(Boolean).join(" ") || client.raisonSociale || ""
}

export function allPhones(client: ClientRecord | null | undefined): string[] {
  if (!client) return []
  return [client.telephone, ...(client.telephones ?? [])].filter((v): v is string => !!v)
}

export function allEmails(client: ClientRecord | null | undefined): string[] {
  if (!client) return []
  return [client.email, ...(client.emails ?? [])].filter((v): v is string => !!v)
}

// Lien vers un fichier du CRM via le proxy authentifié du panel.
export function proxiedFileUrl(url: string, downloadName?: string): string {
  const marker = "/api/files/"
  const idx = url.indexOf(marker)
  const rest = idx >= 0 ? url.slice(idx + marker.length) : url
  const query = downloadName ? `?download=${encodeURIComponent(downloadName)}` : ""
  return `/api/admin/files/${rest}${query}`
}
