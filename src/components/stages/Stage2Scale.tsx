/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, ShieldAlert, Award } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage2Scale({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { credentials } = formData;

  const updateCredentials = (fieldset: Partial<typeof credentials>) => {
    onChange((prev) => ({
      ...prev,
      credentials: { ...prev.credentials, ...fieldset },
    }));
  };

  const handleFacilityChange = (fieldset: Partial<typeof credentials.facilityArea>) => {
    updateCredentials({
      facilityArea: { ...credentials.facilityArea, ...fieldset },
    });
  };

  const addHonor = () => {
    const fresh = [...credentials.honors, { id: 'h_' + Date.now(), name: '省级精细创新荣誉', certYear: 2025 }];
    updateCredentials({ honors: fresh });
  };

  const removeHonor = (id: string) => {
    updateCredentials({ honors: credentials.honors.filter((o) => o.id !== id) });
  };

  const handleHonorChange = (id: string, fieldset: Partial<typeof credentials.honors[0]>) => {
    updateCredentials({
      honors: credentials.honors.map((h) => (h.id === id ? { ...h, ...fieldset } : h)),
    });
  };

  const addCert = () => {
    const fresh = [
      ...credentials.certifications,
      { id: 'c_' + Date.now(), name: '新体系注册 (如ISO14001)', issuer: 'SGS', certNo: 'REG-2026-0091', expiryDate: '2028-12-31' },
    ];
    updateCredentials({ certifications: fresh });
  };

  const removeCert = (id: string) => {
    updateCredentials({ certifications: credentials.certifications.filter((o) => o.id !== id) });
  };

  const handleCertChange = (id: string, fieldset: Partial<typeof credentials.certifications[0]>) => {
    updateCredentials({
      certifications: credentials.certifications.map((c) => (c.id === id ? { ...c, ...fieldset } : c)),
    });
  };

  const addAudit = () => {
    const fresh = [...credentials.factoryAudits, { id: 'a_' + Date.now(), auditor: 'SGS' }];
    updateCredentials({ factoryAudits: fresh });
  };

  const removeAudit = (id: string) => {
    updateCredentials({ factoryAudits: credentials.factoryAudits.filter((u) => u.id !== id) });
  };

  const handleAuditChange = (id: string, fieldset: Partial<typeof credentials.factoryAudits[0]>) => {
    updateCredentials({
      factoryAudits: credentials.factoryAudits.map((a) => (a.id === id ? { ...a, ...fieldset } : a)),
    });
  };

  switch (nodeId) {
    case 'totalStaff':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">在册职工及全职员工总人数</label>
          <div className="space-y-2 max-w-sm">
            {['1-50人', '51-200人', '201-500人', '501-1000人', '1000人以上'].map((val) => (
              <label
                key={val}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                  credentials.totalStaff === val
                    ? 'border-amber-500 bg-amber-500/5 text-amber-400 font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-705'
                }`}
              >
                <input
                  type="radio"
                  name="totalStaffRadio"
                  checked={credentials.totalStaff === val}
                  onChange={() => updateCredentials({ totalStaff: val })}
                  className="accent-amber-505"
                />
                <span>{val}</span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">按您厂及总公司在册投保、领薪之常规劳动编制计算为准。</p>
        </div>
      );

    case 'rndStaff':
      return (
        <div className="space-y-6">
          <label className="block text-sm font-bold text-white mb-1">研发团队人数及技术占比</label>
          <p className="text-xs text-slate-500 leading-normal mb-2">输入部门总工程、结构研发师、模具设计员等研发类代表技术人数有多长。</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-xs font-bold text-slate-400 mb-1.5">核心研发技术官人数 (人)</span>
              <input
                type="number"
                min={0}
                value={credentials.rndStaffCount || ''}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  updateCredentials({ rndStaffCount: val });
                }}
                className="w-full bg-slate-950 border border-slate-750 p-2.5 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                <span>研发骨干所占全厂比例 (%)</span>
                <span className="text-amber-500 font-mono">{credentials.rndStaffRatio}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={credentials.rndStaffRatio}
                onChange={(e) => updateCredentials({ rndStaffRatio: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'facilityArea':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="block text-xs font-bold text-slate-400 mb-1">厂区净占地总面积</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={credentials.facilityArea.area || ''}
                  onChange={(e) => handleFacilityChange({ area: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="2500"
                  className="flex-1 bg-slate-950 border border-slate-750 p-2 rounded text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                />
                <select
                  value={credentials.facilityArea.unit}
                  onChange={(e) => handleFacilityChange({ unit: e.target.value })}
                  className="bg-slate-950 border border-slate-750 p-2 rounded text-white focus:outline-none text-xs"
                >
                  <option value="㎡">㎡ (平方米)</option>
                  <option value="亩">亩</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="block text-xs font-bold text-slate-400 mb-1.5">厂房产权形式性质</span>
              <div className="flex gap-2">
                {['自有', '租赁'].map((own) => (
                  <button
                    key={own}
                    type="button"
                    onClick={() => handleFacilityChange({ ownership: own })}
                    className={`flex-1 py-1 px-3 border rounded text-xs transition-colors ${
                      credentials.facilityArea.ownership === own
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                        : 'border-slate-850 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {own}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="block text-xs font-bold text-slate-400 mb-1.5">厂区中景/航拍大图</span>
              <FileUploader
                accept=".jpg,.jpeg,.png"
                maxSizeMb={20}
                value={credentials.facilityArea.photos[0]}
                onChange={(meta) => handleFacilityChange({ photos: meta ? [meta] : [] })}
                onPreview={onPreview}
                fieldId="facility_aerial_photo"
                label="上传航照/门窗图 (≤20M)"
              />
            </div>
          </div>
        </div>
      );

    case 'honors':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-white">政府资质认定及创新荣誉勋章</label>
            <button
              type="button"
              onClick={addHonor}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 hover:text-amber-400 font-semibold px-3 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新加荣誉
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1.5">
            {credentials.honors.map((hon) => (
              <div key={hon.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">荣誉名称（建议与证书一致）</span>
                    <input
                      type="text"
                      value={hon.name}
                      onChange={(e) => handleHonorChange(hon.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-white text-xs rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">荣誉颁发年份</span>
                    <select
                      value={hon.certYear}
                      onChange={(e) => handleHonorChange(hon.id, { certYear: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-white text-xs rounded focus:outline-none focus:border-amber-500 font-mono"
                    >
                      {Array.from({ length: 27 }, (_, i) => 2026 - i).map((y) => (
                        <option key={y} value={y}>{y} 年</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full md:w-44 self-end flex gap-2">
                  <div className="flex-1">
                    <FileUploader
                      accept=".jpg,.jpeg,.png,.pdf"
                      maxSizeMb={10}
                      value={hon.fileMeta}
                      onChange={(meta) => handleHonorChange(hon.id, { fileMeta: meta })}
                      onPreview={onPreview}
                      fieldId={`honor_${hon.id}`}
                      label="上载证书"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHonor(hon.id)}
                    className="p-2.5 hover:bg-red-950/40 text-red-500 border border-red-900 rounded shrink-0 self-center"
                    title="删除此行记录"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {credentials.honors.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs italic bg-slate-900 border border-slate-850 rounded">
                暂无自主荣誉申报。您可以随时点击右上角“新加荣誉”进行添加。
              </div>
            )}
          </div>
        </div>
      );

    case 'certifications':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">权威机构颁发之产品级与体系类核心认证</h3>
            <button
              type="button"
              onClick={addCert}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 hover:text-amber-400 font-semibold px-3 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 申报认证
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {credentials.certifications.map((c) => (
              <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">认证名称 (CE/RoHS等)</span>
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => handleCertChange(c.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">发证核心机构 (如TÜV)</span>
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => handleCertChange(c.id, { issuer: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">核心证书号</span>
                    <input
                      type="text"
                      value={c.certNo}
                      onChange={(e) => handleCertChange(c.id, { certNo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">截至有效日期</span>
                    <input
                      type="date"
                      value={c.expiryDate}
                      onChange={(e) => handleCertChange(c.id, { expiryDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex-1 max-w-md">
                    <FileUploader
                      accept=".pdf"
                      maxSizeMb={10}
                      value={c.fileMeta}
                      onChange={(meta) => handleCertChange(c.id, { fileMeta: meta })}
                      onPreview={onPreview}
                      fieldId={`cert_${c.id}`}
                      label="绑定并上传该认证证书 PDF 文件 (CE/ISO等)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCert(c.id)}
                    className="bg-slate-950 hover:bg-red-950 hover:text-red-400 text-slate-450 border border-slate-800 rounded p-2 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={14} /> <span className="text-[10px] font-semibold ml-1">删除</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'factoryAudits':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">通过第三方权威验厂、大厂审核及授权情况</h3>
            <button
              type="button"
              onClick={addAudit}
              className="bg-slate-800 text-amber-505 hover:bg-slate-700/80 hover:text-amber-400 font-semibold px-3 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新提评估报告
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {credentials.factoryAudits.map((a) => (
              <div key={a.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">审核方/授予巨头</span>
                    <select
                      value={a.auditor}
                      onChange={(e) => handleAuditChange(a.id, { auditor: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none focus:border-amber-500"
                    >
                      {['SGS', 'BV', 'SMETA', '沃尔玛 Walmart', '迪士尼 Disney', '亚马逊 Amazon', 'Costco 验厂', '宜家 IKEA', '自定义新增'].map((el) => (
                        <option key={el} value={el}>{el}</option>
                      ))}
                    </select>
                  </div>
                  {a.auditor === '自定义新增' && (
                    <div>
                      <span className="block text-[10px] text-slate-500 mb-0.5">手填其他审计商名称</span>
                      <input
                        type="text"
                        value={a.customName || ''}
                        onChange={(e) => handleAuditChange(a.id, { customName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                <div className="w-full md:w-56 shrink-0 self-end flex gap-2">
                  <div className="flex-1">
                    <FileUploader
                      accept=".pdf"
                      maxSizeMb={20}
                      value={a.fileMeta}
                      onChange={(meta) => handleAuditChange(a.id, { fileMeta: meta })}
                      onPreview={onPreview}
                      fieldId={`audit_${a.id}`}
                      label="绑定验厂评估报告/证书"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAudit(a.id)}
                    className="p-2 border border-slate-800 hover:bg-trash outline-none rounded self-center text-slate-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
