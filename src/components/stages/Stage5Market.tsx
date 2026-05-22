/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage5Market({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { market } = formData;

  const updateMarket = (fieldset: Partial<typeof market>) => {
    onChange((prev) => ({
      ...prev,
      market: { ...prev.market, ...fieldset },
    }));
  };

  const addMatrixRow = () => {
    const fresh = [...market.marketMatrix, { id: 'mm_' + Date.now(), marketRegion: '北美', featuredProduct: '', reason: '' }];
    updateMarket({ marketMatrix: fresh });
  };

  const removeMatrixRow = (id: string) => {
    updateMarket({ marketMatrix: market.marketMatrix.filter((mm) => mm.id !== id) });
  };

  const handleMatrixChange = (id: string, fieldset: Partial<typeof market.marketMatrix[0]>) => {
    updateMarket({
      marketMatrix: market.marketMatrix.map((mm) => (mm.id === id ? { ...mm, ...fieldset } : mm)),
    });
  };

  const addQuotesRow = () => {
    const fresh = [
      ...market.repurchaseReasons.quotes,
      { id: 'q_' + Date.now(), rawQuotesCn: '', quotesEn: '', clientCountry: '美国', signatureAllowed: true },
    ];
    updateMarket({
      repurchaseReasons: { ...market.repurchaseReasons, quotes: fresh },
    });
  };

  const removeQuotesRow = (id: string) => {
    updateMarket({
      repurchaseReasons: {
        ...market.repurchaseReasons,
        quotes: market.repurchaseReasons.quotes.filter((q) => q.id !== id),
      },
    });
  };

  const handleQuotesChange = (id: string, fieldset: Partial<typeof market.repurchaseReasons.quotes[0]>) => {
    updateMarket({
      repurchaseReasons: {
        ...market.repurchaseReasons,
        quotes: market.repurchaseReasons.quotes.map((q) => (q.id === id ? { ...q, ...fieldset } : q)),
      },
    });
  };

  const addMisconception = () => {
    const fresh = [...market.commonMisconceptions, { id: 'm_' + Date.now(), misconception: '', clarification: '' }];
    updateMarket({ commonMisconceptions: fresh });
  };

  const removeMisconception = (id: string) => {
    updateMarket({ commonMisconceptions: market.commonMisconceptions.filter((m) => m.id !== id) });
  };

  const handleMisconceptionChange = (id: string, fieldset: Partial<typeof market.commonMisconceptions[0]>) => {
    updateMarket({
      commonMisconceptions: market.commonMisconceptions.map((m) => (m.id === id ? { ...m, ...fieldset } : m)),
    });
  };

  // Keywords Array handlers
  const handleKeywordChange = (lang: 'cn' | 'en', text: string) => {
    const tags = text
      .split(/[,，\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (lang === 'cn') {
      updateMarket({ keywordsSet: { ...market.keywordsSet, cnKeywords: tags } });
    } else {
      updateMarket({ keywordsSet: { ...market.keywordsSet, enKeywords: tags } });
    }
  };

  const handleSupportToggle = (serv: string) => {
    const current = [...market.afterSalesSupport.services];
    const updated = current.includes(serv) ? current.filter((s) => s !== serv) : [...current, serv];
    updateMarket({
      afterSalesSupport: { ...market.afterSalesSupport, services: updated },
    });
  };

  const handleBuyerPersonaChange = (fieldset: Partial<typeof market.targetBuyerPersona>) => {
    updateMarket({
      targetBuyerPersona: { ...market.targetBuyerPersona, ...fieldset },
    });
  };

  const addBlacklistRegion = () => {
    const updated = [
      ...market.blacklistRegions,
      {
        id: 'bl_' + Date.now(),
        country: '伊朗',
        reasonType: '合规/合规冲突',
        remark: '国际结算合规审查限制',
      },
    ];
    updateMarket({ blacklistRegions: updated });
  };

  const removeBlacklistRegion = (id: string) => {
    updateMarket({ blacklistRegions: market.blacklistRegions.filter((b) => b.id !== id) });
  };

  const handleBlacklistRegionChange = (id: string, fieldset: Partial<typeof market.blacklistRegions[0]>) => {
    updateMarket({
      blacklistRegions: market.blacklistRegions.map((b) => (b.id === id ? { ...b, ...fieldset } : b)),
    });
  };

  const addOverseasCase = () => {
    const updated = [
      ...market.overseasCases,
      {
        id: 'oc_' + Date.now(),
        country: '德国',
        clientType: '知名零售终端',
        yearsPartnered: 3,
        scenario: '',
        isAuthorized: true,
      },
    ];
    updateMarket({ overseasCases: updated });
  };

  const removeOverseasCase = (id: string) => {
    updateMarket({ overseasCases: market.overseasCases.filter((oc) => oc.id !== id) });
  };

  const handleOverseasCaseChange = (id: string, fieldset: Partial<typeof market.overseasCases[0]>) => {
    updateMarket({
      overseasCases: market.overseasCases.map((oc) => (oc.id === id ? { ...oc, ...fieldset } : oc)),
    });
  };

  switch (nodeId) {
    case 'blacklistRegions':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">不接单/限售/黑名单目标客户地区（选填）</label>
              <p className="text-[10px] text-slate-550">已申报个案: <span className="font-bold text-amber-500">{market.blacklistRegions.length}</span> 个</p>
            </div>
            <button
              type="button"
              onClick={addBlacklistRegion}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 添加地区
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {market.blacklistRegions.map((bl, ibl) => (
              <div key={bl.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-850 pb-1 text-slate-500">
                  <span className="font-bold text-amber-450">限制/禁售地区 #0{ibl + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBlacklistRegion(bl.id)}
                    className="text-[10px] hover:text-red-400"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">国别或禁售地区</span>
                    <input
                      type="text"
                      value={bl.country}
                      onChange={(e) => handleBlacklistRegionChange(bl.id, { country: e.target.value })}
                      placeholder="例如：朝鲜, 叙利亚"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none focus:border-amber-530"
                    />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">管控或拒供原因背景</span>
                    <select
                      value={bl.reasonType}
                      onChange={(e) => handleBlacklistRegionChange(bl.id, { reasonType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white"
                    >
                      <option value="合规/合规冲突">地缘政治/军事防卫合规冲突</option>
                      <option value="回款风险高">底盘资金风险（死产呆账/拒兑呆账）</option>
                      <option value="缺少对应清关专项准入资质">缺少CE/FDA国家特定行业强制资质</option>
                      <option value="物流禁运/不可抗拒阻碍">海事集装箱禁运难发（偏港）</option>
                    </select>
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 mb-1">官方对该区拒保声明</span>
                  <textarea
                    value={bl.remark}
                    onChange={(e) => handleBlacklistRegionChange(bl.id, { remark: e.target.value })}
                    rows={2}
                    placeholder="例如：由于国际回扣等清算链条冻结，我厂不接任何来自非认证注册的第三方清款业务..."
                    className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'domesticCompetitors':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">国内最核心对标竞品对标信息录入（知己知彼，选填）</label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-xs text-slate-400 mb-1">国内追赶同行公司全称</span>
                <input
                  type="text"
                  value={market.domesticCompetitors[0]?.name || ''}
                  onChange={(e) => {
                    const fresh = [...market.domesticCompetitors];
                    fresh[0] = { ...fresh[0], name: e.target.value, id: 'dc_1', brand: '', socialLinks: {} };
                    updateMarket({ domesticCompetitors: fresh });
                  }}
                  placeholder="例：广东XX制造集团"
                  className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                />
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-1">竞品官方网站或社媒链接 (URL)</span>
                <input
                  type="url"
                  value={market.domesticCompetitors[0]?.website || ''}
                  onChange={(e) => {
                    const fresh = [...market.domesticCompetitors];
                    fresh[0] = { ...fresh[0], website: e.target.value, id: 'dc_1', brand: '', socialLinks: {} };
                    updateMarket({ domesticCompetitors: fresh });
                  }}
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'foreignCompetitors':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">国际外贸一流对标标杆巨商（视线超前，选填）</label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-xs text-slate-400 mb-1">国外顶级的竞争公司名称</span>
                <input
                  type="text"
                  value={market.foreignCompetitors[0]?.name || ''}
                  onChange={(e) => {
                    const fresh = [...market.foreignCompetitors];
                    fresh[0] = { ...fresh[0], name: e.target.value, id: 'fc_1', country: '德国', website: '', socialLinks: {} };
                    updateMarket({ foreignCompetitors: fresh });
                  }}
                  placeholder="例：Woll Cookware GmbH"
                  className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                />
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-1">国外标杆官网 URL</span>
                <input
                  type="url"
                  value={market.foreignCompetitors[0]?.website || ''}
                  onChange={(e) => {
                    const fresh = [...market.foreignCompetitors];
                    fresh[0] = { ...fresh[0], website: e.target.value, id: 'fc_1', country: '德国', socialLinks: {} };
                    updateMarket({ foreignCompetitors: fresh });
                  }}
                  placeholder="https://www.woll.de"
                  className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'overseasCases':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">海外客户大型落地/采购合作见证项目列表 (选填)</label>
              <p className="text-[10px] text-slate-550">已申报项目: <span className="font-bold text-amber-500">{market.overseasCases.length}</span> 个</p>
            </div>
            <button
              type="button"
              onClick={addOverseasCase}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 添加案例
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {market.overseasCases.map((oc, ioc) => (
              <div key={oc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-850 pb-1 text-slate-500">
                  <span className="font-bold text-amber-450">落地案例 #0{ioc + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeOverseasCase(oc.id)}
                    className="text-[10px] hover:text-red-400"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">目标国别</span>
                    <input
                      type="text"
                      value={oc.country}
                      onChange={(e) => handleOverseasCaseChange(oc.id, { country: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">采购商类型</span>
                    <input
                      type="text"
                      value={oc.clientType}
                      onChange={(e) => handleOverseasCaseChange(oc.id, { clientType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white md:font-semibold"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">合作维持年数</span>
                    <input
                      type="number"
                      min={1}
                      value={oc.yearsPartnered}
                      onChange={(e) => handleOverseasCaseChange(oc.id, { yearsPartnered: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">授权允许公开</span>
                    <select
                      value={oc.isAuthorized ? 'yes' : 'no'}
                      onChange={(e) => handleOverseasCaseChange(oc.id, { isAuthorized: e.target.value === 'yes' })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white font-semibold"
                    >
                      <option value="yes">授权公开案例</option>
                      <option value="no">匿名掩饰敏感字</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 mb-0.5">合作工程场景或履单细节精述</span>
                  <input
                    type="text"
                    value={oc.scenario}
                    onChange={(e) => handleOverseasCaseChange(oc.id, { scenario: e.target.value })}
                    placeholder="例如：为德国最大厨具商Woll代工代工高抛光大汤锅系列，累计无质量客诉通关出货30万套。"
                    className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'marketMatrix':

    case 'marketMatrix':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">主推销售市场与核心推广机型/产品精准匹配</h3>
            <button
              type="button"
              onClick={addMatrixRow}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新增销售配
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {market.marketMatrix.map((mm) => (
              <div key={mm.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row gap-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">主攻市场划分</span>
                    <select
                      value={mm.marketRegion}
                      onChange={(e) => handleMatrixChange(mm.id, { marketRegion: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                    >
                      {['北美', '欧洲', '中东', '东南亚', '南美', '非洲', '独联体', '澳新地区'].map((re) => (
                        <option key={re} value={re}>{re}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">主力装配推广机型</span>
                    <input
                      type="text"
                      value={mm.featuredProduct}
                      onChange={(e) => handleMatrixChange(mm.id, { featuredProduct: e.target.value })}
                      placeholder="如：CR-SP32 镜面高亮汤锅"
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <span className="block text-[10px] text-slate-500 mb-0.5">主攻该地区背景原因精述</span>
                      <input
                        type="text"
                        value={mm.reason}
                        onChange={(e) => handleMatrixChange(mm.id, { reason: e.target.value })}
                        placeholder="例：产品取得了FDA及ETL食品安全等级验证且北美家庭偏爱大体积高抛光大汤锅。"
                        className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMatrixRow(mm.id)}
                      className="text-slate-500 hover:text-red-400 p-1 shrink-0 self-end mb-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'keywordsSet':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">出口外贸行业多语系关键词部署（回车或英文逗号作为隔断）</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-slate-400 mb-1.5">中文推广备选核心关键词</span>
              <textarea
                onChange={(e) => handleKeywordChange('cn', e.target.value)}
                value={market.keywordsSet.cnKeywords.join(', ')}
                rows={4}
                placeholder="例：智能传感器模块, 双频射频主板, 高灵敏控制器..."
                className="w-full bg-slate-950 border border-slate-750 p-2 text-white font-sans rounded resize-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">输入以逗号、每行回车分隔</p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex justify-between font-bold text-slate-400 mb-1.5">
                <span>英文 SEO 外贸主推关键词 (强制要求不低于 10 个)</span>
                <span className="text-amber-500 font-mono">{market.keywordsSet.enKeywords.length} 个已加</span>
              </div>
              <textarea
                onChange={(e) => handleKeywordChange('en', e.target.value)}
                value={market.keywordsSet.enKeywords.join(', ')}
                rows={4}
                placeholder="e.g., stainless steel coil, premium cookware, wholesale soup pot..."
                className="w-full bg-slate-950 border border-slate-755 p-2 text-white font-mono rounded resize-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">英文外导直通及推广重点词库索引</p>
            </div>
          </div>
        </div>
      );

    case 'repurchaseReasons':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">真实买家满意反馈、复购证言及赞赏截图（打码机制）</label>
              <p className="text-[10.5px] text-slate-500">满足质量门槛：至少提供 <span className="font-bold text-emerald-400">1</span> 组拼图大货截图验证</p>
            </div>
            <button
              type="button"
              onClick={addQuotesRow}
              className="bg-slate-800 text-amber-505 hover:bg-slate-705 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 添加证言
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {market.repurchaseReasons.quotes.map((q) => (
              <div key={q.id} className="p-3 bg-slate-900 border border-slate-850 rounded-lg space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="col-span-1 lg:col-span-2">
                    <span className="block text-[10px] text-slate-500 mb-0.5">买家口语体原话中文自述 (不低于10字)</span>
                    <input
                      type="text"
                      value={q.rawQuotesCn}
                      onChange={(e) => handleQuotesChange(q.id, { rawQuotesCn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                      placeholder="“该厂家的交货及时率与响应配合极佳，器件质量检验很严，完全符合我们预期标准。”"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">对应的英文口语体翻译</span>
                    <input
                      type="text"
                      value={q.quotesEn}
                      onChange={(e) => handleQuotesChange(q.id, { quotesEn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white font-mono"
                      placeholder="e.g., Guoxun's delivery consistency and cooperation is exceptional..."
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">买家所在国别地区</span>
                    <input
                      type="text"
                      value={q.clientCountry}
                      onChange={(e) => handleQuotesChange(q.id, { clientCountry: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                      placeholder="如：德国 / 美国"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">买家在 WhatsApp / 邮件 / 旺旺大加表扬打码屏幕截图</span>
                    <FileUploader
                      accept=".jpg,.jpeg,.png"
                      maxSizeMb={5}
                      value={q.screenshotMeta}
                      onChange={(meta) => handleQuotesChange(q.id, { screenshotMeta: meta })}
                      onPreview={onPreview}
                      fieldId={`quotes_screenshot_${q.id}`}
                      label="绑定并上传大货好评打码屏幕截图 (≤5MB)"
                    />
                  </div>
                  <div className="p-3 bg-slate-950 rounded flex flex-col justify-between text-[11px] text-slate-500">
                    <p className="leading-snug">🔒 诚信打码机制提醒：上传相关聊天记录或账单时，技术团队建议您对敏感资金价格、海外邮箱名字在手机图册修改时做马赛克脱敏打码，避免商业合规冲突限制。</p>
                    <label className="flex items-center gap-1.5 select-none cursor-pointer text-white font-semibold mt-2">
                      <input
                        type="checkbox"
                        checked={q.signatureAllowed}
                        onChange={(e) => handleQuotesChange(q.id, { signatureAllowed: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>许可本金品报告及出街影片公示署名国别</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'afterSalesSupport':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">承诺售后保障保障具体服务项目</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              '3年质保（需追加填报期数，如3年）',
              '无偿调配损耗件与备品备件',
              '提供1V1全天候双语远程客服支持',
              '缺陷五星评级极速海外仓换新服务',
              '出差工程上门测绘与安装指导',
              '全流程录像教学视频技术解密',
            ].map((se) => {
              const active = market.afterSalesSupport.services.includes(se);
              return (
                <label
                  key={se}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    active
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => handleSupportToggle(se)}
                    className="accent-amber-500"
                  />
                  <span>{se}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'commonMisconceptions':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">买家高频传统认知误解、排雷与专业澄清解释 (金句组合)</label>
              <p className="text-[10px] text-slate-500">作为后期制片“辟谣干货、大厂权威反转”的剧情核心痛点来源 (最多5组)</p>
            </div>
            {market.commonMisconceptions.length < 5 && (
              <button
                type="button"
                onClick={addMisconception}
                className="bg-slate-800 text-amber-500 hover:bg-slate-705 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
              >
                <Plus size={14} /> 新加对照
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {market.commonMisconceptions.map((mis, im) => (
              <div key={mis.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between font-bold text-xs uppercase text-slate-500 border-b border-slate-850 pb-1.5">
                  <span>误解澄清组件组 #0{im + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMisconception(mis.id)}
                    className="text-[10px] text-slate-500 hover:text-red-400 p-0.5"
                  >
                    卸载移除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">❌ 客户买家惯性思维以为...（痛点迷思）</span>
                    <textarea
                      value={mis.misconception}
                      onChange={(e) => handleMisconceptionChange(mis.id, { misconception: e.target.value })}
                      rows={2}
                      placeholder="例：防锈或产品的防腐寿命纯粹看金属外壳够不够厚。"
                      className="w-full bg-slate-950 border border-slate-750 rounded p-2 text-white resize-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-emerald-400 mb-1">💡 实际上我厂权威工艺澄清...（核心反击）</span>
                    <textarea
                      value={mis.clarification}
                      onChange={(e) => handleMisconceptionChange(mis.id, { clarification: e.target.value })}
                      rows={2}
                      placeholder="例：其实，决定防氧化极限取决于材质中合金铬镍(Cr,Ni)百分之添加配比，及高温退火时的氧化皮油脂厚度保护。"
                      className="w-full bg-slate-950 border border-slate-755 rounded p-2 text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'targetBuyerPersona':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">理想大买家商业画像 & 反向黑红线屏蔽</label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-350">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <span className="block font-bold text-slate-400">① 理想买家类型匹配</span>
              <div className="space-y-1">
                {['Brand (海外独立大牌)', 'Trader (高频复购中间商)', 'Factory (采购重投生产大厂)'].map((bt) => {
                  const has = market.targetBuyerPersona.idealTypes.includes(bt);
                  return (
                    <label key={bt} className="flex items-center gap-1.5 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={has}
                        onChange={() => {
                          const temp = [...market.targetBuyerPersona.idealTypes];
                          const updated = has ? temp.filter((t) => t !== bt) : [...temp, bt];
                          handleBuyerPersonaChange({ idealTypes: updated });
                        }}
                        className="accent-amber-500"
                      />
                      <span>{bt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
              <div>
                <span className="block font-bold text-slate-400 mb-1">② 期望合理预算/大单起买门槛</span>
                <input
                  type="text"
                  value={market.targetBuyerPersona.idealVolume}
                  onChange={(e) => handleBuyerPersonaChange({ idealVolume: e.target.value })}
                  placeholder="例：首笔3至5万美元，后期季度高保柜货"
                  className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal mt-1">设置采购门槛，筛查无关零采购试探咨询</p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-slate-404 mb-2">③ 理想对接主管角色职务</span>
              <div className="space-y-1">
                {['采购总监 (Procurement Director)', '研发技术总经理 (R&D Leader)', '首席工程师 (Chief Engineer)'].map((idr) => {
                  const inside = market.targetBuyerPersona.idealDecisionRoles.includes(idr);
                  return (
                    <label key={idr} className="flex items-center gap-1.5 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inside}
                        onChange={() => {
                          const list = [...market.targetBuyerPersona.idealDecisionRoles];
                          const updated = inside ? list.filter((l) => l !== idr) : [...list, idr];
                          handleBuyerPersonaChange({ idealDecisionRoles: updated });
                        }}
                        className="accent-amber-500"
                      />
                      <span>{idr}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 animate-in slide-in duration-300">
            <span className="block text-xs font-bold text-slate-405 mb-1.5">📢 负向买家屏蔽红线（反向黑名单排雷，不低于 20 个汉字）</span>
            <textarea
              value={market.targetBuyerPersona.nonIdealPersona}
              onChange={(e) => handleBuyerPersonaChange({ nonIdealPersona: e.target.value })}
              rows={3}
              placeholder="例：单次采购小于50pcs以下的小店散货及一件代发代发，需要我司垫付大笔海关关税的冷偏试探盘，无法自行解决清关及国际海事申报的无资质商家。"
              className="w-full bg-slate-900 border border-slate-705 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 h-auto"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
