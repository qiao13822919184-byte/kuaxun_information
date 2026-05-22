/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { FORM_NODES } from '../data/fields';
import { FormDataState, UploadedFileMeta, FormNodeConfig } from '../types';

import Stage1Enterprise from './stages/Stage1Enterprise';
import Stage2Scale from './stages/Stage2Scale';
import Stage3Production from './stages/Stage3Production';
import Stage4Quality from './stages/Stage4Quality';
import Stage5Market from './stages/Stage5Market';
import Stage6Shooting from './stages/Stage6Shooting';
import Stage7Contact from './stages/Stage7Contact';

interface FormWizardProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  activeNodeId: string;
  setActiveNodeId: (nodeId: string) => void;
  onSubmit: () => void;
}

export default function FormWizard({
  formData,
  onChange,
  onPreview,
  activeNodeId,
  setActiveNodeId,
  onSubmit,
}: FormWizardProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // Find current node index and configuration
  const currentNodeIndex = FORM_NODES.findIndex((node) => node.id === activeNodeId);
  const currentNode = FORM_NODES[currentNodeIndex] || FORM_NODES[0];
  const currentStageIndex = currentNode.stageIndex;

  // Filter nodes belonging to the current active stage to list on the sidebar
  const stageNodes = FORM_NODES.filter((node) => node.stageIndex === currentStageIndex);

  // Auto-save notification animation
  useEffect(() => {
    setDraftSaved(true);
    const timer = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  // General field validation helper
  const validateCurrentNode = (): boolean => {
    setErrorMsg(null);

    // Stage 1
    if (activeNodeId === 'enName') {
      const val = formData.enterprise.enName.trim();
      if (val && !/^[A-Za-z0-9\s.,&'()-]+$/.test(val)) {
        setErrorMsg('公司英文名称格式不合法，请仅保留英文字母、数字和常见字符/标点。');
        return false;
      }
    }
    if (activeNodeId === 'logoHexSlogan') {
      const { colorHex } = formData.enterprise.logoHexSlogan;
      if (colorHex && colorHex.trim() && !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
        setErrorMsg('品牌主基色 HEX 码不合法，请提供标准的 6 位十六进制码。');
        return false;
      }
    }

    // Stage 2
    if (activeNodeId === 'rndStaff') {
      const count = formData.credentials.rndStaffCount;
      if (count !== undefined && count < 0) {
        setErrorMsg('研发和核心技术员总人数不得小于 0 人。');
        return false;
      }
    }
    if (activeNodeId === 'facilityArea') {
      const { area } = formData.credentials.facilityArea;
      if (area < 0) {
        setErrorMsg('厂房总占地面积数值不得非负。');
        return false;
      }
    }

    // Stage 3
    if (activeNodeId === 'hsCodes') {
      const cleanCodes = formData.production.hsCodes.filter((h) => h.code.trim().length > 0);
      if (cleanCodes.length > 0) {
        const invalid = cleanCodes.some((h) => !/^[0-9]+$/.test(h.code.trim()) || h.code.trim().length < 6);
        if (invalid) {
          setErrorMsg('HS海关编码必须为不低于 6 位的纯数字格式（如 72193400）。');
          return false;
        }
      }
    }

    // Stage 4
    if (activeNodeId === 'leadTime') {
      const { standardBatchDays, customOrderDays } = formData.quality.leadTime;
      if (standardBatchDays !== undefined && standardBatchDays < 0) {
        setErrorMsg('标品交期天数不合约束。');
        return false;
      }
      if (customOrderDays !== undefined && standardBatchDays !== undefined && customOrderDays < standardBatchDays) {
        setErrorMsg('交期逻辑冲突：复杂开模和定制化交货期原则上应等同或长于常规划线交货周。');
        return false;
      }
    }

    // Stage 7
    if (activeNodeId === 'ecommerceMatrix') {
      const entered = formData.contacts.ecommerceMatrix.filter(e => e.url.trim().length > 0);
      if (entered.length > 0) {
        const faultyUrl = entered.some((e) => !e.url.startsWith('http'));
        if (faultyUrl) {
          setErrorMsg('登记的所有官方旗舰旺铺，链接都必须符合包含 http:// 或 https:// 协议的网址规定。');
          return false;
        }
      }
    }
    if (activeNodeId === 'contactsTeam') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const withEmail = formData.contacts.contactsTeam.filter(c => c.email.trim().length > 0);
      if (withEmail.length > 0) {
        const invalidEmail = withEmail.some((c) => !emailRegex.test(c.email));
        if (invalidEmail) {
          setErrorMsg('某些职员的电子邮箱格式不合规范（如：缺少@或域点符号），排单核验将被卡塞阻拦。');
          return false;
        }
      }
    }

    return true;
  };

  // Keyboard shortcut for Enter inside form blocks to go to the next node
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      // Allow enter to trigger next
      handleNext();
    }
  };

  const handleNext = () => {
    if (!validateCurrentNode()) return;

    if (currentNodeIndex < FORM_NODES.length - 1) {
      setActiveNodeId(FORM_NODES[currentNodeIndex + 1].id);
    } else {
      // Last node completed! Trigger final report render & ZIP packaging overlay
      onSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentNodeIndex > 0) {
      setActiveNodeId(FORM_NODES[currentNodeIndex - 1].id);
    }
  };

  const selectNodeDirectly = (nodeId: string) => {
    // Check validation of CURRENT before jumping to another node
    if (validateCurrentNode()) {
      setActiveNodeId(nodeId);
    }
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      id="wizard_container"
      onKeyDown={handleKeyDown}
    >
      {/* LEFT COLUMN: Guided Stage Sidebar Directory */}
      <div className="lg:col-span-4 bg-slate-950/60 border border-slate-900 rounded-2xl p-4 h-max lg:sticky lg:top-4 select-none">
        <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-3 text-xs">
          <span className="font-extrabold text-slate-400 tracking-wider">
            {currentNode.stageName} ({currentStageIndex}/7)
          </span>
          {draftSaved && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 animate-pulse font-mono font-bold">
              <Save size={10} /> 智能保存中...
            </span>
          )}
        </div>

        {/* Sidebar Mini questions Checklist */}
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {stageNodes.map((node) => {
            const isActive = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                type="button"
                id={`sidebar_node_${node.id}`}
                onClick={() => selectNodeDirectly(node.id)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                  isActive
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold'
                    : 'bg-transparent border border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="truncate flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-500">#{node.nodeIndex}</span>
                  <span className="truncate">{node.title}</span>
                </div>

              </button>
            );
          })}
        </div>

        {/* Info Box detailing optimizations */}
        <div className="mt-4 p-3 bg-slate-900/30 border border-slate-800 rounded-xl">
          <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
            审核核对底座提醒
          </span>
          <p className="text-[10px] text-slate-500 leading-normal">
            {currentNode.hint}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Guided question Board */}
      <div className="lg:col-span-8 space-y-5">
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 relative">
          {/* Header context */}
          <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-905 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                  节点 #{currentNode.nodeIndex} / 全 47 节
                </span>

              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {currentNode.title}
              </h2>
            </div>
          </div>

          {/* Form stage router depending on stage index */}
          <div className="min-h-[220px] py-2">
            {currentStageIndex === 1 && (
              <Stage1Enterprise
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 2 && (
              <Stage2Scale
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 3 && (
              <Stage3Production
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 4 && (
              <Stage4Quality
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 5 && (
              <Stage5Market
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 6 && (
              <Stage6Shooting
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
            {currentStageIndex === 7 && (
              <Stage7Contact
                formData={formData}
                onChange={onChange}
                onPreview={onPreview}
                nodeId={activeNodeId}
              />
            )}
          </div>

          {/* Validation Alert Box */}
          {errorMsg && (
            <div
              className="mt-4 p-3.5 bg-red-950/15 border border-red-900/40 rounded-xl flex items-start gap-2 text-red-400 text-xs animate-in slide-in-from-top-2 duration-200"
              id="wizard_error_box"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">填写核对受阻：</span>
                {errorMsg}
              </div>
            </div>
          )}

          {/* Navigation Controls bottom rail */}
          <div className="flex items-center justify-between border-t border-slate-905 pt-5 mt-6">
            <button
              type="button"
              id="btn_prev"
              onClick={handlePrev}
              disabled={currentNodeIndex === 0}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-805 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 select-none disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} /> 上一题 (Prev)
            </button>

            <button
              type="button"
              id="btn_next"
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-650 hover:from-amber-400 hover:to-amber-550 text-slate-950 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 select-none shadow-lg shadow-amber-900/10 cursor-pointer"
            >
              {currentNodeIndex === FORM_NODES.length - 1 ? (
                <>
                  <CheckCircle2 size={16} /> 生成报告提交并在本地打包 (Done)
                </>
              ) : (
                <>
                  下一题 (Next) <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
