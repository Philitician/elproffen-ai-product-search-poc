const PRODUCT_ENDPOINT = "1.2/Produktdata/Hent";

export type EfoProduktRespons = {
  Liste: EfoProduktdata[];
  Sideinfo: SideInfo;
};

export type EfoProduktdata = {
  Produktnr: number;
  Varenavn: string;
  Feltverdier: FeltVerdi[];
  Produkteier: Produkteier;
};

export type FeltVerdi = {
  Felt: string;
  Visningsnavn: string;
  Guid: string;
  Verdi: string | string[] | number[];
  Verditekst?: string;
  Maleenhet?: string;
};

type Produkteier = {
  Navn: string;
  Levnr: number;
  Orgnr: string;
};

export type SideInfo = {
  Side: number;
  AntallSider: number;
  AntallPerSide: number;
  AntallTotalt: number;
};

export type SupplierStockData = {
  articleNr: string;
  warehouseNr?: number;
  warehouseName?: string;
  currentStock: number;
  supplier: string;
};

const buildEfoQueryString = (Produktnr: string) => {
  const searchParams = new URLSearchParams({ Produktnr });
  return searchParams.toString();
};

const efoHeaders = {
  Authorization: `Basic ${process.env.EFO_AUTH_ENCODED!}`,
};

export const getEfoProductData = async (productNumber: string) => {
  const searchParams = buildEfoQueryString(productNumber);
  const url = `${process.env.NEXT_PUBLIC_EFO_BASE_URL}/${PRODUCT_ENDPOINT}?${searchParams}`;
  const res = await fetch(url, {
    headers: efoHeaders,
  });
  if (res.status !== 200) throw new Error("Failed to fetch product data");
  return res.json() as Promise<EfoProduktdata>;
};
