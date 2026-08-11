export interface QAReport {
  overall_result: "PASS" | "PASS_WITH_WARNINGS" | "FAIL";
  accuracy_score: number;
  ocr_score?: number;
  ocr_fidelity_score?: number;
  engineering_score?: number;
  engineering_spec_score?: number;
  classification_score?: number;
  taxonomy_score?: number;
  hallucination_score?: number;
  anti_hallucination_score?: number;
  commerce_readiness_score: number;
  detected_product?: string;
  verified_attributes: string[];
  suspected_errors?: string[];
  ocr_errors?: string[];
  engineering_errors?: string[];
  hallucinated_attributes: string[];
  unsupported_claims?: string[];
  missing_information?: string[];
  missing_critical_data?: string[];
  ocr_issues?: string[];
  engineering_issues?: string[];
  classification_issues?: string[];
  taxonomy_issues?: string[];
  json_schema_issues?: string[];
  critical_failures: string[];
  recommended_fixes: string[];
}

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
  qa_report?: QAReport;
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
