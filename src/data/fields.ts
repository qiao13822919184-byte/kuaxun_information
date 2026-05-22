/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormNodeConfig } from '../types';

export const FORM_NODES: FormNodeConfig[] = [
  // Stage 1: 企业身份识别 (Enterprise Identity)
  {
    id: 'cnName',
    nodeIndex: 1,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '公司中文名称',
    type: 'text',
    isRequired: true,
    hint: '企业中文全称（须与营业执照完全一致）',
    validationRule: '2-50字符；名称建议包含“公司”、“厂”或“集团”等行业特质关键词',
    optimizationRemark: '拆分自原节点【公司中/英文名称及品牌】'
  },
  {
    id: 'enName',
    nodeIndex: 2,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '公司英文名称',
    type: 'text',
    isRequired: true,
    hint: 'Guangdong Chuangrui Stainless Steel Co., Ltd.',
    validationRule: '须由英文/数字/半角符号组成，长2-80字符',
    optimizationRemark: '拆分自原节点【公司中/英文名称及品牌】'
  },
  {
    id: 'brandEn',
    nodeIndex: 3,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '品牌名称（英文）',
    type: 'brands',
    isRequired: true,
    hint: '例如：CHUANGRUI / T-CHEF。如有多个副品牌可以动态“+添加”进行填报',
    validationRule: '仅限英文、数字，单个品牌长度不超过30字符',
    optimizationRemark: '拆分自原节点【公司中/英文名称及品牌】'
  },
  {
    id: 'logoHexSlogan',
    nodeIndex: 4,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '品牌视觉资产',
    type: 'brand_assets',
    isRequired: true,
    hint: '包含：① 上传Logo源文件（矢量AI/SVG/透明PNG）；② 滴管选择品牌主色 HEX 码（例如 #C8102E）；③ 填写品牌核心口号（Slogan中英文对照）',
    validationRule: '文件≤10MB；HEX格式校验；Slogan必须填写中英双语',
    optimizationRemark: '新增——视频宣导片/字幕条/片头片尾核心品牌素材'
  },
  {
    id: 'foundedYear',
    nodeIndex: 5,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '工厂成立年份',
    type: 'year',
    isRequired: true,
    hint: '工厂/企业实际设立开始日期，例如：1999',
    validationRule: '整数，限制在范围 1900-2026',
    optimizationRemark: '保留——输入控件由常规文本框升级为年份时间选择器'
  },
  {
    id: 'businessLicenseMeta',
    nodeIndex: 6,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '营业执照上传',
    type: 'file',
    isRequired: true,
    hint: '请上传最新的彩色营业执照副本扫描件或清晰全景拍照（限 pdf / jpg / png）',
    validationRule: '文件限制 ≤10MB',
    optimizationRemark: '新增——企业金品立项合规核验必备前置材料'
  },
  {
    id: 'addressCascade',
    nodeIndex: 8,
    stageName: '阶段一：企业身份识别',
    stageIndex: 1,
    title: '公司及工厂地址',
    type: 'address_cascade',
    isRequired: true,
    hint: '包含：① 级联选择器（国-省-市-区）；② 中英文双语填写详细门牌地址；③ 单选注册地址与实际生产地是否一致（不一致须追加填写）',
    validationRule: '详细地址中文≤100字符，英文≤200字符',
    optimizationRemark: '保留——增加“注册地/生产地是否一致”逻辑判别'
  },

  // Stage 2: 规模与资质实力 (Scaling & Credentials)
  {
    id: 'totalStaff',
    nodeIndex: 9,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '员工总人数',
    type: 'dropdown',
    isRequired: true,
    hint: '按企业当前在册全职职工总人数填报，包含行政、技术与一线工人',
    validationRule: '枚举选项：1-50人 / 51-200人 / 201-500人 / 501-1000人 / 1000人以上',
    optimizationRemark: '拆分自原节点【企业规模】'
  },
  {
    id: 'rndStaff',
    nodeIndex: 10,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '研发团队人数及占比',
    type: 'rnd_slider',
    isRequired: true,
    hint: '填写专门从事新产品研发/打样/模具设计/工艺优化的技术人员数与百分比占比',
    validationRule: '研发人数为≥0的整数；技术人员占比在0%-100%之间（输入框与滑块具有计算联动）',
    optimizationRemark: '拆分自原节点【企业规模】'
  },
  {
    id: 'facilityArea',
    nodeIndex: 11,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '厂房面积与产权情况',
    type: 'facility_area',
    isRequired: true,
    hint: '包含：① 数值输入；② 单位选项（㎡/亩）；③ 产权形式单选（自有/租赁）；④ 上传厂房航拍中外景门面照（限 jpg / png）',
    validationRule: '面积数值必须正数；上传图片大小限制在 ≤20MB 范围内',
    optimizationRemark: '新增图片上传——支持宣导大片中厂房航拍/外景特写镜头实证'
  },
  {
    id: 'honors',
    nodeIndex: 12,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '政府认定与行业荣誉',
    type: 'honors_group',
    isRequired: false,
    hint: '如：国家高新技术企业 / 专精特新 / 科技型中小企业 / 省级名牌等证书（可增减列表）',
    validationRule: '支持自定义增加，单张荣誉证书扫描件（PDF/JPG）大小限 ≤10MB',
    optimizationRemark: '保留——引入高阶荣誉标签绑定，强制关联证书扫描件，规避空口无凭'
  },
  {
    id: 'certifications',
    nodeIndex: 13,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '企业资质与产品认证证书',
    type: 'certs_grid',
    isRequired: true,
    hint: '精选国际主流资质：CE, RoHS, ISO9001, ISO14001, FDA, BSCI等，需填报：证书名、发证机构、证书编号、截止有效日期及上传证书PDF文件',
    validationRule: '所选择有效截至日期不得早于当前日期；上传文件限制 PDF 且 ≤10MB',
    optimizationRemark: '保留并深度增强——补全金品报告中发证机构、证书号、有效期三要素校验'
  },
  {
    id: 'factoryAudits',
    nodeIndex: 14,
    stageName: '阶段二：规模与资质实力',
    stageIndex: 2,
    title: '大厂/第三方验厂授权',
    type: 'audits_group',
    isRequired: false,
    hint: '如通过 SGS, BV, SMETA, 沃尔玛, 迪士尼, 亚马逊, Costco, 宜家等专业验厂审计。如无，该题可跳过留空。',
    validationRule: '上传验厂评估报告或正式授权书文件（支持 PDF，文件限制 ≤20MB）',
    optimizationRemark: '保留控件，并在此基础上进行了自定义大厂字段的增加扩展'
  },

  // Stage 3: 生产能力画像 (Production Capability)
  {
    id: 'mainCategories',
    nodeIndex: 15,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '主营产品类目',
    type: 'category_tree',
    isRequired: true,
    hint: '请在级联产品树中多选勾选阿里平台主营的三级行业类目（如：电子电工 > 传感器 > 智能电控模块）',
    validationRule: '至少选择 1 项最底端的三级主推产品分类',
    optimizationRemark: '拆分自原节点【主营产品类目及HS编码】'
  },
  {
    id: 'hsCodes',
    nodeIndex: 16,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '海关HS编码',
    type: 'hs_codes_group',
    isRequired: true,
    hint: '动态多行添加表单。输入标准HS编码、对应产品中文名、并勾选设定当前是否为主推爆款产品。',
    validationRule: 'HS编码须为 6位、8位 或 10位 纯数字（如 7219340000），可添加多行',
    optimizationRemark: '拆分自原节点并提供编码查重与数字长度校验，用于协助对目标市场定向投放'
  },
  {
    id: 'eCatalogs',
    nodeIndex: 17,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '产品电子图册 (Catalog)',
    type: 'catalogs_drag',
    isRequired: true,
    hint: '请将中/英文版完整产品目录/画册电子版拖入本区域上传（格式仅限 PDF）',
    validationRule: '支持多文件拖拽上传，单个 PDF 文件限制 ≤50MB',
    optimizationRemark: '保留，强化大文件上传缓存提示'
  },
  {
    id: 'featuredProducts',
    nodeIndex: 18,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '核心爆款/主推产品（3-5款）',
    type: 'featured_products_cards',
    isRequired: true,
    hint: '填报核心爆款信息：产品中英文名、规格型号、优势短描述、美元批发价区间（最低-最高）、产品底白图与场景渲染大图、销售主推市场。',
    validationRule: '主推产品数量不少于 3 款且不超过 5 款；每款产品必传底白图，价格区间合法',
    optimizationRemark: '保留重点突出品类，并增加销售主推国家市场多选联动，用于文案策略匹配'
  },
  {
    id: 'productionLines',
    nodeIndex: 19,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '生产线分类与数量',
    type: 'prod_lines_dynamic',
    isRequired: true,
    hint: '动态报表填报：如“精密切割线 x 3条”、“全自动机器人焊接线 x 5条”，可标注该产线是否为本厂专有产线（开关）',
    validationRule: '必须申报至少1条产线配置，数量为大于等于1的整数值',
    optimizationRemark: '拆分自原节点【生产线规模与开模能力】'
  },
  {
    id: 'newProductsYearly',
    nodeIndex: 20,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '每年研发新款数量',
    type: 'integer_step',
    isRequired: false,
    hint: '平均每年向上新开发的独具开模、结构改良的新品数量（纯客定制行业无上新可填0或不填）',
    validationRule: '非负整数，支持数字微调器',
    optimizationRemark: '拆分自原节点【生产线规模与开模能力】，对专有定制或纯研发型企业进行个性关怀'
  },
  {
    id: 'keyEquipments',
    nodeIndex: 21,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '核心专有设备与工艺',
    type: 'equipments_group',
    isRequired: true,
    hint: '介绍企业重型自置核心设备。须填写：设备英文/中文名称、长/宽/高及核心技术规格、上传设备现场照片或10秒运转短视频、一句话竞争优势、首创判定。',
    validationRule: '最大申报 10 项；单幅图片≤20MB；高画质视频≤200MB；优势文本上限80字',
    optimizationRemark: '保留升级——作为大厂金品报告及出街视频重点展示核心硬核资产（Hard Power）来源'
  },
  {
    id: 'supplyChainRatio',
    nodeIndex: 22,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '供应链自主率',
    type: 'supply_chain_radio',
    isRequired: true,
    hint: '① 单选（全产业链自产 / 核心重要工序自产 / 纯组装贴牌加工）；② 多行文本详细披露主要原材料来源基地和对外采购比重（如特钢购入自太钢，占总成本28%）',
    validationRule: '原材料来源及采购比例说明文本不得少于30字符，上限300字符',
    optimizationRemark: '保留，强化自制工序的透明度审核'
  },
  {
    id: 'oemOdmCapacity',
    nodeIndex: 23,
    stageName: '阶段三：生产能力画像',
    stageIndex: 3,
    title: '定制服务能力（OEM/ODM）',
    type: 'oem_odm_toggle',
    isRequired: true,
    hint: '打开开关后，勾选支持定制模式（OEM/ODM/JDM）、设计制版打样周期（如≤7天/8-15天/16-30天/30天以上）、多行阐述打样定制流程（打样确认签名到量产）、最低起订量。',
    validationRule: '开关开启时为必填，并且至少勾选一种定制承接类型。',
    optimizationRemark: '保留并追加开发打样到大货首样起订量门槛（MOQ）联动限制，规避无效定制咨询'
  },

  // Stage 4: 品質与合规体系 (Quality & Compliance)
  {
    id: 'qcWorkflow',
    nodeIndex: 24,
    stageName: '阶段四：品质与合规体系',
    stageIndex: 4,
    title: '质量管控体系 (QC流程)',
    type: 'qc_workflow_flow',
    isRequired: true,
    hint: '① 勾选覆盖的QC流转段落：[IQC 进料检测]、[IPQC 过程检验]、[FQC 成品终检]、[OQC 出厂监测]、[可靠性性老化测试]；② 上传实验室内装及精密检测检测仪器实景图片；③ 文本陈述核心质检控制指标（如拉力、盐雾时长、硬度等）',
    validationRule: '检验流转步骤至少勾选 1 项；实验照最少1张、最多5张，单图 ≤20MB',
    optimizationRemark: '保留，深化原节点结构并增加“核心检测项目”重点陈述板'
  },
  {
    id: 'moqThresholds',
    nodeIndex: 25,
    stageName: '阶段四：品质与合规体系',
    stageIndex: 4,
    title: '主要产品起订量门槛（MOQ）',
    type: 'moqs_dynamic',
    isRequired: true,
    hint: '按产品类别细化基础起订门槛，如：“智能传感器模块-起订100套（备注：规格不限）”。支持动态增改。',
    validationRule: '起订数量必须为大于等于0的正数值，计量单位下拉，整条记录非空',
    optimizationRemark: '保留并重构，细化多条产品类的精细MOQ指标'
  },
  {
    id: 'leadTime',
    nodeIndex: 26,
    stageName: '阶段四：品质与合规体系',
    stageIndex: 4,
    title: '交货周期（Lead Time）',
    type: 'lead_time_inputs',
    isRequired: true,
    hint: '必须填报：① 标品批量订单平均交期天数；② 定制化设计大单平均交期天数；③ 多行文本输入（行业旺季、机器大修等特殊情况备用声明）',
    validationRule: '交期必须填报正整数天数，标品交期原则上不应长于定制交期',
    optimizationRemark: '保留——并对大卖家增设了旺季缓冲声明文本保障'
  },
  {
    id: 'samplePolicy',
    nodeIndex: 27,
    stageName: '阶段四：品质与合规体系',
    stageIndex: 4,
    title: '样品政策声明',
    type: 'sample_policy_radios',
    isRequired: true,
    hint: '宣誓两项基本政策：① 样品收费政策（完全免费发样 / 适当低价收样品费 / 样品费可在正式大单中无缝抵扣）；② 样品快递费承担（买方全包邮费 / 卖方提供运费支持 / 仅支持快递到付）；③ 典型单样打样费参考估值（美金）',
    validationRule: '打样费用必须不小于0的正数数值',
    optimizationRemark: '保留，规范阿里旺铺买家样品索要纠纷声明条款'
  },
  {
    id: 'internalBusinessFlow',
    nodeIndex: 28,
    stageName: '阶段四：品质与合规体系',
    stageIndex: 4,
    title: '企业内部业务流转排序',
    type: 'drag_flow_sort',
    isRequired: true,
    hint: '通过垂直或者水平拖动，重新组合符合你厂真实的生产订单流转周期：[默认：用户需求沟通 → 技术部设计深化 → 车间排单生产 → 质检部成品检验 → 交付出物流装港 → 售后一站式跟踪]（可自由增删改名）',
    validationRule: '业务推进流转节点至少配置 3 个实体过程',
    optimizationRemark: '保留——深度改造，当前配置的名称和步骤将直接作为后续【阶段六：拍摄取景区域控制】的基础联动项'
  },

  // Stage 5: 市场与客户背景 (Market & Client Background)
  {
    id: 'marketMatrix',
    nodeIndex: 29,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '主推市场与产品线精准匹配',
    type: 'market_product_matrix',
    isRequired: true,
    hint: '定制一份市场突围方向：可选择主推的地区（如北美/欧洲/东南亚/中东/南美/非洲/独联体等），指定该国家主营的主力产品型号，并简要填写突击该市场的原因（例如“已取得FDA认证”、“产品已完成ETL美标转换”）',
    validationRule: '请确保至少精准匹配并定义 1 条 市场-明星产品 对照，原因文本非空',
    optimizationRemark: '保留升级——直接关联阿里立项报告中市场营销的核心佐证'
  },
  {
    id: 'keywordsSet',
    nodeIndex: 30,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '出口行业多双语关键词清单',
    type: 'bilingual_tags',
    isRequired: true,
    hint: '请手动回车或者使用逗号作为隔断输入：主要外贸推广词（如 stainless steel coil, cold rolled, mill finish）。系统提供中文推荐关键词和英文映射清单。',
    validationRule: '强制限制：英文外贸推广关键词必须录入不低于 10 个独立标签，方便后续做SEO文案',
    optimizationRemark: '保留——增设双语多语段关键词拆包分类'
  },
  {
    id: 'blacklistRegions',
    nodeIndex: 31,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '不接单禁售黑名单地区',
    type: 'blacklist_countries',
    isRequired: false,
    hint: '鉴于物流断链、国际出口资质、合规制裁或高坏账风险。可搜索添加该国家/地区（可多选）、指定屏蔽原因（地缘政治/无特定认证/合规冲突/坏账高危/物流受阻等）、并附加详细情况补充。',
    validationRule: '如添加了特定国家，则该国对应拒收原因必选',
    optimizationRemark: '保留'
  },
  {
    id: 'domesticCompetitors',
    nodeIndex: 32,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '国内同行业对标竞争对手',
    type: 'domestic_comps',
    isRequired: false,
    hint: '录入当前国内对标的追赶同行（最多申报 5 间）：录入竞品中文全名、其主打品牌/王牌系列、官网直达连接、多渠道海外社媒账号URL（包含 Facebook, Instagram, LinkedIn, Youtube 等）',
    validationRule: '录入的相关主页链接必须符合规范的完整 URL 格式（含 http:// 或 https://）',
    optimizationRemark: '保留——进行更为清晰的表单结构化拆分，以精细追踪竞品优势'
  },
  {
    id: 'foreignCompetitors',
    nodeIndex: 33,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '国外同行业对标竞争对手',
    type: 'foreign_comps',
    isRequired: false,
    hint: '录入当前国外对标的竞争公司（最多5家）：录入竞品公司全称、所在国家与地区、其官方网直达连接、海外各大社媒链接名。便于分析团队执行海外对标分析。',
    validationRule: '官网URL及相关社媒链接必须符合符合严谨的 URL 互联网传输语法格式',
    optimizationRemark: '保留并深度提炼'
  },
  {
    id: 'overseasCases',
    nodeIndex: 34,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '海外客户真实落地案例',
    type: 'overseas_case_cards',
    isRequired: false,
    hint: '动态案例卡片（最大扩充申报 5 个）：包含目标客户所在国别、采购客户类型（专业进口贸易分销商/知名连锁终端品牌商/生产型加工组装工厂等）、双方合作存续年限、典型订单交付场景（比如：该国大型市政地下管廊钢板供应）、是否授权允许披露LOGO商标及上传真实的工程项目现场合拢、或实物特写图片。',
    validationRule: '单张现场大图图片大小限制在 ≤20MB 以内，非许可授权时不得空项',
    optimizationRemark: '新增——该项目作为阿里国际站旺铺主页“客户见证与案例”版板块引流信任感最强的背书素材源'
  },
  {
    id: 'repurchaseReasons',
    nodeIndex: 35,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '客户忠诚度与复购证言',
    type: 'quotes_evidence',
    isRequired: true,
    hint: '金牌买家为何持续给你下单：① 勾选忠诚度底层推力（[性能极度稳定]、[准时交付极高]、[极具性价比竞争]、[2小时超快客服响应]、[独家发明工艺壁垒]）；② 真实海外买家口语原话自叙、对应精准英文口语化翻译、买家所属国家、是否授权允许使用真实拼写。请附上一张买家在 WhatsApp / 阿里旺旺 / 电子邮件中给与五星表扬、付款截图的实证屏幕截图（上传前需将买家敏感隐私打码处理）。',
    validationRule: '至申报 1 组完整、附带打码截图的客户表扬自叙内容，原画字数不得少于10字符',
    optimizationRemark: '保留并强力拓展：不仅丰富打码实证图上传模块，也增加了可否署名字段的绑定'
  },
  {
    id: 'afterSalesSupport',
    nodeIndex: 36,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '售后保障服务承诺',
    type: 'aftersales_tags',
    isRequired: true,
    hint: '多选勾选承诺：[X年质保（需追加填报期数，如3年）]、[无偿调配损耗件与备品备件]、[提供1V1全天候双语远程客服支持]、[海外仓极速缺陷换新服务]、[专业工程师上门安装指导]、[高清全英文安装教学视频支撑等]，并展开对每项承诺的具体服务边界详尽填报。',
    validationRule: '质保年份必须为大于0的正整数，承诺项必须至少勾选 1 项',
    optimizationRemark: '保留并升级'
  },
  {
    id: 'commonMisconceptions',
    nodeIndex: 37,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '常见买家认知误解与专业排雷澄清',
    type: 'q_and_a_combos',
    isRequired: true,
    hint: '行业黑幕与常见坑位引导：客户惯性思维以为...（写出买家的采购误区），实际上我厂...（提供专业工艺技术反驳澄清）。如：买家以为核心元器件厚度越厚越好，实际上稳定性更多取决于精密电学平衡控制、经过纳米级表面钝化覆涂，方是长久防护的核心。',
    validationRule: '最少填写 1 组对照，最多填写 5 组，澄清文本非空（用于文案制作“干货视频脚本”的剧本核心冲突剧情来源）',
    optimizationRemark: '保留，强化作为剧本逻辑中“反转重塑”等高潮段落的剧本支撑'
  },
  {
    id: 'targetBuyerPersona',
    nodeIndex: 38,
    stageName: '阶段五：市场与客户背景',
    stageIndex: 5,
    title: '目标买家画像与负向拒接红线',
    type: 'buyer_persona_comb',
    isRequired: true,
    hint: '① 描绘画像：买家身份多选（批发商/品牌进口商/连锁超市/建筑工程工程商等）、其合理期望首笔预算和起单采购量级、团队决策者在海外所扮演的主要部门职位角色；② 黑名单倒排（负向排雷）：用一小段话刻画出你们绝对拒接、或者合作成本高、风险高而不希望触及的买家轮廓（如“无法自付运费的零售单、需要提供多项非法产地证明的试探盘”）。',
    validationRule: '负向排雷描写字数要求不低于 20 个汉字，以免模糊不清',
    optimizationRemark: '保留——高标准的专业结构化切分，精准定盘核心利润客户群'
  },

  // Stage 6: 拍摄执行筹备 (Shooting Execution Preparation)
  {
    id: 'staffPrep',
    nodeIndex: 39,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '上镜与出镜人员筹备',
    type: 'staff_prep_group',
    isRequired: true,
    hint: '策划宣导视频上镜的人选（最多申报 8 人）：姓名、部门及具体在厂头衔、勾选该员是否是本厂老板/董事长/最高创始人、英文脱口演讲沟通能力考量（纯英文脱稿/对照提词器演讲/拒绝英文仅中文）、预期拍摄日穿戴何种服饰（高级西服三件套/现代标准工作服/休闲便衣）、出镜意愿（强意愿/愿意配合出镜/出于保密拒绝登场）。',
    validationRule: '强力约束：至少申报 1 位 意愿度不是“拒绝登场”的人选充当信任背书大柱',
    optimizationRemark: '保留并深度增强——增设英文实力、衣着考量与创始人头衔锚定'
  },
  {
    id: 'shootingLocations',
    nodeIndex: 40,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '厂区可拍摄场景与画面登记',
    type: 'locations_group',
    isRequired: true,
    hint: '厂区可拍镜头踩点：自定义区域名（如冷轧车间、高精研发实验区、接待展厅大板房等）、上传 1-3 张用手机拍下该区域现状供摄制导演提前参考、关联前边 node 28 【企业内部业务流转流程】中具体负责的工序流（如“车间排单生产”）、标识该区上方是否空旷并支持厂房外景航拍无人机起飞。',
    validationRule: '至少踩点报备 3 个不同的厂区区域画面，单区最少传图1张（限制≤20MB）',
    optimizationRemark: '保留——首创性引入摄制分镜与上一阶“企业内部业务流转”节点的深度级联联动'
  },
  {
    id: 'highlightShots',
    nodeIndex: 41,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '建议重点突出高光镜头与分镜构想',
    type: 'highlight_shots_linkage',
    isRequired: false,
    hint: '提出你们心目中最引以为傲、最希望能通过广角、微距、大移轴和高速升格镜头表现的特写细节（比如：十八辊轧机带料咬合瞬间的火花特写），多选与其相关契合的厂区取景段（联动上一题已填区域）、绑定可能对标瓦解的买家痛点（联动 node 37/38 的误解 clarified 节点）。',
    validationRule: '如若填写了高光建议案，必须勾选联动至少 1 个可拍摄区域',
    optimizationRemark: '保留——建立镜头与场景、客户痛点澄清的闭环联动'
  },
  {
    id: 'existingMediaArchive',
    nodeIndex: 42,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '企业既有影像素材交接',
    type: 'media_archive_dynamic',
    isRequired: false,
    hint: '如有企业历史展会掠影、历史老片、白底高精主图。请打包录入行：素材基本类型、该类型估计大体数量、公有或保密云网盘分享链接（如百度网盘、Google Drive、WeTransfer 等）、对应网络提取密码、勾选授权本宣导制作团队可用于社媒或官网剪辑许可范围。',
    validationRule: '录入网盘链接须符合规范的 HTTP/HTTPS 超链接语法结构，否则不予通过',
    optimizationRemark: '保留并增加了极其细致的网络链接有效性监测与多媒体授权管理'
  },
  {
    id: 'ndaConfidential',
    nodeIndex: 43,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '商业机密、禁拍限拍管理',
    type: 'nda_mgt_lock',
    isRequired: true,
    hint: '极度关键的商业保密协议及避坑区域：① 多行文本标明全厂绝对敏感、严禁任何人通过摄像设备或者手机拍照的严禁要素（如“特斯拉联名精密防伪冲压模具、财务账册文件、涉及国字头保密级涂画公式墙”）；② 多选勾选本厂哪些已经踩点的区域在拍摄中必须清场或者锁定不可对准（联动上述 node 40 场景）；③ 如需摄制组全员带队前签署保密协议（NDA），请在此无缝上传保密空置模板范本。',
    validationRule: '红字醒目预警；提示保密文件模板上传，限制 PDF 在 ≤20MB 范围内',
    optimizationRemark: '保留并深度增强——直接支持将上面踩点的关联区域动态指定为“限拍/禁拍”区域，加强实操安全'
  },
  {
    id: 'scheduleBooking',
    nodeIndex: 44,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '建议拍摄档期与日常作息安排',
    type: 'calendar_booking_times',
    isRequired: true,
    hint: '摄制日程预排：① 选定摄制摄制组本月内上门进行核心生产和现场拍摄推荐窗口；② 选定本厂极度处于不便拍摄的档期（如机器交接大修期、大型核心长假、旺期全产密不穿风时段等）；③ 设置日常生产上下班时间（如08:00至17:30，便于日光外景光线计算及抓拍职工在岗忙碌氛围）',
    validationRule: '所选择的推荐拍摄开放区间跨度必须不低于 3 天，避开档期与推荐档期不能发生重合冲突',
    optimizationRemark: '保留，全新增加了工厂上下班真实打卡时间，极大降低了由于夜戏或者没有抓拍到工人导致的分毫浪费'
  },
  {
    id: 'languagesRequired',
    nodeIndex: 45,
    stageName: '阶段六：拍摄执行筹备',
    stageIndex: 6,
    title: '成品视频多语言版本规划',
    type: 'languages_checkboxes',
    isRequired: false,
    hint: '宣导影片除了默认标配全片纯英音旁白、中英双语字幕外，是否期望配发并额外剪辑、录制其他多语系版本（如：西班牙语、法语、俄语、阿拉伯语、德语等）以深耕特定地区。',
    validationRule: '一键复选，多选操作，提供未来战略预留选项',
    optimizationRemark: '新增——多语种精细配音剪接定制分发规划'
  },

  // Stage 7: 联络与数字化触点 (Contact & Ecommerce Touchpoints)
  {
    id: 'ecommerceMatrix',
    nodeIndex: 46,
    stageName: '阶段七：联络与数字化触点',
    stageIndex: 7,
    title: '现有电商及独立官网矩阵',
    type: 'ecommerce_input_tbl',
    isRequired: true,
    hint: '请核实并填写：① 多选勾选涵盖的电商独立矩阵（Alibaba国际旺铺、Made-in-China、环球资源、亚马逊旗舰店、独立站Shopify、1688旺铺等）；② 输入对应旺铺直达公网完整URL连接；③ 双向开关标识该站点是否为全司目前主推和订单导流、日常大推的核心战线。',
    validationRule: '必须至少登记并确认 1 处 现行在运的电商网址，链接必须符合合法的 HTTP/HTTPS 协议网址规定',
    optimizationRemark: '保留——增加全盘主推引流标识，便于多店铺的重点梳理'
  },
  {
    id: 'contactsTeam',
    nodeIndex: 47,
    stageName: '阶段七：联络与数字化触点',
    stageIndex: 7,
    title: '核心对接人及项目工作团队',
    type: 'team_contacts_cards',
    isRequired: true,
    hint: '保证业务流能够绝对、无缝地转接：动态添加拼图。必须填报：职员全名、部门职位、正式工作邮箱、电话号码、WhatsApp注册号、微信账号。更进一步指定该员在本次金品立项推进大片中所扮演的协作职责角色（[项目主对接]、[外贸金牌标兵]、[现场安全及拍摄协助负责人]）。',
    validationRule: '邮箱严格符合 RFC 电子邮件正则规范；电话符合11位或含国际区号规则；必须设置且仅能有1位成员角色担任“项目主对接”',
    optimizationRemark: '保留重构，全新引入了角色职能定义分流，用于匹配FB和阿里询盘跟进分发归宿'
  }
];
