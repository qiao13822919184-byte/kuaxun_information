/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage4Quality({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { quality } = formData;

  const updateQuality = (fieldset: Partial<typeof quality>) => {
    onChange((prev) => ({
      ...prev,
      quality: { ...prev.quality, ...fieldset },
    }));
  };

  const handleQcWorkflowChange = (fieldset: Partial<typeof quality.qcWorkflow>) => {
    updateQuality({
      qcWorkflow: { ...quality.qcWorkflow, ...fieldset },
    });
  };

  const addMoq = () => {
    const updated = [...quality.moqThresholds, { id: 'm_' + Date.now(), category: '', moqQty: 100, unit: 'pcs', remark: '' }];
    updateQuality({ moqThresholds: updated });
  };

  const removeMoq = (id: string) => {
    updateQuality({ moqThresholds: quality.moqThresholds.filter((m) => m.id !== id) });
  };

  const handleMoqChange = (id: string, fieldset: Partial<typeof quality.moqThresholds[0]>) => {
    updateQuality({
      moqThresholds: quality.moqThresholds.map((m) => (m.id === id ? { ...m, ...fieldset } : m)),
    });
  };

  const handleLeadTimeChange = (fieldset: Partial<typeof quality.leadTime>) => {
    updateQuality({
      leadTime: { ...quality.leadTime, ...fieldset },
    });
  };

  const handleSamplePolicyChange = (fieldset: Partial<typeof quality.samplePolicy>) => {
    updateQuality({
      samplePolicy: { ...quality.samplePolicy, ...fieldset },
    });
  };

  // Reordering of Business flows (Up / Down)
  const moveFlowStep = (idx: number, direction: 'up' | 'down') => {
    const arr = [...quality.internalBusinessFlow];
    if (direction === 'up' && idx > 0) {
      const temp = arr[idx];
      arr[idx] = arr[idx - 1];
      arr[idx - 1] = temp;
    } else if (direction === 'down' && idx < arr.length - 1) {
      const temp = arr[idx];
      arr[idx] = arr[idx + 1];
      arr[idx + 1] = temp;
    }
    updateQuality({ internalBusinessFlow: arr });
  };

  const handleQcStepToggle = (stepName: string) => {
    const current = [...quality.qcWorkflow.steps];
    const updated = current.includes(stepName)
      ? current.filter((s) => s !== stepName)
      : [...current, stepName];
    handleQcWorkflowChange({ steps: updated });
  };

  switch (nodeId) {
    case 'qcWorkflow':
      return (
        <div className="space-y-4">
          <div>
            <span className="block text-xs font-bold text-slate-400 mb-1.5">① 勾选覆盖的 QC 质检控制工序环节</span>
            <div className="flex flex-wrap gap-2">
              {['IQC 进料检测', 'IPQC 过程检验', 'FQC 成品终检', 'OQC 出货监测', '可靠性测试'].map((st) => {
                const checked = quality.qcWorkflow.steps.includes(st);
                return (
                  <label
                    key={st}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-emerald-500 bg-emerald-500/15 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleQcStepToggle(st)}
                      className="accent-emerald-550"
                    />
                    <span>{st}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-1">② 实验室内装及高精密质检检测机器实景图</span>
              <FileUploader
                accept=".jpg,.jpeg,.png"
                maxSizeMb={20}
                value={quality.qcWorkflow.labPhotos[0]}
                onChange={(meta) => handleQcWorkflowChange({ labPhotos: meta ? [meta] : [] })}
                onPreview={onPreview}
                fieldId="qc_lab_photo"
                label="上传质检中心/老化实验室照片"
              />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-1">③ 核心物理/化学检测项目、控制指标精叙</span>
              <textarea
                value={quality.qcWorkflow.coreTestingItems}
                onChange={(e) => handleQcWorkflowChange({ coreTestingItems: e.target.value })}
                rows={4}
                placeholder="例：通过精细化实验室对每批入库原料芯片、阻容件、精细金属板件进行多谱度指标检验，开展多项抗老化、力学极限与可靠性测试，保障出厂成品检测100%合格。"
                className="w-full bg-slate-950 border border-slate-755 text-xs rounded p-2 text-white h-[105px] resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      );

    case 'moqThresholds':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-white">产品细分类别起订门槛（MOQ）指引</label>
            <button
              type="button"
              onClick={addMoq}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 添加类别 MOQ
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {quality.moqThresholds.map((m) => (
              <div key={m.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1 text-xs">
                  <div>
                    <input
                      type="text"
                      value={m.category}
                      onChange={(e) => handleMoqChange(m.id, { category: e.target.value })}
                      placeholder="如：智能控制模块"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-white rounded text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="number"
                      min={0}
                      value={m.moqQty || ''}
                      onChange={(e) => handleMoqChange(m.id, { moqQty: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                      placeholder="数量"
                      className="w-20 bg-slate-950 border border-slate-750 p-2 text-white text-center rounded text-xs font-mono"
                    />
                    <select
                      value={m.unit}
                      onChange={(e) => handleMoqChange(m.id, { unit: e.target.value })}
                      className="bg-slate-950 border border-slate-750 p-2 text-white rounded text-xs"
                    >
                      {['pcs', 'sets', 'tons (吨)', '卷 (Coils)', '箱 (Cartons)'].map((un) => (
                        <option key={un} value={un}>{un}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={m.remark}
                      onChange={(e) => handleMoqChange(m.id, { remark: e.target.value })}
                      placeholder="填写补充，如：多厚度规格混批等"
                      className="flex-1 bg-slate-950 border border-slate-755 p-2 text-white rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeMoq(m.id)}
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

    case 'leadTime':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">标品、定制件交货周期安排与淡旺波动缓冲声明</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-xs font-bold text-slate-400 mb-1.5">① 标品批量首期采购交周期天数 (天)</span>
              <input
                type="number"
                min={1}
                value={quality.leadTime.standardBatchDays || ''}
                onChange={(e) => handleLeadTimeChange({ standardBatchDays: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="w-28 bg-slate-950 border border-slate-750 p-2.5 rounded text-white font-mono text-center text-sm focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-xs font-bold text-slate-400 mb-1.5">② 复杂定制或开模首单批量交周期 (天)</span>
              <input
                type="number"
                min={1}
                value={quality.leadTime.customOrderDays || ''}
                onChange={(e) => handleLeadTimeChange({ customOrderDays: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="w-28 bg-slate-950 border border-slate-755 p-2.5 rounded text-white font-mono text-center text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-405 mb-1">③ 行业高峰/特殊停机旺季期间周期延迟补充声明</span>
            <textarea
              value={quality.leadTime.seasonPeakRemark}
              onChange={(e) => handleLeadTimeChange({ seasonPeakRemark: e.target.value })}
              rows={3}
              placeholder="例：每年10月至次年1月受西餐和五金行业出口旺季出货以及物流港口拥塞，批量制作交期需自上述默认多追加 7 天。请客户提前锁定集装箱订仓排单。"
              className="w-full bg-slate-900 border border-slate-705 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none h-auto"
            />
          </div>
        </div>
      );

    case 'samplePolicy':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">阿里阿里金品金牌打样样品费用与运邮政策宣言</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-slate-400 mb-2">样品收取资费准则表项</span>
              <div className="space-y-1.5">
                {[
                  { key: 'free', txt: '完全免费发设制样（常规小样）' },
                  { key: 'charged', txt: '适当收取样品制版本身工损费' },
                  { key: 'offset', txt: '加收但可在后续正式大货首单中足额抵扣' },
                ].map((fee) => (
                  <label key={fee.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="sampleFeeRadio"
                      checked={quality.samplePolicy.feePolicy === fee.key}
                      onChange={() => handleSamplePolicyChange({ feePolicy: fee.key })}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-300">{fee.txt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-slate-400 mb-2">国际快寄费承担方判定</span>
              <div className="space-y-1.5">
                {[
                  { key: 'buyer', txt: '由买家(Buyer)全额自担快递件费用' },
                  { key: 'seller', txt: '出货方(Seller)提供部分邮费补贴或包邮' },
                  { key: 'cod', txt: '仅在提供对应 DHL/FedEx/UPS 账号到付下发样' },
                ].map((fr) => (
                  <label key={fr.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="sampleFreightRadio"
                      checked={quality.samplePolicy.freightPolicy === fr.key}
                      onChange={() => handleSamplePolicyChange({ freightPolicy: fr.key })}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-300">{fr.txt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {quality.samplePolicy.feePolicy !== 'free' && (
            <div className="p-3 bg-slate-900 rounded border border-slate-850 flex items-center gap-3 w-max animate-in fade-in duration-200">
              <span className="text-xs font-semibold text-slate-400">平均常规打样估算样品费参考金额:</span>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded border border-slate-800 text-xs font-mono">
                <span className="text-amber-500 font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  value={quality.samplePolicy.sampleFeeUsd || ''}
                  onChange={(e) => handleSamplePolicyChange({ sampleFeeUsd: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="bg-transparent border-none text-white focus:outline-none w-16 text-center font-bold"
                />
                <span className="text-slate-400">USD</span>
              </div>
            </div>
          )}
        </div>
      );

    case 'internalBusinessFlow':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">企业内部接到大货订单的业务流转工序（点击和微调重组）</label>
          <p className="text-xs text-slate-500 mb-3">使用左右两侧的“上移/下移”按钮调整顺序，此顺序将自动级联绑定到之后的拍摄踩取取景卡片对应的阶段中。</p>

          <div className="space-y-2 max-w-xl">
            {quality.internalBusinessFlow.map((step, idx) => (
              <div
                key={step}
                className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-850 border rounded-full font-mono text-[10px] text-slate-400">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white">{step}</span>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveFlowStep(idx, 'up')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                    title="上移此流转步骤"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === quality.internalBusinessFlow.length - 1}
                    onClick={() => moveFlowStep(idx, 'down')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                    title="下移此流转步骤"
                  >
                    <ArrowDown size={12} />
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
