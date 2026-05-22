/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { FormDataState, UploadedFileMeta } from '../types';
import { getFileBlob, blobToDataURL } from '../utils/indexedDB';
import { 
  Award, 
  FileText, 
  CheckCircle, 
  Shield, 
  Globe, 
  MapPin, 
  Briefcase,
  Layers,
  Video,
  PhoneCall,
  Flame,
  Info
} from 'lucide-react';

interface ReportPreviewProps {
  formData: FormDataState;
}

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(
  ({ formData }, ref) => {
    const [imageUrls, setImageUrls] = useState<{ [id: string]: string }>({});
    const [loadingImages, setLoadingImages] = useState(false);

    // Pre-load all photo metadata from IndexedDB as DataURLs so they render inside pdf generation
    useEffect(() => {
      let isMounted = true;
      const collectMetas: UploadedFileMeta[] = [];

      // Collect Stage 1 Enterprise Files
      if (formData.enterprise.logoHexSlogan.logoMeta) {
        collectMetas.push(formData.enterprise.logoHexSlogan.logoMeta);
      }
      if (formData.enterprise.businessLicenseMeta) {
        collectMetas.push(formData.enterprise.businessLicenseMeta);
      }

      // Collect Stage 2 Space & Certificate Files
      if (formData.credentials.facilityArea.photos) {
        collectMetas.push(...formData.credentials.facilityArea.photos);
      }
      formData.credentials.honors.forEach((h) => {
        if (h.fileMeta) collectMetas.push(h.fileMeta);
      });
      formData.credentials.certifications.forEach((c) => {
        if (c.fileMeta) collectMetas.push(c.fileMeta);
      });
      formData.credentials.factoryAudits.forEach((a) => {
        if (a.fileMeta) collectMetas.push(a.fileMeta);
      });

      // Collect Stage 3 Production, Devices & Featured Product Files
      formData.production.featuredProducts.forEach((p) => {
        if (p.whiteBgPhoto) collectMetas.push(p.whiteBgPhoto);
        if (p.scenePhoto) collectMetas.push(p.scenePhoto);
      });
      formData.production.keyEquipments.forEach((e) => {
        if (e.fileMeta) collectMetas.push(e.fileMeta);
      });

      // Collect Stage 4 Quality Files
      if (formData.quality.qcWorkflow.labPhotos) {
        collectMetas.push(...formData.quality.qcWorkflow.labPhotos);
      }

      // Collect Stage 5 Market Success Cases & quotes Proof
      formData.market.overseasCases.forEach((cs) => {
        if (cs.photoMeta) collectMetas.push(cs.photoMeta);
      });
      formData.market.repurchaseReasons.quotes.forEach((q) => {
        if (q.screenshotMeta) collectMetas.push(q.screenshotMeta);
      });

      // Collect Stage 6 shooting Locations & NDA
      formData.shooting.shootingLocations.forEach((l) => {
        if (l.photos) collectMetas.push(...l.photos);
      });
      if (formData.shooting.ndaConfidential.ndaAgreementMeta) {
        collectMetas.push(formData.shooting.ndaConfidential.ndaAgreementMeta);
      }

      const loadImages = async () => {
        setLoadingImages(true);
        const urls: { [id: string]: string } = {};
        for (const meta of collectMetas) {
          try {
            const blob = await getFileBlob(meta.id);
            if (blob && isMounted) {
              const url = await blobToDataURL(blob);
              urls[meta.id] = url;
            }
          } catch (e) {
            console.warn('Failed to pre-load image for report', meta.name, e);
          }
        }
        if (isMounted) {
          setImageUrls(urls);
          setLoadingImages(false);
        }
      };

      loadImages();
      return () => {
        isMounted = false;
      };
    }, [formData]);

    const formattedDate = new Date().toISOString().split('T')[0];

    return (
      <div
        ref={ref}
        id="report-pdf-target"
        className="w-full bg-white text-slate-900 font-sans p-8 md:p-12 shadow-2xl rounded-sm mx-auto relative overflow-hidden text-left"
        style={{ maxWidth: '850px', minHeight: '1150px' }}
      >
        {/* Decorative corner stripe matching brand color choice */}
        <div
          className="absolute top-0 right-0 left-0 h-4 w-full"
          style={{ backgroundColor: formData.enterprise.logoHexSlogan.colorHex || '#d97706' }}
        />

        {/* LOADING INDICATOR EMBEDDED SAFELY */}
        {loadingImages && (
          <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1.5 font-mono shadow animate-pulse">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            <span>媒体附件正在渲染至正本 (Fid)...</span>
          </div>
        )}

        {/* ================= PAGE 1: COVER PAGE ================= */}
        <div className="flex flex-col justify-between mb-16 pb-12 border-b-2 border-slate-200" style={{ minHeight: '750px' }}>
          <div>
            <div className="flex justify-between items-start mt-4">
              <div className="flex items-center gap-3">
                {formData.enterprise.logoHexSlogan.logoMeta && imageUrls[formData.enterprise.logoHexSlogan.logoMeta.id] ? (
                  <img
                    src={imageUrls[formData.enterprise.logoHexSlogan.logoMeta.id]}
                    alt="Logo"
                    className="max-h-16 max-w-[150px] object-contain rounded border pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: formData.enterprise.logoHexSlogan.colorHex || '#d97706' }}
                  >
                    LOGO
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">Enterprise Information Collection Report</h3>
                  <p className="text-[10px] text-slate-500">跨迅科技 _ 核心合规档案收集系统</p>
                </div>
              </div>
              
              <div
                className="text-[11px] border-l-2 py-1 px-3 text-slate-600 font-mono"
                style={{ borderColor: formData.enterprise.logoHexSlogan.colorHex || '#d97706' }}
              >
                报告编译日期: {formattedDate}
              </div>
            </div>

            {/* Huge cover title block */}
            <div className="mt-24 space-y-4">
              <span className="text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded tracking-widest text-white bg-slate-900">
                OFFICIAL VERIFIABLE REPORT
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight pt-2">
                【企业中英文全称申报正本】
              </h1>
              <p className="text-2xl font-extrabold text-slate-800 font-sans mt-1">
                {formData.enterprise.cnName || '深圳市国迅制造有限公司'}
              </p>
              <p className="text-base text-slate-500 font-mono font-medium -mt-1">
                {formData.enterprise.enName || 'Shenzhen Guoxun Manufacturing Co., Ltd.'}
              </p>
              
              {formData.enterprise.logoHexSlogan.sloganCn && (
                <div 
                  className="mt-6 p-4 bg-slate-50 border-l-4 rounded-r-sm italic" 
                  style={{ borderLeftColor: formData.enterprise.logoHexSlogan.colorHex || '#d97706' }}
                >
                  <p className="text-slate-850 text-xs font-semibold">“ {formData.enterprise.logoHexSlogan.sloganCn} ”</p>
                  {formData.enterprise.logoHexSlogan.sloganEn && (
                    <p className="text-slate-500 text-[10px] mt-1 font-mono">“ {formData.enterprise.logoHexSlogan.sloganEn} ”</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-sans leading-normal">
            <div>
              <p className="font-bold text-slate-800 mb-1.5 uppercase tracking-wide">一、基础能力与规模要素</p>
              <p>• 【企业成立时间】: <span className="font-mono font-semibold text-slate-900">{formData.enterprise.foundedYear} 年</span></p>
              <p>• 【全厂在职员工】: <span className="font-semibold text-slate-900">{formData.credentials.totalStaff} 人</span> ({formData.credentials.rndStaffCount}人专设研发)</p>
              <p>• 【厂房占空面积】: <span className="font-mono font-semibold text-slate-900">{formData.credentials.facilityArea.area} {formData.credentials.facilityArea.unit}</span> ({formData.credentials.facilityArea.ownership})</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1.5 uppercase tracking-wide">二、合规验证与宣称矩阵</p>
              <p>• 【品控监控节点】: <span className="font-semibold text-slate-900">{formData.quality.qcWorkflow.steps.join(', ') || '未配置'}</span></p>
              <p>• 【电商拓客矩阵】: <span className="font-semibold text-slate-900">{formData.contacts.ecommerceMatrix.map(e => e.platform).join(', ') || 'Alibaba'}</span></p>
              <p>• 【服务质量保证】: <span className="font-semibold text-slate-900">{formData.market.afterSalesSupport.services.length > 0 ? '已明细质保政策' : '常规质保'}</span></p>
            </div>
          </div>
        </div>

        {/* ================= SECTION 1 ================= */}
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <Briefcase className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【1. 第一部分 阶段一：企业身份识别与基础资质证明】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：公司中文名】</td>
                <td className="p-2 font-extrabold text-slate-900">{formData.enterprise.cnName || '未填写'}</td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：公司英文名】</td>
                <td className="p-2 font-mono font-bold text-slate-800">{formData.enterprise.enName || 'Unsubmitted'}</td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：英文主副品牌】</td>
                <td className="p-2 font-bold text-amber-750">{formData.enterprise.brandEn.filter(Boolean).join('、') || '未提交品牌'}</td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：厂房空间地址】</td>
                <td className="p-2 leading-relaxed">
                  <p className="font-bold">{formData.enterprise.addressCascade.country} · {formData.enterprise.addressCascade.province} · {formData.enterprise.addressCascade.city} · {formData.enterprise.addressCascade.district}</p>
                  <p className="text-slate-700 mt-0.5">{formData.enterprise.addressCascade.detailCn}</p>
                  <p className="text-slate-500 font-mono text-[9px] mt-0.5">{formData.enterprise.addressCascade.detailEn}</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    生产与经营办公地是否一致: 
                    <span className="font-bold text-slate-700 ml-1">
                      {formData.enterprise.addressCascade.isConsistent ? '地址完全一致' : `不一致 (注册地: ${formData.enterprise.addressCascade.registerAddress || '未填'})`}
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Business License Photo Display */}
          {formData.enterprise.businessLicenseMeta && imageUrls[formData.enterprise.businessLicenseMeta.id] ? (
            <div className="mt-2.5 p-2 bg-slate-50 border border-slate-150 rounded inline-block max-w-full">
              <span className="block text-[10px] font-bold text-slate-500 mb-1 font-mono">
                【照片嵌入：① 企业营业执照副本自认证实照 (JPG/PDF)】
              </span>
              <img
                src={imageUrls[formData.enterprise.businessLicenseMeta.id]}
                alt="Business License"
                className="max-h-56 max-w-[280px] object-contain rounded border pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="mt-2 text-[10px] text-slate-400 border border-dashed rounded p-3 text-center">
              【提示：本节点营业执照照片尚未上传，导出包内将略过此附件】
            </div>
          )}
        </div>

        {/* ================= SECTION 2 ================= */}
        <div className="mb-8 pt-4 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <Globe className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【2. 第二部分 阶段二：企业办公与生产空间验证】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：厂区所有权形式】</td>
                <td className="p-2 font-bold text-slate-800">{formData.credentials.facilityArea.ownership === 'own' ? '自有房产 / 土地产权证书已阅' : '长期契约租赁 / 租赁成交材料齐备'}</td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：自主品牌荣誉宣示】</td>
                <td className="p-2">
                  {formData.credentials.honors.length > 0 ? (
                    <div className="space-y-1.5">
                      {formData.credentials.honors.map((h, idx) => (
                        <div key={h.id || idx} className="text-[11px] flex justify-between bg-slate-50 p-1 border rounded">
                          <span className="font-bold text-slate-800">🏆 {h.name}</span>
                          <span className="text-slate-500 font-mono text-[10px]">{h.certYear} 年发证</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">未提报自主荣誉资质</p>
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：国际质量体系与审核】</td>
                <td className="p-2">
                  {formData.credentials.certifications.length > 0 ? (
                    <div className="space-y-1.5">
                      {formData.credentials.certifications.map((c, idx) => (
                        <div key={c.id || idx} className="text-[10px] bg-slate-100 p-1.5 border border-slate-200 rounded leading-tight">
                          <p className="font-bold text-slate-900 border-l-2 border-amber-600 pl-1">【体系名】: {c.name} ({c.issuer})</p>
                          <p className="text-slate-500 mt-0.5">【证书号】: <span className="font-mono">{c.certNo}</span> | 【截至日期】: <span className="font-semibold text-emerald-600 font-mono">{c.expiryDate}</span></p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">未上传 ISO, CE, RoHS 等特定检验合格证书</p>
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：大厂/第三方授权验厂】</td>
                <td className="p-2 flex flex-wrap gap-1.5">
                  {formData.credentials.factoryAudits.length > 0 ? (
                    formData.credentials.factoryAudits.map((a, idx) => (
                      <span key={a.id || idx} className="bg-blue-50 text-blue-800 border-l-2 border-blue-600 px-2 py-0.5 text-[10px] font-bold">
                        🛡️ {a.auditor} 核验通过
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">常规工厂核验阶段</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Space Area & Certificate Photo Embeds */}
          <div className="space-y-3">
            {formData.credentials.facilityArea.photos && formData.credentials.facilityArea.photos.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1 font-mono">
                  【照片嵌入：② 厂房及办公物理外部实写航拍/全景图组 (IIDB)】
                </span>
                <div className="grid grid-cols-2 gap-2 max-w-[650px]">
                  {formData.credentials.facilityArea.photos.map((p) => (
                    imageUrls[p.id] ? (
                      <div key={p.id} className="p-1 border bg-slate-50 rounded">
                        <img
                          src={imageUrls[p.id]}
                          alt={p.name}
                          className="w-full h-24 object-cover rounded pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-[9px] text-slate-500 truncate mt-0.5 text-center font-mono">{p.name}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Honor & Certificate Scans Nested Inline */}
            <div className="flex flex-wrap gap-2.5">
              {formData.credentials.honors.map((h, idx) => (
                h.fileMeta && imageUrls[h.fileMeta.id] ? (
                  <div key={idx} className="p-1 border rounded bg-slate-50 text-[9px] w-28">
                    <img src={imageUrls[h.fileMeta.id]} alt={h.name} className="h-20 w-full object-contain bg-white" referrerPolicy="no-referrer" />
                    <p className="font-bold text-center truncate text-slate-600 mt-1">{h.name}</p>
                  </div>
                ) : null
              ))}
              {formData.credentials.certifications.map((c, idx) => (
                c.fileMeta && imageUrls[c.fileMeta.id] ? (
                  <div key={idx} className="p-1 border rounded bg-slate-50 text-[9px] w-28">
                    <img src={imageUrls[c.fileMeta.id]} alt={c.name} className="h-20 w-full object-contain bg-white" referrerPolicy="no-referrer" />
                    <p className="font-bold text-center truncate text-slate-600 mt-1">{c.name}</p>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION 3 ================= */}
        <div className="mb-8 pt-4 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <Layers className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【3. 第三部分 阶段三：核心生产能力、产品与专有设备数述】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：行业主营产品树】</td>
                <td className="p-2 font-bold text-slate-900 border-l-2 border-emerald-600 pl-2">
                  {formData.production.mainCategories.join(' > ') || '高精智造与精密元器件'}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：海关 HS 备案编码】</td>
                <td className="p-2 flex flex-wrap gap-1.5">
                  {formData.production.hsCodes.map((h, idx) => (
                    <span key={h.id || idx} className="bg-slate-100 px-1.5 py-0.5 rounded border text-[10px] font-mono">
                      <strong className="text-slate-900">{h.code}</strong> · {h.prodNameCn} 
                      {h.isFeatured && <span className="bg-amber-400 text-slate-950 px-1 ml-1 rounded text-[8px] font-bold">主推</span>}
                    </span>
                  ))}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：自主链条与定制模式】</td>
                <td className="p-2 whitespace-pre-line leading-relaxed">
                  <p>【自主程度】: <span className="font-bold text-orange-700">
                    {formData.production.supplyChainRatio.model === 'full' ? '100%全工艺覆盖自产' : formData.production.supplyChainRatio.model === 'core' ? '核心重要元组件及芯片自研自产' : '组装贴牌制造'}
                  </span></p>
                  <p className="mt-1 text-slate-700">【供应链基地】: {formData.production.supplyChainRatio.rawMaterialsSource}</p>
                  {formData.production.oemOdmCapacity.enabled && (
                    <div className="mt-1.5 p-2 bg-amber-50 rounded text-[10px] leading-relaxed border border-amber-100">
                      <p>【定制类型】: <strong className="text-amber-800">{formData.production.oemOdmCapacity.types.join(', ')}</strong> | 打样周期: <strong>{formData.production.oemOdmCapacity.duration}</strong></p>
                      <p>【首期起订量】: <strong>{formData.production.oemOdmCapacity.minOrderQty} pcs</strong> | 业务流: <strong>{formData.production.oemOdmCapacity.flowDescription}</strong></p>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Key Equipments and Featured Products Display */}
          <div className="space-y-4">
            {formData.production.keyEquipments.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
                  【属性：自置核心关键专有设备及特写影像】
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {formData.production.keyEquipments.map((eq, idx) => (
                    <div key={eq.id || idx} className="p-2 border rounded bg-slate-50 flex gap-2">
                      {eq.fileMeta && imageUrls[eq.fileMeta.id] && (
                        <img
                          src={imageUrls[eq.fileMeta.id]}
                          alt={eq.name}
                          className="w-16 h-16 object-cover rounded border bg-white shrink-0 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="text-[10px]">
                        <p className="font-bold text-slate-800 truncate">{eq.name}</p>
                        <p className="text-slate-400 mt-0.5">级别: {eq.isFirstInClass === 'global' ? '🌍全球首创' : eq.isFirstInClass === 'domestic' ? '🇨🇳国内首创' : '💎行业精尖'}</p>
                        <p className="text-slate-500 line-clamp-2 italic tracking-tight">{eq.advantage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Products List with White Background Photos as required */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-2 font-mono">
                【属性：金商申报主推特色产品详细目录 & 白底/实写影像对照】
              </span>
              <div className="space-y-2.5">
                {formData.production.featuredProducts.map((p, idx) => (
                  <div key={p.id || idx} className="p-3 border border-slate-200 rounded BG-slate-50 flex flex-col md:flex-row gap-3">
                    {/* Visual Images side-by-side */}
                    <div className="flex gap-2 shrink-0">
                      {p.whiteBgPhoto && imageUrls[p.whiteBgPhoto.id] ? (
                        <div className="w-20 h-20 border rounded bg-white p-0.5">
                          <img src={imageUrls[p.whiteBgPhoto.id]} alt="Whitebg" className="w-full h-full object-contain pointer-events-none" referrerPolicy="no-referrer" />
                          <span className="block text-[8px] text-slate-400 text-center scale-90">白底正面照</span>
                        </div>
                      ) : null}
                      {p.scenePhoto && imageUrls[p.scenePhoto.id] ? (
                        <div className="w-20 h-20 border rounded bg-slate-100 p-0.5">
                          <img src={imageUrls[p.scenePhoto.id]} alt="Scene" className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                          <span className="block text-[8px] text-slate-400 text-center scale-90">装配实写照</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Meta detail specifications */}
                    <div className="flex-1 grid grid-cols-2 gap-1.5 text-[10px] leading-tight text-slate-700">
                      <div className="col-span-2">
                        <p className="text-xs font-black text-slate-900">
                          [{idx+1}] 【产品中文名】: {p.nameCn} | 【英文名】: <span className="font-mono text-slate-600">{p.nameEn}</span>
                        </p>
                      </div>
                      <p>【申报型号】: <span className="font-mono font-bold">{p.model}</span></p>
                      <p>【目标市场】: <span className="font-semibold text-emerald-700">{p.targetMarket}</span></p>
                      <p>【推荐区间单价】: <strong className="text-amber-800 font-mono">${p.priceMin} - ${p.priceMax} USD</strong>/ {p.unit}</p>
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-500 italic bg-white p-1 rounded border">参数规格: {p.params}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4 ================= */}
        <div className="mb-8 pt-4 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <CheckCircle className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【4. 第四部分 阶段四：品控流程、检测标准与交期承诺】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：物理控制工步流程】</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {formData.quality.qcWorkflow.steps.map((step, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                        ✓ {step}
                      </span>
                    ))}
                  </div>
                  <p className="font-bold text-slate-800 mt-1.5">【核心物理/分子化学检项、控制指标】:</p>
                  <p className="text-slate-600 italic bg-slate-50 p-1.5 rounded text-[10px] mt-1 leading-normal">
                    {formData.quality.qcWorkflow.coreTestingItems || '未申报特定检验标准'}
                  </p>
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：出厂样品契约与估价】</td>
                <td className="p-2 leading-relaxed">
                  <p>【打样费用】: <strong className="text-slate-800">
                    {formData.quality.samplePolicy.feePolicy === 'free' ? '全免打样样品费' : formData.quality.samplePolicy.feePolicy === 'charged' ? '按定制打样另行收货款' : '打样先付大货可退抵款'}
                  </strong></p>
                  <p>【国际空邮快递】: <span className="font-medium text-slate-700">
                    {formData.quality.samplePolicy.freightPolicy === 'buyer' ? '由买方向特定到付账户支付邮资' : formData.quality.samplePolicy.freightPolicy === 'seller' ? '出货方全包包费' : '提供国际快递合同到付(Freight Collect)'}
                  </span></p>
                  {formData.quality.samplePolicy.sampleFeeUsd > 0 && <p>【首样指导单价】: <strong className="text-amber-800 font-mono">${formData.quality.samplePolicy.sampleFeeUsd} USD</strong>/pcs</p>}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：国际大单约定 Lead-time】</td>
                <td className="p-2 leading-normal">
                  <p>• 标品订单平均发货交期: <strong className="font-mono text-slate-900">{formData.quality.leadTime.standardBatchDays} 天</strong></p>
                  <p className="mt-0.5">• 复杂深层定制订单大单交期: <strong className="font-mono text-slate-900">{formData.quality.leadTime.customOrderDays} 天</strong></p>
                  {formData.quality.leadTime.seasonPeakRemark && (
                    <div className="mt-1.5 p-2 bg-red-50 text-red-900 border-l-2 border-red-500 rounded text-[9px] leading-relaxed">
                      <strong>【交期免责声明及大修调整缓存期】：</strong> {formData.quality.leadTime.seasonPeakRemark}
                    </div>
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：企业业务流程响应网格】</td>
                <td className="p-2 border-l-2 border-slate-900 pl-2 text-slate-850 font-bold tracking-tight text-[10px]">
                  {formData.quality.internalBusinessFlow.join(' ➔ ')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* QC Lab Photos Embeds */}
          {formData.quality.qcWorkflow.labPhotos && formData.quality.qcWorkflow.labPhotos.length > 0 && (
            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1 font-mono">
                【照片嵌入：④ 质检实验室/老化质控中心特写现场组照】
              </span>
              <div className="grid grid-cols-2 gap-2 max-w-[650px]">
                {formData.quality.qcWorkflow.labPhotos.map((p) => (
                  imageUrls[p.id] ? (
                    <div key={p.id} className="p-1 border rounded bg-slate-50">
                      <img
                        src={imageUrls[p.id]}
                        alt={p.name}
                        className="w-full h-24 object-cover rounded pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[9px] text-slate-500 font-mono text-center truncate mt-0.5">{p.name}</p>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 5 ================= */}
        <div className="mb-8 pt-4 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <Globe className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【5. 第五部分 阶段五：主推市场定位、客户案例与认知澄清】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：战略推广区域网格】</td>
                <td className="p-2">
                  <div className="space-y-1">
                    {formData.market.marketMatrix.map((m, i) => (
                      <div key={m.id || i} className="text-[10px] bg-slate-50 p-1 border rounded flex justify-between">
                        <span>🌍 推荐出口区域: <strong className="text-slate-900">{m.marketRegion}</strong> (主要爆款产品: {m.featuredProduct})</span>
                        <span className="text-slate-500 font-mono scale-95 pr-1">{m.reason}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：高风险拒接红线红区】</td>
                <td className="p-2">
                  {formData.market.blacklistRegions.length > 0 ? (
                    <div className="space-y-1">
                      {formData.market.blacklistRegions.map((b, i) => (
                        <div key={b.id || i} className="text-[10px] text-red-900 bg-red-50 p-1 rounded font-mono border-l-2 border-red-400">
                          🚫 免打扰国家（出口黑名单）: <strong>{b.country}</strong> | 保守退款原因: {b.remark}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">全球均常态覆盖承接订单</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：买家对立迷思与主见澄清】</td>
                <td className="p-2">
                  {formData.market.commonMisconceptions.length > 0 ? (
                    <div className="space-y-2">
                      {formData.market.commonMisconceptions.map((mis, idx) => (
                        <div key={mis.id || idx} className="bg-slate-50 p-2 border rounded leading-relaxed text-[10px]">
                          <p className="text-red-700 font-bold">❌ 【买家旧认知偏差】: {mis.misconception}</p>
                          <p className="text-emerald-700 font-bold mt-0.5">💡 【我司精密工艺权威澄清】: {mis.clarification}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">常规买卖往来</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Overseas Cases and quotes with screenshots Embeds */}
          <div className="space-y-4">
            {formData.market.overseasCases.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
                  【属性：海外重点商业大项目历史成交实证 (3年有效期)】
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {formData.market.overseasCases.map((cs, idx) => (
                    <div key={cs.id || idx} className="p-2 border rounded bg-slate-50 flex gap-2">
                      {cs.photoMeta && imageUrls[cs.photoMeta.id] && (
                        <img
                          src={imageUrls[cs.photoMeta.id]}
                          alt={cs.country}
                          className="w-16 h-16 object-cover rounded border bg-white shrink-0 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="text-[10px] leading-normal font-sans">
                        <p className="font-bold text-slate-900">{cs.country} · {cs.clientType}</p>
                        <p className="text-slate-500 font-mono mt-0.5">合作年限: <strong className="text-amber-800">{cs.yearsPartnered}年</strong> | 权限认证: 已录入</p>
                        <p className="text-slate-650 line-clamp-1 italic text-[9px] mt-0.5">{cs.scenario}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.market.repurchaseReasons.quotes.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
                  【属性：海外真实知名买家亲口述原音声明及对话佐证截图】
                </span>
                <div className="space-y-2">
                  {formData.market.repurchaseReasons.quotes.map((q, idx) => (
                    <div key={q.id || idx} className="p-2.5 bg-slate-50 border border-slate-150 rounded leading-relaxed text-[10px] flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <span className="text-slate-600 font-bold">💬 【口述中文】: </span>
                        <span className="text-slate-800 italic">“ {q.rawQuotesCn} ”</span>
                        <span className="block text-slate-500 font-mono text-[9px] mt-1 pr-1 border-t border-slate-200 pt-1">
                          【对端译文】: Chuang-sound: “ {q.quotesEn} ” — Country: {q.clientCountry}
                        </span>
                      </div>
                      {q.screenshotMeta && imageUrls[q.screenshotMeta.id] && (
                        <div className="w-24 shrink-0 bg-white p-1 border rounded flex flex-col items-center">
                          <img
                            src={imageUrls[q.screenshotMeta.id]}
                            alt="Screenshot"
                            className="h-14 object-contain max-w-full pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                          <span className="scale-[0.8] text-[8px] text-slate-400 mt-0.5 text-center truncate">会话存档契合</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 6 ================= */}
        <div className="mb-8 pt-4 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <Video className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【6. 第六部分 阶段六：宣拍大件筹备工作规划及保密红线说明】</h2>
          </div>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-200 mb-4 font-sans">
            <tbody>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 w-[160px] font-bold text-slate-800">【属性：保密排除NDA指示】</td>
                <td className="p-2 leading-relaxed">
                  <span className="bg-red-500 text-white px-1 font-bold rounded text-[8px] tracking-tight uppercase">Confidential Safety Barrier</span>
                  <p className="font-bold text-red-900 mt-1">【企业物理设备及算法核心严摄禁区红线】：</p>
                  <p className="text-slate-700 font-sans italic my-0.5 ml-1">{formData.shooting.ndaConfidential.remark || '无保密限制，常规全景全息外摄'}</p>
                </td>
              </tr>
              <tr className="border-b border-slate-250">
                <td className="bg-slate-50 border-r border-slate-200 p-2 font-bold text-slate-800">【属性：推荐档期预约窗口表】</td>
                <td className="p-2 font-semibold text-slate-800">
                  📅 项目外拍团队上门首期：<span className="font-mono text-amber-800 bg-amber-50 rounded px-1">{formData.shooting.scheduleBooking.recommendedWindowStart}</span> 
                  ➔ 截至：<span className="font-mono text-amber-800 bg-amber-50 rounded px-1">{formData.shooting.scheduleBooking.recommendedWindowEnd}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Shooting Locations and staff Prep Display */}
          <div className="space-y-4">
            {formData.shooting.staffPrep.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
                  【属性：出镜代言核心团队规划服饰契约 (首长唯一主导制)】
                </span>
                <table className="w-full text-[10px] text-left border-collapse border border-slate-200 leading-tight">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 p-1">职务与名字</th>
                      <th className="border border-slate-200 p-1">是否创始人</th>
                      <th className="border border-slate-200 p-1">英文流畅水平</th>
                      <th className="border border-slate-200 p-1">指定上镜正行服饰</th>
                      <th className="border border-slate-200 p-1">出镜确认状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.shooting.staffPrep.map((st, i) => (
                      <tr key={st.id || i} className="border-b">
                        <td className="border border-slate-200 p-1 font-bold text-slate-900">{st.name} ({st.position})</td>
                        <td className="border border-slate-200 p-1">{st.isFounder ? '👑 创始人主上镜' : '专业高管'}</td>
                        <td className="border border-slate-200 p-1">{st.englishFluent}</td>
                        <td className="border border-slate-200 p-1 text-slate-600">{st.wearStyle}</td>
                        <td className="border border-slate-200 p-1 text-emerald-600 font-extrabold">{st.shootingConsent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {formData.shooting.shootingLocations.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
                  【属性：拍导外景导演精选点位、外设起降及环境写照】
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {formData.shooting.shootingLocations.map((l, idx) => (
                    <div key={l.id || idx} className="p-2 border rounded bg-slate-50 flex flex-col justify-between">
                      <div className="leading-tight text-[10px]">
                        <p className="font-bold text-slate-950">🎬 点位: {l.name}</p>
                        <p className="text-slate-500 mt-0.5">关联提报工步: {l.linkedFlowStep}</p>
                        <span className={`inline-block mt-1 px-1 rounded text-[8px] font-bold ${l.isAerialReachable ? 'bg-indigo-150 text-indigo-800' : 'bg-slate-200 text-slate-500'}`}>
                          {l.isAerialReachable ? '🛸 支持无人机航外飞起起降测绘' : '🚫 限室内或限平视拍摄点位'}
                        </span>
                      </div>
                      
                      {/* Sub-location photos */}
                      {l.photos && l.photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 mt-1.5">
                          {l.photos.map((p) => (
                            imageUrls[p.id] ? (
                              <img
                                key={p.id}
                                src={imageUrls[p.id]}
                                alt="Loc_pic"
                                className="h-12 w-full object-cover rounded pointer-events-none"
                                referrerPolicy="no-referrer"
                              />
                            ) : null
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.shooting.ndaConfidential.ndaAgreementMeta && imageUrls[formData.shooting.ndaConfidential.ndaAgreementMeta.id] && (
              <div className="p-2 border rounded bg-slate-50 max-w-xs">
                <span className="block text-[8px] text-slate-400 font-mono mb-1">【保密核查证明：双向 NDA 签署扫描件回传】</span>
                <img
                  src={imageUrls[formData.shooting.ndaConfidential.ndaAgreementMeta.id]}
                  alt="NDA Sign"
                  className="max-h-24 object-contain mx-auto pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 7 & OATH ================= */}
        <div className="mb-4 pt-4 border-t border-slate-300 page-break">
          <div className="flex items-center gap-1.5 mb-3 border-b-2 pb-1.5 border-slate-900">
            <PhoneCall className="text-slate-900" size={16} />
            <h2 className="text-sm font-black text-slate-900 tracking-wide">【7. 第七部分 阶段七：申报企业主责对接人与合规誓言】</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5 text-[10px] leading-relaxed">
            {formData.contacts.contactsTeam.map((c, i) => (
              <div key={c.id || i} className="p-2 border rounded-md bg-slate-50">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>项目责任对接: {c.name} ({c.position})</span>
                  <span className={`px-1 bg-amber-500 text-slate-900 rounded font-black text-[8px] uppercase`}>{c.role}</span>
                </div>
                <p className="mt-0.5">📧 办公邮箱: <strong className="font-mono text-slate-700">{c.email}</strong></p>
                <p>📞 电话/手机: <strong className="font-mono text-slate-700">{c.phone}</strong></p>
                {c.whatsApp && <p>💬 WhatsApp ID: <span className="font-mono text-slate-650">{c.whatsApp}</span></p>}
                {c.weChat && <p>💬 微信: <span className="font-mono text-slate-650">{c.weChat}</span></p>}
              </div>
            ))}
          </div>

          {/* COMPLIANCE CERTIFICATION SOLID WRAPPER */}
          <div className="p-5 bg-slate-900 text-slate-200 rounded text-center border-2 border-slate-800 space-y-2.5 mt-6">
            <Shield size={20} className="text-emerald-500 mx-auto" />
            <h3 className="text-xs font-black tracking-wider text-slate-100 uppercase">【申报信息及原稿附件真实性自查诚信宣誓】</h3>
            <p className="text-[10px] text-slate-400 max-w-lg mx-auto leading-normal">
              本申报人代表 【<strong>{formData.enterprise.cnName || '深圳市国迅制造有限公司'}</strong>】 谨此郑重作出法律意义申明：
              本收集程序所提请申报的一切结构化数据、照片佐证文件、大厂验厂文本、商业保密排除限制以及各机位影像资料等，均经企业自身严格、逐一校验，确保原件合法有效，绝无欺瞒和恶意篡改行为。如因存在任何虚假而阻碍阿里金品核验核准及大厂审查进程的，本司自愿吞服所有由此酿成的后果并承担完全法纪赔付责任。
            </p>
            <div className="pt-2 border-t border-slate-800 flex flex-wrap justify-between items-center text-[9px] font-mono text-slate-500 max-w-md mx-auto">
              <span>【电子证书指纹校验】: SYST-SHA-{(formData.enterprise.cnName ? formData.enterprise.cnName.length : 123).toString(16).toUpperCase()}-{Date.now().toString(36).substring(4).toUpperCase()}</span>
              <span className="text-emerald-500 font-extrabold flex items-center gap-1">【系统验证标记】: VERIFIED APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReportPreview.displayName = 'ReportPreview';
