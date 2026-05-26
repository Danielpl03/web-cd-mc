export interface QuoteRequest {
  nombre: string;
  empresa: string | null;
  producto: string;
  cantidad: string;
  pais: string;
  telefono: string | null;
  email: string;
}

export interface QuoteRequestPayload extends QuoteRequest {
  created_at?: string;
}
