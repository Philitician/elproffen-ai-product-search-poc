import { EfoProduktdata } from "./get-efo-product-data";

export const createProductText = async (productData: EfoProduktdata) => {
  // Get ETIM-9 fields
  const etim9Fields = productData.Feltverdier.filter((f) =>
    f.Felt.startsWith("etim-9.0")
  );

  // Build ETIM-9 description
  const etim9Description = etim9Fields
    .map((field) => {
      if (typeof field.Verdi === "boolean") {
        return `${field.Visningsnavn}: ${field.Verdi ? "Ja" : "Nei"}`;
      }
      if (
        typeof field.Verdi === "object" &&
        "Fra" in field.Verdi &&
        "Til" in field.Verdi
      ) {
        return `${field.Visningsnavn}: ${field.Verdi.Fra} - ${field.Verdi.Til}${
          field.Maleenhet ? " " + field.Maleenhet : ""
        }`;
      }
      return `${field.Visningsnavn}: ${field.Verditekst || field.Verdi}${
        field.Maleenhet ? " " + field.Maleenhet : ""
      }`;
    })
    .join(". ");

  // Get technical description
  const tekniskBeskrivelse =
    productData.Feltverdier.find((f) => f.Felt === "teknisk beskrivelse")
      ?.Verdi || "";

  // Build the product text
  const productText = `
Produktnummer: ${productData.Produktnr}
Produktnavn: ${productData.Varenavn}
Produsent: ${productData.Produkteier.Navn}

Teknisk beskrivelse:
${tekniskBeskrivelse}

Tekniske spesifikasjoner:
${etim9Description}
`.trim();

  return productText;
};
