/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage3Production({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { production } = formData;

  const updateProduction = (fieldset: Partial<typeof production>) => {
    onChange((prev) => ({
      ...prev,
      production: { ...prev.production, ...fieldset },
    }));
  };

  const addHsCode = () => {
    const updated = [
      ...production.hsCodes,
      { id: 'hs_' + Date.now(), code: '', prodNameCn: '', isFeatured: false },
    ];
    updateProduction({ hsCodes: updated });
  };

  const removeHsCode = (id: string) => {
    updateProduction({ hsCodes: production.hsCodes.filter((h) => h.id !== id) });
  };

  const handleHsCodeChange = (id: string, fieldset: Partial<typeof production.hsCodes[0]>) => {
    updateProduction({
      hsCodes: production.hsCodes.map((h) => (h.id === id ? { ...h, ...fieldset } : h)),
    });
  };

  const addProduct = () => {
    const updated = [
      ...production.featuredProducts,
      {
        id: 'p_' + Date.now(),
        nameCn: '',
        nameEn: '',
        model: '',
        params: '',
        priceMin: 10,
        priceMax: 100,
        unit: 'pcs',
        targetMarket: '全球',
      },
    ];
    updateProduction({ featuredProducts: updated });
  };

  const removeProduct = (id: string) => {
    updateProduction({
      featuredProducts: production.featuredProducts.filter((p) => p.id !== id),
    });
  };

  const handleProductChange = (id: string, fieldset: Partial<typeof production.featuredProducts[0]>) => {
    updateProduction({
      featuredProducts: production.featuredProducts.map((p) => (p.id === id ? { ...p, ...fieldset } : p)),
    });
  };

  const addLine = () => {
    const updated = [...production.productionLines, { id: 'l_' + Date.now(), name: '', qty: 1, isExclusive: false }];
    updateProduction({ productionLines: updated });
  };

  const removeLine = (id: string) => {
    updateProduction({ productionLines: production.productionLines.filter((l) => l.id !== id) });
  };

  const handleLineChange = (id: string, fieldset: Partial<typeof production.productionLines[0]>) => {
    updateProduction({
      productionLines: production.productionLines.map((l) => (l.id === id ? { ...l, ...fieldset } : l)),
    });
  };

  const addEquipment = () => {
    const updated = [
      ...production.keyEquipments,
      { id: 'e_' + Date.now(), name: '', advantage: '', isFirstInClass: 'no' },
    ];
    updateProduction({ keyEquipments: updated });
  };

  const removeEquipment = (id: string) => {
    updateProduction({ keyEquipments: production.keyEquipments.filter((e) => e.id !== id) });
  };

  const handleEquipmentChange = (id: string, fieldset: Partial<typeof production.keyEquipments[0]>) => {
    updateProduction({
      keyEquipments: production.keyEquipments.map((e) => (e.id === id ? { ...e, ...fieldset } : e)),
    });
  };

  const handleCategoryToggle = (cat: string) => {
    const current = [...production.mainCategories];
    if (current.includes(cat)) {
      updateProduction({ mainCategories: current.filter((c) => c !== cat) });
    } else {
      updateProduction({ mainCategories: [...current, cat] });
    }
  };

  switch (nodeId) {
    case 'mainCategories':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">主营产品三级核心行业类目</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              '智能传感器集成板',
              '控制系统射频主板',
              '高性能合金机身壳',
              '电能传输转接端子',
              '精密模具开发组件',
              '智能消费电子壳体',
              '精密温湿控感应器',
              '定制防雷抗噪组件',
            ].map((cat) => {
              const checked = production.mainCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    checked
                      ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCategoryToggle(cat)}
                    className="accent-amber-500"
                  />
                  <span>{cat}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500">根据阿里旺铺一级主营、及本次金品审核报告重点呈现的核心三级类目勾选。</p>
        </div>
      );

    case 'hsCodes':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-white">海关HS编码备案 (多行申报)</label>
            <button
              type="button"
              onClick={addHsCode}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-all inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新加 HS
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {production.hsCodes.map((h, i) => (
              <div key={h.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                  <div>
                    <input
                      type="text"
                      maxLength={10}
                      value={h.code}
                      onChange={(e) => handleHsCodeChange(h.id, { code: e.target.value.replace(/\D/g, '') })}
                      placeholder="HS数字编码 (6/8/10位)"
                      className="w-full bg-slate-950 border border-slate-755 text-xs text-white p-2 rounded focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={h.prodNameCn}
                      onChange={(e) => handleHsCodeChange(h.id, { prodNameCn: e.target.value })}
                      placeholder="对应产品中文申报名称"
                      className="w-full bg-slate-950 border border-slate-755 text-xs text-white p-2 rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between pl-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-400 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={h.isFeatured}
                        onChange={(e) => handleHsCodeChange(h.id, { isFeatured: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>设定为本季主推</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeHsCode(h.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
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

    case 'eCatalogs':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">企业最新产品电子图册 (Catalog PDF)</label>
          <FileUploader
            accept=".pdf"
            maxSizeMb={50}
            value={production.eCatalogs[0]}
            onChange={(meta) => updateProduction({ eCatalogs: meta ? [meta] : [] })}
            onPreview={onPreview}
            fieldId="catalog_main"
            label="拖拽或选择中/外文电子画册文件 (限PDF，最大50M)"
          />
        </div>
      );

    case 'featuredProducts':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">本季核心爆款/主推展示产品 (要求3—5款)</label>
              <p className="text-[10px] text-slate-500">当前已添加: <span className="font-bold text-amber-500">{production.featuredProducts.length}</span> 款</p>
            </div>
            {production.featuredProducts.length < 5 && (
              <button
                type="button"
                onClick={addProduct}
                className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-all inline-flex items-center gap-1 leading-none"
              >
                <Plus size={14} /> 添加主打款
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {production.featuredProducts.map((p, idx) => (
              <div key={p.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-amber-400">#0{idx + 1} 推广爆款设计</span>
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id)}
                    className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-0.5"
                  >
                    <Trash2 size={12} /> 移除
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">产品中文名称</span>
                    <input
                      type="text"
                      value={p.nameCn}
                      onChange={(e) => handleProductChange(p.id, { nameCn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">英文外贸推广名称</span>
                    <input
                      type="text"
                      value={p.nameEn}
                      onChange={(e) => handleProductChange(p.id, { nameEn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">规格型号</span>
                    <input
                      type="text"
                      value={p.model}
                      onChange={(e) => handleProductChange(p.id, { model: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">主要物理/材质特性</span>
                    <input
                      type="text"
                      value={p.params}
                      onChange={(e) => handleProductChange(p.id, { params: e.target.value })}
                      placeholder="如：18/10精密抛光"
                      className="w-full bg-slate-950 border border-slate-750 p-1.5 rounded text-white"
                    />
                  </div>
                </div>

                {/* Min-Max Sliders and and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-2 bg-slate-950 rounded border border-slate-850">
                    <span className="block text-[10px] text-slate-400 mb-1">FOB 批发价区间 (美金)</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={p.priceMin}
                        onChange={(e) => handleProductChange(p.id, { priceMin: Math.max(0, parseFloat(e.target.value) || 0) })}
                        placeholder="Min"
                        className="w-16 bg-slate-900 text-xs border p-1 rounded font-mono text-center text-white"
                      />
                      <span className="text-slate-500 font-bold">-</span>
                      <input
                        type="number"
                        value={p.priceMax}
                        onChange={(e) => handleProductChange(p.id, { priceMax: Math.max(0, parseFloat(e.target.value) || 0) })}
                        placeholder="Max"
                        className="w-16 bg-slate-900 text-xs border p-1 rounded font-mono text-center text-white"
                      />
                      <input
                        type="text"
                        value={p.unit}
                        onChange={(e) => handleProductChange(p.id, { unit: e.target.value })}
                        placeholder="单位"
                        className="w-12 bg-slate-900 text-xs border p-1 rounded text-center text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">主打销售海外市场</span>
                    <input
                      type="text"
                      value={p.targetMarket}
                      onChange={(e) => handleProductChange(p.id, { targetMarket: e.target.value })}
                      placeholder="例如：北美 / 欧盟"
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="block text-[9px] text-slate-500 mb-0.5">白底效果主图</span>
                      <FileUploader
                        accept=".jpg,.jpeg,.png"
                        maxSizeMb={10}
                        value={p.whiteBgPhoto}
                        onChange={(meta) => handleProductChange(p.id, { whiteBgPhoto: meta })}
                        onPreview={onPreview}
                        fieldId={`prod_white_${p.id}`}
                        label="传图"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[9px] text-slate-500 mb-0.5">工场景深实拍图</span>
                      <FileUploader
                        accept=".jpg,.jpeg,.png"
                        maxSizeMb={10}
                        value={p.scenePhoto}
                        onChange={(meta) => handleProductChange(p.id, { scenePhoto: meta })}
                        onPreview={onPreview}
                        fieldId={`prod_scene_${p.id}`}
                        label="传图"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'productionLines':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">厂内车间物理产线配置情况 (工艺线名称与规模)</h3>
            <button
              type="button"
              onClick={addLine}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-all inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新加生产线
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {production.productionLines.map((l) => (
              <div key={l.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                <div className="flex-1 flex flex-col md:flex-row gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => handleLineChange(l.id, { name: e.target.value })}
                      placeholder="产线工艺名称，如：高精密自动SMT表面贴片生产线"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs text-white rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950 px-2 rounded border border-slate-750 shrink-0">
                    <span className="text-[10px] text-slate-400">产线数量:</span>
                    <input
                      type="number"
                      min={1}
                      value={l.qty}
                      onChange={(e) => handleLineChange(l.id, { qty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-12 bg-slate-900 border text-center font-mono text-white text-xs p-1 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 select-none">
                  <label className="flex items-center gap-1 cursor-pointer text-xs text-slate-450 pr-1 border-r border-slate-850">
                    <input
                      type="checkbox"
                      checked={l.isExclusive}
                      onChange={(e) => handleLineChange(l.id, { isExclusive: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span>独家专有产线</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLine(l.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'newProductsYearly':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">每年自主上新研发的新款数量</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              value={production.newProductsYearly || ''}
              onChange={(e) => updateProduction({ newProductsYearly: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm w-28 text-center"
            />
            <span className="text-xs text-slate-400">款 (设计研发新品、开模上新数级)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed italic">注：若您的工厂主要针对来样来图的纯定制代工(OEM)，此处数量可填 0 款。</p>
        </div>
      );

    case 'keyEquipments':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">厂内拥有核心重型专有设备资产 (Hard Power，限10台)</label>
              <p className="text-[10.5px] text-slate-500">已登记: <span className="font-bold text-amber-500">{production.keyEquipments.length}</span> / 10 台</p>
            </div>
            {production.keyEquipments.length < 10 && (
              <button
                type="button"
                onClick={addEquipment}
                className="bg-slate-800 text-amber-505 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-all inline-flex items-center gap-1 leading-none"
              >
                <Plus size={14} /> 登记新设备
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {production.keyEquipments.map((eq, ieq) => (
              <div key={eq.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="col-span-1 lg:col-span-2">
                    <span className="block text-[10px] text-slate-500 mb-0.5">设备名称及材质核心规格</span>
                    <input
                      type="text"
                      value={eq.name}
                      onChange={(e) => handleEquipmentChange(eq.id, { name: e.target.value })}
                      placeholder="如：德国原装纵剪薄刃精分条机"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">全球或国内首创判定</span>
                    <select
                      value={eq.isFirstInClass}
                      onChange={(e) => handleEquipmentChange(eq.id, { isFirstInClass: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 text-xs rounded text-white font-semibold"
                    >
                      <option value="no">行业标准高精设备</option>
                      <option value="domestic">国内自主首创设备</option>
                      <option value="global">全球顶尖科研首创</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pl-1">
                    <label className="flex items-center gap-1 text-[10px] text-slate-400 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eq.isVideo}
                        onChange={(e) => handleEquipmentChange(eq.id, { isVideo: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>附运运转小视频</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeEquipment(eq.id)}
                      className="text-slate-550 hover:text-red-400 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">一句话竞争核心效率优势 (≤80字)</span>
                    <textarea
                      value={eq.advantage}
                      onChange={(e) => handleEquipmentChange(eq.id, { advantage: e.target.value })}
                      rows={2}
                      maxLength={80}
                      placeholder="例：成型及切割公差控制在±0.005mm内，保障亮退表面边缘不裂口、无刺伤。"
                      className="w-full bg-slate-950 border border-slate-755 text-xs rounded p-2 text-white h-auto resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">设备现场运转照片 (或小视频)</span>
                    <FileUploader
                      accept={eq.isVideo ? '.mp4,.mov,.avi' : '.jpg,.jpeg,.png'}
                      maxSizeMb={eq.isVideo ? 200 : 20}
                      value={eq.fileMeta}
                      onChange={(meta) => handleEquipmentChange(eq.id, { fileMeta: meta })}
                      onPreview={onPreview}
                      fieldId={`equip_file_${eq.id}`}
                      label={eq.isVideo ? "上传运转短视频 (≤200MB)" : "上传设备外观图 (≤20MB)"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'supplyChainRatio':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">生产加工产业链自主率形式</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              { key: 'full', label: '全产业链自主制造生产' },
              { key: 'core', label: '核心/精工核心工艺自制，普通组装外协' },
              { key: 'assembly', label: '贴牌、纯组装表面电火及二次处理' },
            ].map((el) => {
              const active = production.supplyChainRatio.model === el.key;
              return (
                <button
                  key={el.key}
                  type="button"
                  onClick={() => updateProduction({ supplyChainRatio: { ...production.supplyChainRatio, model: el.key } })}
                  className={`p-3 border rounded-lg text-xs leading-normal font-semibold text-center transition-all ${
                    active
                      ? 'border-amber-505 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-900 text-slate-450 hover:text-white'
                  }`}
                >
                  {el.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-455 mb-1.5">披露主要原材料供应基地与采购比例情况（不低于30字/上限300字）</span>
            <textarea
              value={production.supplyChainRatio.rawMaterialsSource}
              onChange={(e) => updateProduction({ supplyChainRatio: { ...production.supplyChainRatio, rawMaterialsSource: e.target.value } })}
              rows={3}
              placeholder="例：我厂生产所需的高规格核心芯片及原材料基础元组件，主要采购于行业头部知名原料大厂，供应商渠道正规可追溯。核心热控模组组件由专供外采，具有极高的品质与供货稳定性。"
              className="w-full bg-slate-900 border border-slate-705 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 h-auto"
            />
          </div>
        </div>
      );

    case 'oemOdmCapacity':
      return (
        <div className="space-y-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div>
              <p className="font-bold text-sm text-white">公司是否开通并具备 OEM/ODM 打样定制承接能力？</p>
              <p className="text-[10px] text-slate-500">打开后，金品体系将全面展现模具打样流速指标。</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={production.oemOdmCapacity.enabled}
                onChange={(e) => updateProduction({ oemOdmCapacity: { ...production.oemOdmCapacity, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-slate-900" />
            </label>
          </div>

          {production.oemOdmCapacity.enabled && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1.5">支持定制具体类型</span>
                  <div className="flex gap-2">
                    {['OEM (代工)', 'ODM (原创设计自主开发)', 'JDM (联合研发)'].map((mode) => {
                      const contains = production.oemOdmCapacity.types.includes(mode);
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            const current = [...production.oemOdmCapacity.types];
                            const updated = contains ? current.filter((m) => m !== mode) : [...current, mode];
                            updateProduction({ oemOdmCapacity: { ...production.oemOdmCapacity, types: updated } });
                          }}
                          className={`flex-1 py-1.5 px-2 border rounded text-[10.5px] font-semibold transition-colors ${
                            contains
                              ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                              : 'border-slate-750 bg-slate-950 text-slate-450 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1.5">预估CAD深化制版及首样打样周期</span>
                  <select
                    value={production.oemOdmCapacity.duration}
                    onChange={(e) => updateProduction({ oemOdmCapacity: { ...production.oemOdmCapacity, duration: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-755 text-xs p-2 text-white rounded focus:border-amber-500"
                  >
                    <option value="≤7天">极速打样 (≤7天)</option>
                    <option value="8-15天">常规设计制版打样 (8-15天)</option>
                    <option value="16-30天">特种开模试水 (16-30天)</option>
                    <option value="30天以上">特种重型装备定制研发 (30天+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-slate-450 mb-1">设计制版、打样及量产业务流流转精述</span>
                  <textarea
                    value={production.oemOdmCapacity.flowDescription}
                    onChange={(e) => updateProduction({ oemOdmCapacity: { ...production.oemOdmCapacity, flowDescription: e.target.value } })}
                    rows={2}
                    placeholder="例如：1. 客户提供设计3D图纸 -> 2. 研发部优化并快速打印树脂手板 -> 3. 数控中心进行精密试模打样 -> 4. 气密压力与老化可靠性测试 -> 5. 发送测试报告并拍照交付客户核发样品。"
                    className="w-full bg-slate-950 border border-slate-750 rounded p-2 text-xs text-white resize-none leading-relaxed"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-450 mb-1">定制化首单起订门槛限制（最小MOQ，单位pcs）</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={production.oemOdmCapacity.minOrderQty || ''}
                      onChange={(e) => updateProduction({ oemOdmCapacity: { ...production.oemOdmCapacity, minOrderQty: Math.max(0, parseInt(e.target.value, 15) || 0) } })}
                      className="bg-slate-950 border border-slate-750 p-2 text-xs text-white rounded w-28 font-mono text-center"
                    />
                    <span className="text-xs text-slate-450">pcs (满足单次设计投模及机器开机损耗核算)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
