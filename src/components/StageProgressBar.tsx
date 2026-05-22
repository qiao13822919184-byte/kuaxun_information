/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, ClipboardList } from 'lucide-react';
import { FormDataState } from '../types';
import { FORM_NODES } from '../data/fields';

interface StageProgressBarProps {
  currentStageIndex: number;
  formData: FormDataState;
  onStageSelect: (stageIndex: number) => void;
}

export default function StageProgressBar({
  currentStageIndex,
  formData,
  onStageSelect,
}: StageProgressBarProps) {
  
  // Calculate completed nodes per stage
  const stages = [
    { index: 1, name: '企业身份识别' },
    { index: 2, name: '规模与资质实力' },
    { index: 3, name: '生产能力画像' },
    { index: 4, name: '品质与合规体系' },
    { index: 5, name: '市场与客户背景' },
    { index: 6, name: '拍摄执行筹备' },
    { index: 7, name: '联络与数字化触点' },
  ];

  const getStageStats = (stageIndex: number) => {
    const nodes = FORM_NODES.filter((n) => n.stageIndex === stageIndex);
    const total = nodes.length;
    let completed = 0;

    nodes.forEach((node) => {
      if (checkIsNodeCompleted(node.id, formData)) {
        completed++;
      }
    });

    return { completed, total };
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 py-3 px-4 md:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left branding / system tag */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded text-slate-900 shadow">
            <ClipboardList size={20} className="font-bold" />
          </div>
          <div>
            <span className="text-xs text-amber-500 font-mono tracking-wider font-semibold">INFORMATION COLLECTION</span>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none mt-0.5">跨迅科技_信息收集系统</h1>
          </div>
        </div>

        {/* Right - Steps Indicator */}
        <div className="flex-1 max-w-4xl">
          <div className="grid grid-cols-7 gap-2">
            {stages.map((stg) => {
              const { completed, total } = getStageStats(stg.index);
              const isFinished = completed === total && total > 0;
              const isActive = currentStageIndex === stg.index;
              const isPast = currentStageIndex > stg.index;
              const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

              return (
                <div
                  key={stg.index}
                  onClick={() => onStageSelect(stg.index)}
                  className={`group relative cursor-pointer flex flex-col gap-1 select-none`}
                  title={`第${stg.index}阶段: ${stg.name} (${completed}/${total} 题)`}
                >
                  {/* Visual segment bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden transition-all duration-300">
                    <div
                      style={{ width: `${progressPercentage}%` }}
                      className={`h-full transition-all duration-500 ${
                        isActive
                          ? 'bg-amber-500'
                          : isFinished
                          ? 'bg-emerald-500'
                          : isPast
                          ? 'bg-amber-600/60'
                          : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  {/* Stage Text & completion mark */}
                  <div className="flex items-center justify-between mt-1 px-0.5">
                    <span
                      className={`text-[10px] md:text-xs font-medium truncate transition-colors duration-200 ${
                        isActive
                          ? 'text-amber-500 font-semibold'
                          : isFinished
                          ? 'text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {stg.index}. {stg.name}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {isFinished ? (
                        <Check size={10} className="text-emerald-400 font-bold" />
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-400">
                          {completed}/{total}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Tooltip on Hover showing precise completeness details */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-slate-950 border border-slate-800 text-white rounded-md py-1.5 px-3 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap text-xs flex flex-col gap-0.5">
                    <p className="font-semibold text-amber-500">{stg.name}</p>
                    <p className="text-slate-400">已填进度: <span className="font-mono text-white font-bold">{completed}</span> / {total} 题 ({Math.round(progressPercentage)}%)</p>
                    <p className="text-[10px] text-slate-500 italic">点此直接跳转到此阶段第一题</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to determine if a node's complex model is considered completed (user entered non-null data)
export function checkIsNodeCompleted(nodeId: string, data: FormDataState): boolean {
  switch (nodeId) {
    // Stage 1
    case 'cnName':
      return !!data.enterprise.cnName && data.enterprise.cnName.trim().length >= 2;
    case 'enName':
      return !!data.enterprise.enName && data.enterprise.enName.trim().length >= 2;
    case 'brandEn':
      return data.enterprise.brandEn.length > 0 && data.enterprise.brandEn.some(b => b.trim().length > 0);
    case 'logoHexSlogan':
      return (
        !!data.enterprise.logoHexSlogan.colorHex &&
        !!data.enterprise.logoHexSlogan.sloganCn.trim() &&
        !!data.enterprise.logoHexSlogan.sloganEn.trim()
      );
    case 'foundedYear':
      return data.enterprise.foundedYear >= 1900 && data.enterprise.foundedYear <= 2026;
    case 'businessLicenseMeta':
      return !!data.enterprise.businessLicenseMeta;
    case 'addressCascade':
      return (
        !!data.enterprise.addressCascade.province &&
        !!data.enterprise.addressCascade.city &&
        !!data.enterprise.addressCascade.detailCn.trim() &&
        !!data.enterprise.addressCascade.detailEn.trim()
      );

    // Stage 2
    case 'totalStaff':
      return !!data.credentials.totalStaff;
    case 'rndStaff':
      return data.credentials.rndStaffCount >= 0;
    case 'facilityArea':
      return data.credentials.facilityArea.area > 0 && data.credentials.facilityArea.photos.length > 0;
    case 'honors':
      // optional, if empty it is valid, but let's count as completed if they interacted or have entries
      return true;
    case 'certifications':
      return data.credentials.certifications.length > 0;
    case 'factoryAudits':
      // optional, if empty it is valid
      return true;

    // Stage 3
    case 'mainCategories':
      return data.production.mainCategories.length > 0;
    case 'hsCodes':
      return data.production.hsCodes.length > 0 && data.production.hsCodes.every(h => !!h.code.trim() && !!h.prodNameCn.trim());
    case 'eCatalogs':
      return data.production.eCatalogs.length > 0;
    case 'featuredProducts':
      return (
        data.production.featuredProducts.length >= 3 &&
        data.production.featuredProducts.length <= 5 &&
        data.production.featuredProducts.every(p => !!p.nameCn.trim() && !!p.nameEn.trim() && !!p.whiteBgPhoto)
      );
    case 'productionLines':
      return data.production.productionLines.length > 0 && data.production.productionLines.every(l => !!l.name.trim() && l.qty >= 1);
    case 'newProductsYearly':
      return true; // Optional
    case 'keyEquipments':
      return data.production.keyEquipments.length > 0 && data.production.keyEquipments.every(e => !!e.name.trim() && !!e.advantage.trim());
    case 'supplyChainRatio':
      return !!data.production.supplyChainRatio.model && data.production.supplyChainRatio.rawMaterialsSource.trim().length >= 30;
    case 'oemOdmCapacity':
      if (!data.production.oemOdmCapacity.enabled) return true;
      return (
        data.production.oemOdmCapacity.types.length > 0 &&
        !!data.production.oemOdmCapacity.flowDescription.trim() &&
        data.production.oemOdmCapacity.minOrderQty >= 0
      );

    // Stage 4
    case 'qcWorkflow':
      return (
        data.quality.qcWorkflow.steps.length > 0 &&
        data.quality.qcWorkflow.labPhotos.length > 0 &&
        data.quality.qcWorkflow.coreTestingItems.trim().length > 0
      );
    case 'moqThresholds':
      return data.quality.moqThresholds.length > 0 && data.quality.moqThresholds.every(m => m.moqQty >= 0 && !!m.category.trim());
    case 'leadTime':
      return data.quality.leadTime.standardBatchDays > 0 && data.quality.leadTime.customOrderDays > 0;
    case 'samplePolicy':
      return data.quality.samplePolicy.sampleFeeUsd >= 0;
    case 'internalBusinessFlow':
      return data.quality.internalBusinessFlow.length >= 3;

    // Stage 5
    case 'marketMatrix':
      return (
        data.market.marketMatrix.length > 0 &&
        data.market.marketMatrix.every(mm => !!mm.marketRegion && !!mm.featuredProduct.trim() && !!mm.reason.trim())
      );
    case 'keywordsSet':
      return data.market.keywordsSet.enKeywords.length >= 10;
    case 'blacklistRegions':
      return true; // Optional
    case 'domesticCompetitors':
      return true; // Optional
    case 'foreignCompetitors':
      return true; // Optional
    case 'overseasCases':
      return true; // Optional
    case 'repurchaseReasons':
      return data.market.repurchaseReasons.quotes.length >= 1;
    case 'afterSalesSupport':
      return data.market.afterSalesSupport.services.length > 0;
    case 'commonMisconceptions':
      return data.market.commonMisconceptions.length >= 1;
    case 'targetBuyerPersona':
      return (
        data.market.targetBuyerPersona.idealTypes.length > 0 &&
        !!data.market.targetBuyerPersona.idealVolume.trim() &&
        data.market.targetBuyerPersona.nonIdealPersona.trim().length >= 20
      );

    // Stage 6
    case 'staffPrep':
      return data.shooting.staffPrep.length > 0 && data.shooting.staffPrep.some(s => s.shootingConsent !== '拒绝登场');
    case 'shootingLocations':
      return (
        data.shooting.shootingLocations.length >= 3 &&
        data.shooting.shootingLocations.every(l => !!l.name.trim() && l.photos.length > 0)
      );
    case 'highlightShots':
      return true; // Optional
    case 'existingMediaArchive':
      return true; // Optional
    case 'ndaConfidential':
      return !!data.shooting.ndaConfidential.remark.trim();
    case 'scheduleBooking':
      return (
        !!data.shooting.scheduleBooking.recommendedWindowStart &&
        !!data.shooting.scheduleBooking.recommendedWindowEnd &&
        !!data.shooting.scheduleBooking.onDutyTime &&
        !!data.shooting.scheduleBooking.offDutyTime
      );
    case 'languagesRequired':
      return true; // Optional

    // Stage 7
    case 'ecommerceMatrix':
      return data.contacts.ecommerceMatrix.length > 0 && data.contacts.ecommerceMatrix.every(e => !!e.url.trim());
    case 'contactsTeam':
      return (
        data.contacts.contactsTeam.length > 0 &&
        data.contacts.contactsTeam.some(c => c.role === '项目主对接') &&
        data.contacts.contactsTeam.every(c => !!c.name.trim() && !!c.email.trim() && !!c.phone.trim())
      );

    default:
      return false;
  }
}
