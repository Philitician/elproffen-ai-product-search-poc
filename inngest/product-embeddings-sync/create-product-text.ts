import { EfoProduktdata } from "./get-efo-product-data";

export const createProductText = async (productData: EfoProduktdata) => {
  return JSON.stringify(productData);
};
