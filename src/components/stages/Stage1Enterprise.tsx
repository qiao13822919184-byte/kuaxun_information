/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage1Enterprise({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { enterprise } = formData;

  const updateEnterprise = (fieldset: Partial<typeof enterprise>) => {
    onChange((prev) => ({
      ...prev,
      enterprise: { ...prev.enterprise, ...fieldset },
    }));
  };

  const handleBrandChange = (index: number, val: string) => {
    const updated = [...enterprise.brandEn];
    updated[index] = val.toUpperCase().replace(/[^A-Z0-9\s/-]/g, ''); // alphanumeric capital letters
    updateEnterprise({ brandEn: updated });
  };

  const addBrand = () => {
    updateEnterprise({ brandEn: [...enterprise.brandEn, ''] });
  };

  const removeBrand = (index: number) => {
    const updated = enterprise.brandEn.filter((_, i) => i !== index);
    updateEnterprise({ brandEn: updated.length === 0 ? [''] : updated });
  };

  const handleLogoSloganChange = (fieldset: Partial<typeof enterprise.logoHexSlogan>) => {
    updateEnterprise({
      logoHexSlogan: { ...enterprise.logoHexSlogan, ...fieldset },
    });
  };

  const handleAddressChange = (fieldset: Partial<typeof enterprise.addressCascade>) => {
    updateEnterprise({
      addressCascade: { ...enterprise.addressCascade, ...fieldset },
    });
  };

  // Render individual screen depending on the node in focus
  switch (nodeId) {
    case 'cnName':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">公司中文全称</label>
          <input
            type="text"
            value={enterprise.cnName}
            onChange={(e) => updateEnterprise({ cnName: e.target.value })}
            placeholder="例：深圳市国迅制造有限公司（须与营业执照完全一致）"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 text-sm"
          />
          <div className="p-3 bg-slate-900 border-l-4 border-slate-700 text-xs text-slate-400 rounded-r">
            填写提示：名称须具有特定含义，且应与营业执照上的登记名称100%匹配，否则系统将阻拦备案核查。
          </div>
        </div>
      );

    case 'enName':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">公司英文名称</label>
          <input
            type="text"
            value={enterprise.enName}
            onChange={(e) => updateEnterprise({ enName: e.target.value })}
            placeholder="例：Guangdong Chuangrui Stainless Steel Co., Ltd."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 text-sm font-mono"
          />
          <p className="text-[11px] text-slate-500">仅限输入规范全半角英文字母、英文特殊符号以及空格、横杠。</p>
        </div>
      );

    case 'brandEn':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">英文主副推广品牌名称</label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {enterprise.brandEn.map((brand, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => handleBrandChange(idx, e.target.value)}
                  placeholder={`英文品牌名称 ${idx + 1}`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 text-sm font-semibold tracking-wider"
                />
                {enterprise.brandEn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBrand(idx)}
                    className="p-3 border border-red-900 hover:bg-red-950 text-red-400 rounded-lg transition-colors shrink-0"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBrand}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-amber-500 px-4 py-2 rounded-lg text-xs font-semibold transition-colors mt-2"
          >
            <Plus size={14} /> 添加副推广品牌
          </button>
        </div>
      );

    case 'logoHexSlogan':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">品牌Logo文件 (SVG / PNG / AI)</label>
              <FileUploader
                accept=".svg,.png,.ai,.eps,.jpg"
                maxSizeMb={10}
                value={enterprise.logoHexSlogan.logoMeta}
                onChange={(meta) => handleLogoSloganChange({ logoMeta: meta })}
                onPreview={onPreview}
                fieldId="enterprise_logo"
                label="上传高清Logo（支持透明底PNG/AI）"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">品牌主基色 HEX 码</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={enterprise.logoHexSlogan.colorHex}
                  onChange={(e) => handleLogoSloganChange({ colorHex: e.target.value })}
                  className="w-12 h-11 bg-slate-900 border border-slate-700 rounded-lg p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={enterprise.logoHexSlogan.colorHex}
                  onChange={(e) => handleLogoSloganChange({ colorHex: e.target.value })}
                  placeholder="#C8102E"
                  maxLength={7}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 text-sm font-mono tracking-wider"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">此色彩将联动注入至报告 PDF 及表单高光中，强化金品报告一致性。</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">主宣传 Slogan 口号 (中文)</label>
              <input
                type="text"
                value={enterprise.logoHexSlogan.sloganCn}
                onChange={(e) => handleLogoSloganChange({ sloganCn: e.target.value })}
                placeholder="例：源自源头 · 精于钢制"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">主宣传 Slogan 口号 (英文)</label>
              <input
                type="text"
                value={enterprise.logoHexSlogan.sloganEn}
                onChange={(e) => handleLogoSloganChange({ sloganEn: e.target.value })}
                placeholder="例：Derived from the Source, Mastered in Steel."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        </div>
      );

    case 'foundedYear':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">工厂 / 企业成立年份</label>
          <div className="flex items-center gap-3">
            <select
              value={enterprise.foundedYear}
              onChange={(e) => updateEnterprise({ foundedYear: parseInt(e.target.value, 10) })}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 text-sm font-mono"
            >
              {Array.from({ length: 127 }, (_, i) => 2026 - i).map((y) => (
                <option key={y} value={y}>{y} 年</option>
              ))}
            </select>
            <span className="text-xs text-slate-500 font-mono">1900-2026 整数范围</span>
          </div>
          <p className="text-[11px] text-slate-500">此时间用于在大厂宣传中，突出厂区的发展沉淀与历史实力（如：“本厂18年沉淀积累”）。</p>
        </div>
      );

    case 'businessLicenseMeta':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">企业营业执照副本上传</label>
          <FileUploader
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMb={10}
            value={enterprise.businessLicenseMeta}
            onChange={(meta) => updateEnterprise({ businessLicenseMeta: meta })}
            onPreview={onPreview}
            fieldId="enterprise_lic"
            label="点击或拖拽上传彩色营业执照扫描件"
          />
        </div>
      );

    case 'addressCascade':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1">地区 (国家)</span>
              <input
                type="text"
                value={enterprise.addressCascade.country}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-500 text-xs"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1">选择省份</span>
              <input
                type="text"
                value={enterprise.addressCascade.province}
                onChange={(e) => handleAddressChange({ province: e.target.value })}
                placeholder="例如：广东省"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1">选择城市</span>
              <input
                type="text"
                value={enterprise.addressCascade.city}
                onChange={(e) => handleAddressChange({ city: e.target.value })}
                placeholder="例如：佛山市"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1">选择区县</span>
              <input
                type="text"
                value={enterprise.addressCascade.district}
                onChange={(e) => handleAddressChange({ district: e.target.value })}
                placeholder="例如：顺德区"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1">详细厂区/办公地址 (中文)</span>
              <textarea
                value={enterprise.addressCascade.detailCn}
                onChange={(e) => handleAddressChange({ detailCn: e.target.value })}
                rows={2}
                placeholder="例如：高新技术产业园XX大厦A栋5楼"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500 resize-none height-auto"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1">详细厂区/办公地址 (英文)</span>
              <textarea
                value={enterprise.addressCascade.detailEn}
                onChange={(e) => handleAddressChange({ detailEn: e.target.value })}
                rows={2}
                placeholder="e.g., No. 22 Sanle East Road, Beijiao Town, Shunde District, Foshan"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500 resize-none font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 mt-2 pr-4">
            <div>
              <p className="text-xs font-semibold text-white">公司注册地与生产厂址是否一致？</p>
              <p className="text-[10px] text-slate-500 mt-0.5">如不一致，阿里核查官要求分别披露执照注册地与具体装配生产基地。</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddressChange({ isConsistent: true })}
                className={`px-3 py-1.5 rounded transition-all text-xs font-bold leading-none ${
                  enterprise.addressCascade.isConsistent
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                完全一致
              </button>
              <button
                type="button"
                onClick={() => handleAddressChange({ isConsistent: false })}
                className={`px-3 py-1.5 rounded transition-all text-xs font-bold leading-none ${
                  !enterprise.addressCascade.isConsistent
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                不一致
              </button>
            </div>
          </div>

          {!enterprise.addressCascade.isConsistent && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold text-slate-400 mb-1">追填：执照载明之注册地址</label>
              <input
                type="text"
                value={enterprise.addressCascade.registerAddress || ''}
                onChange={(e) => handleAddressChange({ registerAddress: e.target.value })}
                placeholder="请填写营业执照上的注册地址"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
