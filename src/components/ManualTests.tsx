/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckSquare, Square, PlayCircle, ShieldCheck, X } from 'lucide-react';

interface TestCase {
  id: string;
  category: string;
  name: string;
  desc: string;
  steps: string[];
  expected: string;
}

export default function ManualTests({ onClose }: { onClose: () => void }) {
  const [completed, setCompleted] = useState<{ [id: string]: boolean }>({});

  const toggleTest = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const testCases: TestCase[] = [
    {
      id: 'tc-draft',
      category: '1. 自动保存与草稿恢复功能',
      name: '离线草稿恢复 (Draft Recovery)',
      desc: '验证在断网或者意外关单刷新后，之前的录入数据、填报选项与多附件能成功召回。',
      steps: [
        '第一步：在首页填写“公司中文名称”为“深圳市国迅制造有限公司”并任意选择一个年份；',
        '第二步：刷新当前浏览器（或点击右上角“模拟异常刷新”）；',
        '第三步：进入页面检测是否迎面弹窗：“检测到您有未完成的草稿，是否恢复续填？”。',
      ],
      expected: '选择“继续原草稿”，填报阶段定位在第1步，且之前填入的内容、年份、附件列表被丝滑恢复。',
    },
    {
      id: 'tc-valid',
      category: '2. 字段校验与严格阻拦机制',
      name: '中英文公司正则 & 尾部提示校验',
      desc: '验证未通过进入下一题的强制性规则卡口。',
      steps: [
        '第一步：回到第1题将公司中文名修改为“国迅厂”（无公司或者集团字样），或者输入纯拼音：”，点击下一题；',
        '第二步：观察输入框是否高亮爆红，底部提示“校验失败：2-50字符；名称建议包含公司/厂/集团等关键词”；',
        '第三步：再次尝试在不合规范下点击“下一题”，系统是否强制禁止跳转，保障录入合格。',
      ],
      expected: '校验未满足前坚决阻止跳页，文字描述完美展示。',
    },
    {
      id: 'tc-idb-large',
      category: '3. IndexedDB 大文件秒存机制',
      name: '20MB+ 大文件缓存隔离',
      desc: '验证系统利用 IndexedDB（而非本地 localStorage）安全承接并缓存多张执照及重度航拍大图，不卡死进程。',
      steps: [
        '第一步：在第6题“营业执照上传”或者第11题“厂房航照实拍”点击或拖拽上传任意 JPEG 大图或 PDF 会议章程；',
        'Center：观察缓存进度条由 0% 秒升，底盘标识存入 IndexedDB 成功；',
        '第三步：刷新页面后，点击“继续草稿”并打开测试，点击“点此预览文件”，检测浏览器是否生成可用 Object Blob URL 预览大图。',
      ],
      expected: '文件能被成功预览，且再次点击不产生页面卡顿和 5MB 超限崩溃。',
    },
    {
      id: 'tc-pdf-flow',
      category: '4. html2canvas + jspdf 报告编译',
      name: '跨迅科技_金品诚企报告.pdf 渲染',
      desc: '验证通过 Canvas 像素重绘，解决浏览器中文字体缺失及多图排版重叠的问题。',
      steps: [
        '第一步：点击顶部或最后的“一键生成 PDF 报告”按钮；',
        '第二步：等待 1-2 秒，查看浏览器是否生成命名为“跨迅科技_{公司中文名}_{本日日期}.pdf”下载任务；',
        '第三步：用系统内置浏览器或 PDF 阅读器打开该报告，考核：公司主色调是否联动变红/黑、页数排版、中文字体、附件清单是否明朗、手印序列号。',
      ],
      expected: 'PDF 中文渲染 100% 正常，包含完整的封面、公司基础信息、供应链分析、取景排班与附录说明。',
    },
    {
      id: 'tc-zip-pack',
      category: '5. JSZip 企业阶段化打包归档',
      name: '金品诚企附件_企业.zip 重组',
      desc: '验证将保存在 IndexedDB 的所有二进制大附件以特定命规则与 stages 层级目录瞬间打包下载。',
      steps: [
        '第一步：多阶段上传营业执照、厂房外景、合格证书等，然后进入“提交报告”或者点击“打包下载附件 ZIP”；',
        '第二步：下载完成后，用解压软件（如 WinRAR）拆包，观察：首层是否呈现 01_企业身份识别 等 7 大分子目录；',
        '第三步：检查 01 目下的执照是否被重命名为：“businessLicenseMeta_原文件名.jpg / pdf”，无乱码破坏。',
      ],
      expected: '附件包严格归档，解压缩正常，文件不发生一节缺失或不可打开。',
    },
  ];

  const total = testCases.length;
  const passedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-slate-950 border-l border-slate-800 text-white shadow-2xl z-50 flex flex-col h-full animate-in slide-in-from-right duration-300">
      {/* Header bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <div>
            <h3 className="font-bold text-sm text-white">质量门槛 · 手工测试用例清单</h3>
            <p className="text-[10px] text-slate-400">Manual Test Suite for Quality Gate Assurance</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress metrics */}
      <div className="p-3.5 bg-slate-900/40 border-b border-slate-800/60 flex justify-between items-center text-xs px-5">
        <span className="text-slate-400">验收完成情况 (Passed Tests):</span>
        <span className="font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
          {passedCount} / {total} 项 ({Math.round((passedCount / total) * 100)}%)
        </span>
      </div>

      {/* TestCase Scroll container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {testCases.map((tc) => {
          const isPassed = !!completed[tc.id];
          return (
            <div
              key={tc.id}
              onClick={() => toggleTest(tc.id)}
              className={`p-3.5 rounded-lg border cursor-pointer select-none transition-all duration-200 ${
                isPassed
                  ? 'bg-slate-900/30 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-500">
                    {tc.category}
                  </span>
                  <h4 className="font-bold text-xs text-white mt-0.5">{tc.name}</h4>
                </div>
                <div>
                  {isPassed ? (
                    <CheckSquare size={18} className="text-emerald-400" />
                  ) : (
                    <Square size={18} className="text-slate-500 hover:text-slate-450" />
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{tc.desc}</p>

              {/* Steps Collapse */}
              <div className="mt-3 bg-slate-950/80 p-2 text-[10px] rounded space-y-1 bg-slate-950 border border-slate-900">
                <p className="font-semibold text-slate-300">⚙️ 执行步骤/校验规则:</p>
                {tc.steps.map((st, i) => (
                  <p key={i} className="text-slate-400 leading-normal pl-1">{st}</p>
                ))}
              </div>

              <div className="mt-2 text-[10px] text-slate-300 bg-emerald-500/5 p-2 rounded border border-emerald-500/10 italic leading-normal">
                <span className="font-bold text-emerald-400">✨ 预期交付结果:</span> {tc.expected}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer advice */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        测试数据支持一键模拟，可点击主页面下方的“注入演示数据”快速通关。
      </div>
    </div>
  );
}
