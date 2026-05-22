/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UploadedFileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface EnterpriseIdentity {
  cnName: string;
  enName: string;
  brandEn: string[]; // Dynamically scalable list of brand names
  logoHexSlogan: {
    logoMeta?: UploadedFileMeta;
    colorHex: string;
    sloganCn: string;
    sloganEn: string;
  };
  foundedYear: number;
  businessLicenseMeta?: UploadedFileMeta;
  addressCascade: {
    country: string;
    province: string;
    city: string;
    district: string;
    detailCn: string;
    detailEn: string;
    isConsistent: boolean; // Is register place consistent with production plant
    registerAddress?: string;
  };
}

export interface ScalingAndCredentials {
  totalStaff: string; // Dropdown value
  rndStaffCount: number;
  rndStaffRatio: number; // Linked slider 0-100%
  facilityArea: {
    area: number;
    unit: string; // m² / mu
    ownership: string; // Own / Rent
    photos: UploadedFileMeta[];
  };
  honors: Array<{
    id: string;
    name: string;
    certYear: number;
    fileMeta?: UploadedFileMeta;
  }>;
  certifications: Array<{
    id: string;
    name: string; // CE, RoHS, ISO9001 etc
    issuer: string;
    certNo: string;
    expiryDate: string;
    fileMeta?: UploadedFileMeta;
  }>;
  factoryAudits: Array<{
    id: string;
    auditor: string; // SGS, BV, Walmart etc
    customName?: string;
    fileMeta?: UploadedFileMeta;
  }>;
}

export interface ProductionCapability {
  mainCategories: string[]; // Category tree checkboxes
  hsCodes: Array<{
    id: string;
    code: string;
    prodNameCn: string;
    isFeatured: boolean;
  }>;
  eCatalogs: UploadedFileMeta[];
  featuredProducts: Array<{
    id: string;
    nameCn: string;
    nameEn: string;
    model: string;
    params: string;
    priceMin: number;
    priceMax: number;
    unit: string;
    whiteBgPhoto?: UploadedFileMeta;
    scenePhoto?: UploadedFileMeta;
    targetMarket: string;
  }>;
  productionLines: Array<{
    id: string;
    name: string;
    qty: number;
    isExclusive: boolean;
  }>;
  newProductsYearly: number;
  keyEquipments: Array<{
    id: string;
    name: string;
    fileMeta?: UploadedFileMeta;
    isVideo?: boolean;
    advantage: string;
    isFirstInClass: string; // "global", "domestic", "no"
  }>;
  supplyChainRatio: {
    model: string; // "full", "core", "assembly"
    rawMaterialsSource: string;
  };
  oemOdmCapacity: {
    enabled: boolean;
    types: string[]; // OEM, ODM, JDM
    duration: string; // ≤7 days, 8-15 days, etc.
    flowDescription: string;
    minOrderQty: number;
  };
}

export interface QualityAndCompliance {
  qcWorkflow: {
    steps: string[]; // IQC, IPQC, etc.
    labPhotos: UploadedFileMeta[];
    coreTestingItems: string;
  };
  moqThresholds: Array<{
    id: string;
    category: string;
    moqQty: number;
    unit: string;
    remark: string;
  }>;
  leadTime: {
    standardBatchDays: number;
    customOrderDays: number;
    seasonPeakRemark: string;
  };
  samplePolicy: {
    feePolicy: string; // free, charged, offset
    freightPolicy: string; // buyer, seller, cod
    sampleFeeUsd: number;
  };
  internalBusinessFlow: string[]; // Drag and drop ordering
}

export interface MarketAndClient {
  marketMatrix: Array<{
    id: string;
    marketRegion: string;
    featuredProduct: string;
    reason: string;
  }>;
  keywordsSet: {
    cnKeywords: string[];
    enKeywords: string[];
  };
  blacklistRegions: Array<{
    id: string;
    country: string;
    reasonType: string;
    remark: string;
  }>;
  domesticCompetitors: Array<{
    id: string;
    name: string;
    brand: string;
    website: string;
    socialLinks: { [platform: string]: string };
  }>;
  foreignCompetitors: Array<{
    id: string;
    name: string;
    country: string;
    website: string;
    socialLinks: { [platform: string]: string };
  }>;
  overseasCases: Array<{
    id: string;
    country: string;
    clientType: string; // Trader, Brand, Factory
    yearsPartnered: number;
    scenario: string;
    isAuthorized: boolean;
    photoMeta?: UploadedFileMeta;
  }>;
  repurchaseReasons: {
    tags: string[];
    quotes: Array<{
      id: string;
      rawQuotesCn: string;
      quotesEn: string;
      clientCountry: string;
      signatureAllowed: boolean;
      screenshotMeta?: UploadedFileMeta;
    }>;
  };
  afterSalesSupport: {
    services: string[];
    detailRemarks: { [serviceKey: string]: string };
  };
  commonMisconceptions: Array<{
    id: string;
    misconception: string;
    clarification: string;
  }>;
  targetBuyerPersona: {
    idealTypes: string[];
    idealVolume: string;
    idealDecisionRoles: string[];
    nonIdealPersona: string;
  };
}

export interface ShootingPrep {
  staffPrep: Array<{
    id: string;
    name: string;
    position: string;
    isFounder: boolean;
    englishFluent: string;
    wearStyle: string;
    shootingConsent: string;
  }>;
  shootingLocations: Array<{
    id: string;
    name: string;
    photos: UploadedFileMeta[];
    linkedFlowStep: string; // Link to node 28
    isAerialReachable: boolean;
  }>;
  highlightShots: {
    suggestions: string;
    selectedLocationIds: string[];
    selectedMisconceptionsIds: string[];
  };
  existingMediaArchive: Array<{
    id: string;
    type: string;
    qty: number;
    cloudUrl: string;
    pwdCode: string;
    authorizedUsage: string[];
  }>;
  ndaConfidential: {
    remark: string;
    linkedForbiddenLocationIds: string[]; // locations in shootingLocations that are forbidden
    ndaAgreementMeta?: UploadedFileMeta;
  };
  scheduleBooking: {
    recommendedWindowStart: string;
    recommendedWindowEnd: string;
    avoidWindowStart: string;
    avoidWindowEnd: string;
    onDutyTime: string; // e.g. "08:00"
    offDutyTime: string; // e.g. "17:30"
  };
  languagesRequired: string[];
}

export interface ContactAndEcommerce {
  ecommerceMatrix: Array<{
    id: string;
    platform: string; // Shopify, Alibaba, Made-in-China, etc.
    url: string;
    isFeatured: boolean;
  }>;
  contactsTeam: Array<{
    id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    whatsApp: string;
    weChat: string;
    role: string; // Primary Contact, Sales, Coordinator
  }>;
}

export interface FormDataState {
  enterprise: EnterpriseIdentity;
  credentials: ScalingAndCredentials;
  production: ProductionCapability;
  quality: QualityAndCompliance;
  market: MarketAndClient;
  shooting: ShootingPrep;
  contacts: ContactAndEcommerce;
}

export interface FormNodeConfig {
  id: string; // e.g., "node_1"
  nodeIndex: number; // e.g., 1
  stageName: string;
  stageIndex: number;
  title: string;
  type: string; // "text" | "upload" | ...
  isRequired: boolean;
  hint: string;
  validationRule?: string;
  optimizationRemark?: string;
}
