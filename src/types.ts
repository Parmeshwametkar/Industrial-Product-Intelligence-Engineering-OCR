export interface ProductMetadata {
  predicted_commercial_name: string;
  industrial_category: string;
  unspsc_code_guess: string;
}

export interface ExtractedTechnicalAttributes {
  key_dimensions: string[];
  materials_and_coatings: string[];
  performance_ratings: string[];
}

export interface CommerceReadiness {
  missing_critical_data: string[];
  suggested_cross_sell_items: string[];
}

export interface IndustrialProductData {
  product_metadata: ProductMetadata;
  extracted_technical_attributes: ExtractedTechnicalAttributes;
  commerce_readiness: CommerceReadiness;
}

export interface ExtractionResponse {
  success: boolean;
  data?: IndustrialProductData;
  raw_text?: string;
  error?: string;
  extracted_at?: string;
  image_type_detected?: string;
  model_used?: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  type: 'drawing' | 'blueprint' | 'datasheet' | 'photo' | 'nameplate' | 'schematic';
  imageDataUrl: string;
  mockData: IndustrialProductData;
}

export interface ExtractionHistoryItem {
  id: string;
  timestamp: string;
  imageName: string;
  imageDataUrl: string;
  data: IndustrialProductData;
  modelUsed: string;
}
