import { algoliasearch } from "algoliasearch";

type ProductOwnerRecordPart = {
  name: string;
  efoLevNr: number | null;
  logoUrl: string | null;
  hasPriority: boolean;
};

export type ProductRecordPart = {
  articleNumber: string | null;
  productName: string;
  productDescription: string | null;
  technicalDescription: string | null;
  gtin: string | null;
  crossSection: number | null;
  numberOfConductors: number | null;
  blockNumber: string | null;
  packageUnit: string | null;
  hasEpd: boolean;
  productId: number;
  productNumber: string;
  assortment: boolean;
  images: string[];
  productOwner: ProductOwnerRecordPart;
  isEfoProduct: boolean;
  salesVolumeRatio: number;
};

export type SupplierRecordPart = {
  supplierProductId: number;
  supplierId: string;
  supplierName: string;
  priceUnit: string;
  measureUnit: string;
  salesQuantity: number;
  salesPackage: number;
  stocked: boolean;
  cataloguePrice: number; // uplifted
  priceFromDate: string;
  priceToDate: string | null;
  lowestPrice: number;
  price: number; // either netPrice or cataloguePrice
  campaignPrice: number | null;
  campaignFromDate: string | null;
  campaignToDate: string | null;
};

export type CategoryRecordPart = {
  lvl0: string | null;
  lvl1: string | null;
  lvl2: string | null;
};

export type ProductRecord = ProductRecordPart & {
  objectID: string;
  isAnyStocked: boolean;
  lowestPriceOverall: number;
  category: CategoryRecordPart | undefined;
  suppliers: SupplierRecordPart[];
};

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

export const getAlgoliaProducts = async (objectIDs: string[]) =>
  algoliaClient.getObjects<ProductRecord>({
    requests: objectIDs.map((objectID) => ({
      indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!,
      objectID,
    })),
  });
