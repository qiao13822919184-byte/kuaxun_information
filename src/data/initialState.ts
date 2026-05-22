/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormDataState } from '../types';

export function getInitialState(): FormDataState {
  return {
    enterprise: {
      cnName: '',
      enName: '',
      brandEn: [''],
      logoHexSlogan: {
        colorHex: '#C8102E',
        sloganCn: '',
        sloganEn: '',
      },
      foundedYear: 2020,
      addressCascade: {
        country: '中国',
        province: '',
        city: '',
        district: '',
        detailCn: '',
        detailEn: '',
        isConsistent: true,
        registerAddress: '',
      },
    },
    credentials: {
      totalStaff: '51-200',
      rndStaffCount: 0,
      rndStaffRatio: 0,
      facilityArea: {
        area: 0,
        unit: '㎡',
        ownership: '自有',
        photos: [],
      },
      honors: [],
      certifications: [],
      factoryAudits: [],
    },
    production: {
      mainCategories: [],
      hsCodes: [],
      eCatalogs: [],
      featuredProducts: [],
      productionLines: [],
      newProductsYearly: 0,
      keyEquipments: [],
      supplyChainRatio: {
        model: 'full',
        rawMaterialsSource: '',
      },
      oemOdmCapacity: {
        enabled: false,
        types: [],
        duration: '16-30天',
        flowDescription: '',
        minOrderQty: 0,
      },
    },
    quality: {
      qcWorkflow: {
        steps: [],
        labPhotos: [],
        coreTestingItems: '',
      },
      moqThresholds: [],
      leadTime: {
        standardBatchDays: 15,
        customOrderDays: 30,
        seasonPeakRemark: '',
      },
      samplePolicy: {
        feePolicy: 'charged',
        freightPolicy: 'buyer',
        sampleFeeUsd: 0,
      },
      internalBusinessFlow: ['需求沟通', '设计深化', '排单生产', '成品检验', '物流交付', '售后跟踪'],
    },
    market: {
      marketMatrix: [],
      keywordsSet: {
        cnKeywords: [],
        enKeywords: [],
      },
      blacklistRegions: [],
      domesticCompetitors: [],
      foreignCompetitors: [],
      overseasCases: [],
      repurchaseReasons: {
        tags: [],
        quotes: [],
      },
      afterSalesSupport: {
        services: [],
        detailRemarks: {},
      },
      commonMisconceptions: [],
      targetBuyerPersona: {
        idealTypes: [],
        idealVolume: '',
        idealDecisionRoles: [],
        nonIdealPersona: '',
      },
    },
    shooting: {
      staffPrep: [],
      shootingLocations: [],
      highlightShots: {
        suggestions: '',
        selectedLocationIds: [],
        selectedMisconceptionsIds: [],
      },
      existingMediaArchive: [],
      ndaConfidential: {
        remark: '',
        linkedForbiddenLocationIds: [],
      },
      scheduleBooking: {
        recommendedWindowStart: '',
        recommendedWindowEnd: '',
        avoidWindowStart: '',
        avoidWindowEnd: '',
        onDutyTime: '08:00',
        offDutyTime: '17:30',
      },
      languagesRequired: ['English'],
    },
    contacts: {
      ecommerceMatrix: [],
      contactsTeam: [],
    },
  };
}

export function getDemoState(): FormDataState {
  return {
    enterprise: {
      cnName: '深圳市国迅制造有限公司',
      enName: 'Shenzhen Guoxun Manufacture Co., Ltd.',
      brandEn: ['GUOXUN', 'G-TECH'],
      logoHexSlogan: {
        colorHex: '#1E3A8A',
        sloganCn: '源自匠心 · 质造未来',
        sloganEn: 'Derived from Quality, Created for the Future.',
      },
      foundedYear: 2012,
      addressCascade: {
        country: '中国',
        province: '广东省',
        city: '深圳市',
        district: '龙华区',
        detailCn: '高新技术产业园XX大厦A栋5楼',
        detailEn: '5th Floor, Building A, XX Mansion, High-Tech Industrial Park, Longhua District, Shenzhen, China',
        isConsistent: true,
      },
    },
    credentials: {
      totalStaff: '51-200',
      rndStaffCount: 22,
      rndStaffRatio: 15,
      facilityArea: {
        area: 12000,
        unit: '㎡',
        ownership: '自有',
        photos: [
          { id: 'demo_facility_1', name: 'factory_aerial.jpg', size: 1245000, type: 'image/jpeg' }
        ],
      },
      honors: [
        { id: 'demo_honor_1', name: '国家高新技术企业', certYear: 2024, fileMeta: { id: 'demo_file_honor1', name: 'high_tech_cert.jpg', size: 489000, type: 'image/jpeg' } },
        { id: 'demo_honor_2', name: '专精特新中小企业', certYear: 2025, fileMeta: { id: 'demo_file_honor2', name: 'specialized_new_cert.pdf', size: 1024000, type: 'application/pdf' } }
      ],
      certifications: [
        { id: 'demo_cert_1', name: 'CE 认证', issuer: 'TÜV Rheinland', certNo: 'CE-2024-884912', expiryDate: '2028-12-31', fileMeta: { id: 'demo_file_cert1', name: 'ce_tuv_certificate.pdf', size: 2120000, type: 'application/pdf' } },
        { id: 'demo_cert_2', name: 'ISO9001 质量管理体系', issuer: 'SGS Group', certNo: 'ISO-CN24/900109', expiryDate: '2027-06-15', fileMeta: { id: 'demo_file_cert2', name: 'iso9001_sgs_cert.pdf', size: 1450000, type: 'application/pdf' } }
      ],
      factoryAudits: [
        { id: 'demo_audit_1', auditor: 'SGS', fileMeta: { id: 'demo_file_audit1', name: 'sgs_factory_audit_report.pdf', size: 4500000, type: 'application/pdf' } },
        { id: 'demo_audit_2', auditor: '沃尔玛 Walmart', fileMeta: { id: 'demo_file_audit2', name: 'walmart_es_audit.pdf', size: 3800000, type: 'application/pdf' } }
      ],
    },
    production: {
      mainCategories: ['电子元器件与材料', '智能消费电子组件', '精密机电零部件'],
      hsCodes: [
        { id: 'demo_hs_1', code: '8529909090', prodNameCn: '高精密智能传感器主板模块', isFeatured: true },
        { id: 'demo_hs_2', code: '8543709990', prodNameCn: '无线高频可靠性信号校准模组', isFeatured: false }
      ],
      eCatalogs: [
        { id: 'demo_catalog_1', name: 'guoxun_product_catalog_2026.pdf', size: 18500000, type: 'application/pdf' }
      ],
      featuredProducts: [
        {
          id: 'demo_prod_1',
          nameCn: '超薄高灵敏度智能传感校准模组',
          nameEn: 'Ultra-thin Precision Intelligent Calibration Module',
          model: 'GX-SENS-PT08',
          params: '感知极限：0.08ms级响应, 信号增益：10dB - 45dB, 适用温度范围：-40℃ - 125℃',
          priceMin: 1200,
          priceMax: 1450,
          unit: '套',
          targetMarket: '北美/欧洲/东南亚',
          whiteBgPhoto: { id: 'demo_prod1_white', name: 'sens_whitebg.jpg', size: 450000, type: 'image/jpeg' },
          scenePhoto: { id: 'demo_prod1_scene', name: 'sens_workshop.jpg', size: 1200000, type: 'image/jpeg' }
        },
        {
          id: 'demo_prod_2',
          nameCn: '双频段抗干扰可靠性射频收发主板',
          nameEn: 'Premium Dual-Band High-Reliability RF Board',
          model: 'GX-RF32-TECH',
          params: '集成双波段, 高密度表面贴装工艺, 极低电磁干扰泄露, 尺寸32mmx32mm, 沉金表面处理',
          priceMin: 12.5,
          priceMax: 15.8,
          unit: 'pcs',
          targetMarket: '北美',
          whiteBgPhoto: { id: 'demo_prod2_white', name: 'rfboard_whitebg.jpg', size: 380000, type: 'image/jpeg' },
          scenePhoto: { id: 'demo_prod2_scene', name: 'rfboard_testing.jpg', size: 980000, type: 'image/jpeg' }
        },
        {
          id: 'demo_prod_3',
          nameCn: '轻量化高性能高纯度合金外壳组件',
          nameEn: 'Premium Lightweight High-Purity Alloy Case Set',
          model: 'GX-CASE-GOLD',
          params: '24小时防护级, 钛金阳极氧化处理, 1.2M跌落防震, 通过80小时重度盐雾测试不侵蚀',
          priceMin: 4.5,
          priceMax: 6.2,
          unit: '套',
          targetMarket: '中东/欧洲',
          whiteBgPhoto: { id: 'demo_prod3_white', name: 'case_gold_whitebg.jpg', size: 290000, type: 'image/jpeg' },
          scenePhoto: { id: 'demo_prod3_scene', name: 'case_assembly.jpg', size: 850000, type: 'image/jpeg' }
        }
      ],
      productionLines: [
        { id: 'demo_line_1', name: '高精密自动SMT表面贴片生产线', qty: 2, isExclusive: true },
        { id: 'demo_line_2', name: '无尘恒温恒湿抗静电高规格精密组装线', qty: 3, isExclusive: true },
        { id: 'demo_line_3', name: '柔性智造数控切割与精密机加工线', qty: 6, isExclusive: false }
      ],
      newProductsYearly: 12,
      keyEquipments: [
        { id: 'demo_equip_1', name: '全进口高速高精度数控多轴精密加工中心', fileMeta: { id: 'demo_file_equip1', name: 'cnc_slitter.jpg', size: 1800000, type: 'image/jpeg' }, isVideo: false, advantage: '加工公差控制在±0.005mm以内，表面高光无死角，不损伤极薄组件边缘。', isFirstInClass: 'domestic' },
        { id: 'demo_equip_2', name: '全自动三维实时X光透视精审与检测系统', fileMeta: { id: 'demo_file_equip2', name: '3d_xray_machine.jpg', size: 2400000, type: 'image/jpeg' }, isVideo: false, advantage: '缺陷自适应深度识别，全自动实时检测，板差率与良率自适应校正补偿。', isFirstInClass: 'global' }
      ],
      supplyChainRatio: {
        model: 'core',
        rawMaterialsSource: '本司产品生产制造所需高品质核心坯材及基础元组件，70% 采购自行业头部知名原料厂商，来源精准可追溯，且经过我厂自主深加工和闭环精细化质量检测，综合品质极强且稳定性优异。',
      },
      oemOdmCapacity: {
        enabled: true,
        types: ['OEM', 'ODM'],
        duration: '16-30天',
        flowDescription: '1. 客户提供设计图纸或样品物理规格 -> 2. 研发部进行结构深化并输出3D电路/结构模型 -> 3. CNC打样中心快速试制手板 -> 4. 可靠性实验室开展测试（力学、温湿、跌落检测等） -> 5. 客户在线签收样品 -> 6. 开启模包量产。',
        minOrderQty: 500,
      },
    },
    quality: {
      qcWorkflow: {
        steps: ['IQC 进料检测', 'IPQC 过程检验', 'FQC 成品终检', 'OQC 出货监测', '可靠性测试'],
        labPhotos: [
          { id: 'demo_qc_1', name: 'spectrograph_analyzer.jpg', size: 940000, type: 'image/jpeg' },
          { id: 'demo_qc_2', name: 'salt_spray_spray_tester.jpg', size: 1100000, type: 'image/jpeg' }
        ],
        coreTestingItems: '精密微量化学元器件理化含量复核；精细表面莫氏硬度计测试；落体力学抗震度及电路抗疲劳拉伸延伸极限检测；72小时长效高频高温湿热耐腐蚀特性评级。',
      },
      moqThresholds: [
        { id: 'demo_moq_1', category: '精密智能校准电控板', moqQty: 5, unit: '卷', remark: '定制规格起订量，标准规格起订门槛可面议。' },
        { id: 'demo_moq_2', category: '轻量合金精合外壳', moqQty: 1000, unit: 'pcs', remark: '支持首单定制精品包装，白盒或者默认工业包装减半。' }
      ],
      leadTime: {
        standardBatchDays: 20,
        customOrderDays: 35,
        seasonPeakRemark: '每年的第四季度（十一月至次年一月）受出口出货船运档发及产能集中影响，所有排单周期需视产能自动增加 5-10 天。',
      },
      samplePolicy: {
        feePolicy: 'offset',
        freightPolicy: 'buyer',
        sampleFeeUsd: 100,
      },
      internalBusinessFlow: ['需求沟通', '设计深化', '排单生产', '成品检验', '物流交付', '售后跟踪'],
    },
    market: {
      marketMatrix: [
        { id: 'demo_m_1', marketRegion: '北美', featuredProduct: 'GX-RF32-TECH 射频主板组件', reason: '产品已经完成了全部国际级材质环保及安全合规体系注册认证，高度符合核心采购总装配需要。' },
        { id: 'demo_m_2', marketRegion: '欧洲', featuredProduct: 'GX-SENS-PT08 精密传感器模组', reason: '海外高精尖工业设备加工商对组件的响应微秒极限以及抗热变形有极度苛刻之严要求，我司标准处于行业领先层。' }
      ],
      keywordsSet: {
        cnKeywords: ['电子传感器集成板', '射频模块组件', '合金结构精密件', '自动化主板代加工', '精密贴片生产', '多轴CNC精铣加工'],
        enKeywords: ['electronic sensor module', 'RF wireless mainboard', 'alloy structural casing', 'OEM electronics factory', 'precise SMT assembly', 'multiaxis CNC machining', 'assembly custom parts', 'TUV certified components', 'IP67 rated device casing', 'premium controller board', 'industrial electronics suppliers', 'Shenzhen tech manufacturer'],
      },
      blacklistRegions: [
        { id: 'demo_bl_1', country: '特定制裁国', reasonType: '合规/合规冲突', remark: '受国际多边出口合规及合规白名单制约，资金回笼与国际货款付收可能会产生延迟退件风险。' }
      ],
      domesticCompetitors: [
        { id: 'demo_dc_1', name: 'XX同行科技有限公司', brand: 'COMP-A', website: 'https://www.example-competitor.com', socialLinks: { 'Facebook': 'https://facebook.com/competitor' } }
      ],
      foreignCompetitors: [
        { id: 'demo_fc_1', name: 'POSCO Stainless Co.', country: '韩国', website: 'https://www.posco.co.kr', socialLinks: { 'LinkedIn': 'https://linkedin.com/posco' } }
      ],
      overseasCases: [
        { id: 'demo_case_1', country: '美国', clientType: 'Brand', yearsPartnered: 6, scenario: '为海外一流科技品牌全权代工制造其核心通信物理控制模组，多项环境稳定性检验满分，总产销量突破 15 万件。', isAuthorized: true, photoMeta: { id: 'demo_case_pic', name: 'tchef_exhibition.jpg', size: 1450000, type: 'image/jpeg' } }
      ],
      repurchaseReasons: {
        tags: ['性能稳定性优异', '交付与配合效率极高', '自研技术工艺壁垒保障可靠'],
        quotes: [
          {
            id: 'demo_q_1',
            rawQuotesCn: '“他们的配合与交付从来没有让我们失望过，模块的各项检测精度极其完美，完全省去了我们二次重检的程序。”',
            quotesEn: '"Guoxun has consistently outdone themselves in on-time delivery and accuracy. The premium precision lets us confidently sidestep redundant QA, streamlining our pipelines."',
            clientCountry: '德国',
            signatureAllowed: true,
            screenshotMeta: { id: 'demo_q_screenshot', name: 'whatsapp_german_praise.png', size: 680000, type: 'image/png' }
          }
        ],
      },
      afterSalesSupport: {
        services: ['3年质保（需追加填报期数，如3年）', '提供1V1全天候双语远程客服支持', '无偿调配损耗件与备品备件'],
        detailRemarks: {
          '3年质保（需追加填报期数，如3年）': '凡出厂核心物理元部件以及经我司总装的产品，在正常及非外力物理损坏下享有 3 年免费极速退换换新担保。',
          '提供1V1全天候双语远程客服支持': '配置有具有海外技术支持经验的专职英文工程师和外贸项目跟单，1小时内响应退桩排雷技术故障并出具技术解决方案。'
        },
      },
      commonMisconceptions: [
        { id: 'demo_mis_1', misconception: '买家常存在评估误区，固执地认为产品的防护性或耐磨稳定性单纯只由外部结构材质厚度决定。', clarification: '实际上，内部半导体极精电学平衡控制、经过纳米级表面阳极极性转化与钝化覆涂，方是实现长久稳定防护力、抗老化以及阻断外界射频电磁干扰的最核心科学秘密。' }
      ],
      targetBuyerPersona: {
        idealTypes: ['Brand', 'Trader'],
        idealVolume: '首单试制采购在 $15,000 美元 - $50,000 美元，后期量产及稳定量合作在月均 2-4 箱高柜工业重案。',
        idealDecisionRoles: ['采购总监 (Procurement Director)', '研发技术总经理 (R&D Leader)'],
        nonIdealPersona: '散装、单次拿货低至 50pcs 以下的零配件零售或代发买家；或者不具备完整海外买手清关与税费担保信用的观望小盘商。',
      },
    },
    shooting: {
      staffPrep: [
        { id: 'demo_s_1', name: '林树深 (Dr. Lin)', position: '董事长暨联合创始人', isFounder: true, englishFluent: '提词器演讲', wearStyle: '高级西服三件套', shootingConsent: '强意愿' },
        { id: 'demo_s_2', name: '陈晓燕 (Sherry Chen)', position: '高级外贸运营总监', isFounder: false, englishFluent: '纯英文脱稿', wearStyle: '标准工作礼服', shootingConsent: '强意愿' }
      ],
      shootingLocations: [
        { id: 'demo_loc_1', name: '自动SMT精细表面贴片车间', photos: [{ id: 'demo_loc_pic1', name: 'rolling_room_spot.jpg', size: 1300000, type: 'image/jpeg' }], linkedFlowStep: '排单生产', isAerialReachable: false },
        { id: 'demo_loc_2', name: '全息激光与理化测试实验室中心', photos: [{ id: 'demo_loc_pic2', name: 'mill_gorgeous_view.jpg', size: 1650000, type: 'image/jpeg' }], linkedFlowStep: '成品检验', isAerialReachable: true }
      ],
      highlightShots: {
        suggestions: '在自动SMT控制中心，用宏观浅景深镜头捕捉全自动探针高速移载、贴片的流畅特写。结合高质感的环境冷色灯效与自研LOGO品牌射光，显示高端智造的极致高速与精微精密。',
        selectedLocationIds: ['demo_loc_1'],
        selectedMisconceptionsIds: ['demo_mis_1'],
      },
      existingMediaArchive: [
        { id: 'demo_ma_1', type: '企业历史展会掠影', qty: 45, cloudUrl: 'https://pan.baidu.com/s/1demo-exhi-brand-990812', pwdCode: 'xb26', authorizedUsage: ['Facebook', 'Youtube', '官网'] }
      ],
      ndaConfidential: {
        remark: '工厂特种定制精密无尘元器件真空封包线、涉及特定海外大厂保密授权专有板型加工等特准机密功能工位禁止对外、特写拍摄。',
        linkedForbiddenLocationIds: [],
      },
      scheduleBooking: {
        recommendedWindowStart: '2026-06-10',
        recommendedWindowEnd: '2026-06-18',
        avoidWindowStart: '2026-07-01',
        avoidWindowEnd: '2026-07-10',
        onDutyTime: '08:00',
        offDutyTime: '17:30',
      },
      languagesRequired: ['English', 'Spanish', 'French'],
    },
    contacts: {
      ecommerceMatrix: [
        { id: 'demo_e_1', platform: 'Alibaba国际旺铺', url: 'https://guoxun.en.alibaba.com', isFeatured: true },
        { id: 'demo_e_2', platform: '官方旗舰独立商城', url: 'https://www.guoxun-tech.com', isFeatured: true }
      ],
      contactsTeam: [
        { id: 'demo_team_1', name: '陈晓燕', position: '外贸部运营总监', email: 'sherry@guoxun-tech.com', phone: '+86 138 2291 9184', whatsApp: '+8613822919184', weChat: 'sherry_gxtech', role: '项目主对接' },
        { id: 'demo_team_2', name: '林树深', position: '董事长', email: 'ceo@guoxun-tech.com', phone: '+86 139 0011 2233', whatsApp: '', weChat: 'ceo_guoxun', role: '现场安全及拍摄协助负责人' }
      ],
    },
  };
}
