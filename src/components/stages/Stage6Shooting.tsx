/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, Camera, ShieldAlert } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';
import FileUploader from '../shared/FileUploader';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage6Shooting({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { shooting, quality } = formData;

  const updateShooting = (fieldset: Partial<typeof shooting>) => {
    onChange((prev) => ({
      ...prev,
      shooting: { ...prev.shooting, ...fieldset },
    }));
  };

  const addStaff = () => {
    const updated = [
      ...shooting.staffPrep,
      {
        id: 'stf_' + Date.now(),
        name: '',
        position: '',
        isFounder: false,
        englishFluent: '中文演讲',
        wearStyle: '休闲便衣',
        shootingConsent: '愿意配合出镜',
      },
    ];
    updateShooting({ staffPrep: updated });
  };

  const removeStaff = (id: string) => {
    updateShooting({ staffPrep: shooting.staffPrep.filter((s) => s.id !== id) });
  };

  const handleStaffChange = (id: string, fieldset: Partial<typeof shooting.staffPrep[0]>) => {
    updateShooting({
      staffPrep: shooting.staffPrep.map((s) => (s.id === id ? { ...s, ...fieldset } : s)),
    });
  };

  const addLocation = () => {
    const updated = [
      ...shooting.shootingLocations,
      { id: 'loc_' + Date.now(), name: '', photos: [], linkedFlowStep: '需求沟通', isAerialReachable: false },
    ];
    updateShooting({ shootingLocations: updated });
  };

  const removeLocation = (id: string) => {
    updateShooting({ shootingLocations: shooting.shootingLocations.filter((l) => l.id !== id) });
  };

  const handleLocationChange = (id: string, fieldset: Partial<typeof shooting.shootingLocations[0]>) => {
    updateShooting({
      shootingLocations: shooting.shootingLocations.map((l) => (l.id === id ? { ...l, ...fieldset } : l)),
    });
  };

  const handleBookingChange = (fieldset: Partial<typeof shooting.scheduleBooking>) => {
    updateShooting({
      scheduleBooking: { ...shooting.scheduleBooking, ...fieldset },
    });
  };

  const handleLanguageToggle = (lang: string) => {
    const current = [...shooting.languagesRequired];
    const updated = current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang];
    updateShooting({ languagesRequired: updated });
  };

  const handleNdaChange = (fieldset: Partial<typeof shooting.ndaConfidential>) => {
    updateShooting({
      ndaConfidential: { ...shooting.ndaConfidential, ...fieldset },
    });
  };

  switch (nodeId) {
    case 'staffPrep':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">上镜出镜人员筹备 (最多8人，老板必选)</label>
              <p className="text-[10px] text-slate-500">满足质量门槛：提供至少 <span className="font-bold text-emerald-400">1</span> 名愿意出镜的信用背书官</p>
            </div>
            {shooting.staffPrep.length < 8 && (
              <button
                type="button"
                onClick={addStaff}
                className="bg-slate-800 text-amber-500 hover:bg-slate-705 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
              >
                <Plus size={14} /> 添加出镜人
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {shooting.staffPrep.map((s) => (
              <div key={s.id} className="p-3 bg-slate-900 border border-slate-808 rounded-lg space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">出镜人姓名</span>
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => handleStaffChange(s.id, { name: e.target.value })}
                      placeholder="如：林树深 / Sherry Chen"
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">在厂职务/头衔</span>
                    <input
                      type="text"
                      value={s.position}
                      onChange={(e) => handleStaffChange(s.id, { position: e.target.value })}
                      placeholder="例如：联合创始人/外贸主管"
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">英文脱口秀沟通考量</span>
                    <select
                      value={s.englishFluent}
                      onChange={(e) => handleStaffChange(s.id, { englishFluent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white font-semibold"
                    >
                      <option value="纯英文脱稿">全英文脱稿演讲</option>
                      <option value="提词器演讲">参考提词机读英文</option>
                      <option value="中文演讲">仅限中文 (后期配字幕)</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">摄影期穿戴格调</span>
                    <select
                      value={s.wearStyle}
                      onChange={(e) => handleStaffChange(s.id, { wearStyle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white"
                    >
                      <option value="高级西服三件套">中高管西服套装</option>
                      <option value="标准工作礼服">企业蓝色标准工装</option>
                      <option value="休闲便衣">商务休闲干练衣服</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-between border-t border-slate-800 pt-3 text-xs">
                  <div className="flex gap-4 items-center select-none">
                    <label className="flex items-center gap-1.5 cursor-pointer text-white font-semibold">
                      <input
                        type="checkbox"
                        checked={s.isFounder}
                        onChange={(e) => handleStaffChange(s.id, { isFounder: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span className="text-red-400">★ 标识此员为最高老板/董事长</span>
                    </label>

                    <span className="text-slate-550">出镜意愿:</span>
                    <select
                      value={s.shootingConsent}
                      onChange={(e) => handleStaffChange(s.id, { shootingConsent: e.target.value })}
                      className="bg-slate-950 border border-slate-800 p-1.5 rounded text-white text-xs font-bold"
                    >
                      <option value="强意愿">强星级推荐 (首选出镜)</option>
                      <option value="愿意配合出镜">愿意配合摄制</option>
                      <option value="拒绝登场">出于机密不愿登脸</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaff(s.id)}
                    className="text-slate-500 hover:text-red-400 flex items-center gap-0.5"
                  >
                    <Trash2 size={13} /> 撤除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'shootingLocations':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">厂内重点可拍取景空间踩点 (至少踩3点)</label>
              <p className="text-[10px] text-slate-500">已踩点: <span className="font-bold text-amber-500">{shooting.shootingLocations.length}</span> / 3 个</p>
            </div>
            <button
              type="button"
              onClick={addLocation}
              className="bg-slate-800 text-amber-500 hover:bg-slate-705 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新加踩点
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {shooting.shootingLocations.map((l, il) => (
              <div key={l.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="flex justify-between items-center border-b border-slate-850 pb-1 text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Camera size={13} /> 取景区 #0{il + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLocation(l.id)}
                    className="text-[10px] text-slate-550 hover:text-red-450"
                  >
                    移除此踩点
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="col-span-1 lg:col-span-2">
                    <span className="block text-[10px] text-slate-500 mb-0.5">踩点的车间/机房区域名称</span>
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => handleLocationChange(l.id, { name: e.target.value })}
                      placeholder="如：高精密二十辊冷轧作业区"
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">关联业务流工序 (联动28步)</span>
                    <select
                      value={l.linkedFlowStep}
                      onChange={(e) => handleLocationChange(l.id, { linkedFlowStep: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white text-xs font-semibold"
                    >
                      {quality.internalBusinessFlow.map((flow) => (
                        <option key={flow} value={flow}>{flow}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-center select-none pt-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 font-semibold">
                      <input
                        type="checkbox"
                        checked={l.isAerialReachable}
                        onChange={(e) => handleLocationChange(l.id, { isAerialReachable: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>🚁 支持航拍无人机</span>
                    </label>
                  </div>
                </div>

                <div className="col-span-2 max-w-sm">
                  <span className="block text-[10px] text-slate-500 mb-0.5">手机实拍一张车间环境（大片制片提前了解）</span>
                  <FileUploader
                    accept=".jpg,.jpeg,.png"
                    maxSizeMb={20}
                    value={l.photos[0]}
                    onChange={(meta) => handleLocationChange(l.id, { photos: meta ? [meta] : [] })}
                    onPreview={onPreview}
                    fieldId={`loc_photo_${l.id}`}
                    label="绑定实拍图 (≤20M)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ndaConfidential':
      return (
        <div className="space-y-4">
          <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-lg flex gap-3 text-red-400 select-none mb-1.5">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <p className="font-bold">🚨 商业保密限制区域 & 摄拍隔离声明</p>
              <p className="mt-0.5 text-slate-400">为了防备研发特种工艺模具外观、精密设备参数、账册等透露，在此填记禁拍防避指示。摄制团队将按单定焦避让。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-1">① 厂内严禁任何人拍照/限制流出的红线说明</span>
              <textarea
                value={shooting.ndaConfidential.remark}
                onChange={(e) => handleNdaChange({ remark: e.target.value })}
                rows={4}
                placeholder="例：严禁对核心高精度自动化贴片控制配方及芯片烧录软件界面拍照，机密测试车间的产品试制台不得拍摄微距特写，研发部门透明白板上的算法公式和结构示意图需清场遮挡。"
                className="w-full bg-slate-900 border border-slate-705 p-2 rounded text-xs text-white resize-none leading-relaxed h-[105px]"
              />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-1">② 如若需要，请上传摄拍人员先签署的保密空档（NDA）</span>
              <FileUploader
                accept=".pdf,.doc,.docx"
                maxSizeMb={20}
                value={shooting.ndaConfidential.ndaAgreementMeta}
                onChange={(meta) => handleNdaChange({ ndaAgreementMeta: meta })}
                onPreview={onPreview}
                fieldId="nda_agreement_doc"
                label="上传签署NDA协议空置范本PDF (≤20M)"
              />
            </div>
          </div>
        </div>
      );

    case 'scheduleBooking':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">摄拍组上门拍摄意向黄金档期及厂区作息表时间</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-amber-500 mb-2">📅 预推黄金摄制拍摄窗口（不低于3天）</span>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={shooting.scheduleBooking.recommendedWindowStart}
                  onChange={(e) => handleBookingChange({ recommendedWindowStart: e.target.value })}
                  className="bg-slate-950 text-white border p-1 rounded font-bold w-full text-center"
                />
                <span className="text-slate-500 font-sans">-</span>
                <input
                  type="date"
                  value={shooting.scheduleBooking.recommendedWindowEnd}
                  onChange={(e) => handleBookingChange({ recommendedWindowEnd: e.target.value })}
                  className="bg-slate-950 text-white border p-1 rounded font-bold w-full text-center"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block font-bold text-slate-400 mb-2">❄️ 车间检修/淡旺冻冰不便开机拍摄档期</span>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={shooting.scheduleBooking.avoidWindowStart}
                  onChange={(e) => handleBookingChange({ avoidWindowStart: e.target.value })}
                  className="bg-slate-950 text-white border p-1 rounded w-full text-center"
                />
                <span className="text-slate-500 font-sans">-</span>
                <input
                  type="date"
                  value={shooting.scheduleBooking.avoidWindowEnd}
                  onChange={(e) => handleBookingChange({ avoidWindowEnd: e.target.value })}
                  className="bg-slate-950 text-white border p-1 rounded w-full text-center"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-850 flex items-center justify-between gap-4 max-w-md">
            <div>
              <p className="text-xs font-semibold text-white">工厂每日生产作息出勤打卡时间</p>
              <p className="text-[10px] text-slate-500 mt-0.5">便于在日光充裕外景，或者车间职工忙碌最壮观时段踩点实测。</p>
            </div>
            <div className="flex gap-1.5 items-center font-mono text-xs">
              <input
                type="text"
                maxLength={5}
                value={shooting.scheduleBooking.onDutyTime}
                onChange={(e) => handleBookingChange({ onDutyTime: e.target.value })}
                placeholder="08:00"
                className="w-16 bg-slate-950 text-white border p-1 rounded text-center"
              />
              <span className="text-slate-500 font-sans">-</span>
              <input
                type="text"
                maxLength={5}
                value={shooting.scheduleBooking.offDutyTime}
                onChange={(e) => handleBookingChange({ offDutyTime: e.target.value })}
                placeholder="17:30"
                className="w-16 bg-slate-950 text-white border p-1 rounded text-center"
              />
            </div>
          </div>
        </div>
      );

    case 'languagesRequired':
      return (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-white mb-2">本次大片视频宣传多语版规划配发</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              'English',
              'Spanish (西班牙语)',
              'French (法语)',
              'Russian (俄语)',
              'German (德语)',
              'Arabic (阿拉伯语)',
              'Vietnamese (越南语)',
              'Japanese (日文)',
            ].map((lan) => {
              const active = shooting.languagesRequired.includes(lan);
              return (
                <label
                  key={lan}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    active
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => handleLanguageToggle(lan)}
                    className="accent-amber-500"
                  />
                  <span>{lan}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-550 italic">注：摄制组承诺成品标配[全英音旁白 + 中英双语字幕]，加选语种将由配音导演于后期多轮复剪制作。</p>
        </div>
      );

    default:
      return null;
  }
}
