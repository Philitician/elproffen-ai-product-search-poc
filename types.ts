import { z } from "zod";

const textBlockSchema = z.object({
  type: z.literal("text").describe("Typen på blokken"),
  text: z.string().describe("Teksten i blokken"),
});

export const productSchema = z.object({
  productId: z.string().describe("Iden til produktet"),
  productNumber: z.string().describe("Produktnummeret til produktet"),
  productName: z.string().describe("Navnet til produktet"),
});

const productBlockSchema = z.object({
  type: z.literal("product").describe("Typen på blokken"),
  product: productSchema.describe("Produktet"),
  reason: z.string().describe("Hvorfor produktet er relevant for brukeren"),
});

export const blockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  productBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;
