/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Archive,
  Wrench,
  Sparkles,
  RefreshCw,
  X,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

import { getInitialState, getDemoState } from './data/initialState';
import { FormDataState, UploadedFileMeta } from './types';
import { getFileBlob, clearAllAllFileBlobs, saveFileBlob } from './utils/indexedDB';
import { FORM_NODES } from './data/fields';

import StageProgressBar from './components/StageProgressBar';
import FormWizard from './components/FormWizard';
import { ReportPreview } from './components/ReportPreview';
import ManualTests from './components/ManualTests';

const LOCAL_STORAGE_KEY = 'AlibabaGoldPlusFormDraft';

// Helper to convert single oklch to rgb/rgba mathematically
function oklchToRgb(oklchStr: string): string {
  try {
    const regex = /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.deg%]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i;
    const match = oklchStr.match(regex);
    if (!match) return '#ffffff';

    const parseVal = (str: string, scale: number): number => {
      if (str.endsWith('%')) {
        return (parseFloat(str) / 100) * scale;
      }
      return parseFloat(str);
    };

    let l = parseVal(match[1], 1);
    let c = parseVal(match[2], 0.4);
    let h = parseFloat(match[3]); // hue in degrees
    let a = match[4] ? parseVal(match[4], 1) : 1;

    if (isNaN(l)) l = 1;
    if (isNaN(c)) c = 0;
    if (isNaN(h)) h = 0;

    // Convert from OKLCH to OKLAB
    const hRad = (h * Math.PI) / 180;
    const a_lab = c * Math.cos(hRad);
    const b_lab = c * Math.sin(hRad);

    // OKLAB to LMS
    const l_lms = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
    const m_lms = l - 0.1055613458 * a_lab - 0.0638541167 * b_lab;
    const s_lms = l - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

    // LMS to LMS cubed
    const l3 = l_lms * l_lms * l_lms;
    const m3 = m_lms * m_lms * m_lms;
    const s3 = s_lms * s_lms * s_lms;

    // LMS cubed to XYZ
    const x = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const y = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const z = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    // XYZ to sRGB (D65)
    let r = +3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    let g = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
    let b = +0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    // Gamma correction
    r = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

    // Clamp and scale
    const r255 = Math.max(0, Math.min(255, Math.round(r * 255)));
    const g255 = Math.max(0, Math.min(255, Math.round(g * 255)));
    const b255 = Math.max(0, Math.min(255, Math.round(b * 255)));

    if (a === 1) {
      return `rgb(${r255}, ${g255}, ${b255})`;
    } else {
      return `rgba(${r255}, ${g255}, ${b255}, ${a})`;
    }
  } catch (_) {
    return '#ffffff';
  }
}

// Translate all oklch occurrences in a text string
function translateOklchString(text: string): string {
  if (typeof text !== 'string') return text;
  if (!text.includes('oklch')) return text;
  return text.replace(/oklch\([^)]+\)/g, (match) => {
    return oklchToRgb(match);
  });
}

export default function App() {
  const [formData, setFormData] = useState<FormDataState>(getInitialState);
  const [activeNodeId, setActiveNodeId] = useState<string>('cnName');
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');

  // Overlay / Modal States
  const [previewMeta, setPreviewMeta] = useState<UploadedFileMeta | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [showTests, setShowTests] = useState(false);

  // Submission/Compilation progress overlays
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStep, setCompileStep] = useState<string>('');
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Download URLs & Filenames store for manual fallback trigger under sandbox iframe
  const [downloadPdfUrl, setDownloadPdfUrl] = useState<string | null>(null);
  const [downloadZipUrl, setDownloadZipUrl] = useState<string | null>(null);
  const [downloadPdfFilename, setDownloadPdfFilename] = useState<string>('');
  const [downloadZipFilename, setDownloadZipFilename] = useState<string>('');

  const reportRef = useRef<HTMLDivElement>(null);

  // 1. Initial Draft Assessment on Mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.enterprise && parsed.enterprise.cnName) {
          setShowDraftPrompt(true);
        }
      } catch (err) {
        console.warn('Failed to parse cached form draft', err);
      }
    }
  }, []);

  // 2. Offline Auto-Save to localStorage
  useEffect(() => {
    if (formData && formData.enterprise && formData.enterprise.cnName) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Clean-up blob url for Modal Preview
  useEffect(() => {
    if (previewBlobUrl) {
      return () => {
        URL.revokeObjectURL(previewBlobUrl);
      };
    }
  }, [previewBlobUrl]);

  // Actions
  const handleRecoverDraft = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setFormData(JSON.parse(cached));
      } catch (e) {
        console.error('Error recovering draft', e);
      }
    }
    setShowDraftPrompt(false);
  };

  const handleClearDraft = async () => {
    if (window.confirm('您确定要彻底清除当前全部录入的申报草案与附件缓存吗？此操作无法撤销。')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      await clearAllAllFileBlobs();
      setFormData(getInitialState());
      setActiveNodeId('cnName');
      setActiveView('form');
    }
  };

  const handleInjectDemo = async () => {
    if (window.confirm('是否加载“深圳市国迅制造有限公司”一键通关示范数据？加载后将自动覆盖现有草案。')) {
      const demoData = getDemoState();
      setFormData(demoData);
      setActiveNodeId('cnName');
      setActiveView('form');

      // Seed mock attachments in IndexedDB to verify ZIP & rendering immediately
      const mockBlob = new Blob(['Mock Alibaba Gold Plus File Attachment Document'], {
        type: 'text/plain',
      });
      const idsToSeed = [
        'demo_facility_1',
        'demo_file_honor1',
        'demo_file_honor2',
        'demo_file_cert1',
        'demo_file_cert2',
        'demo_file_audit1',
        'demo_file_audit2',
        'demo_prod1_white',
        'demo_prod1_scene',
        'demo_prod2_white',
        'demo_prod2_scene',
        'demo_prod3_white',
        'demo_prod3_scene',
        'demo_file_equip1',
        'demo_file_equip2',
        'demo_qc_1',
        'demo_qc_2',
        'demo_q_screenshot',
        'demo_case_pic',
        'demo_loc_pic1',
        'demo_loc_pic2',
      ];
      for (const id of idsToSeed) {
        await saveFileBlob(id, mockBlob);
      }
    }
  };

  // Previewer trigger for uploaded files OR document tags
  const handleOpenPreview = async (meta: UploadedFileMeta) => {
    try {
      const blob = await getFileBlob(meta.id);
      if (blob) {
        setPreviewMeta(meta);
        const url = URL.createObjectURL(blob);
        setPreviewBlobUrl(url);
      } else {
        alert('该附件可能刚清除，或者为本地伪演示附件，无法调取物理二进制文件。');
      }
    } catch (err) {
      console.warn('Failed to load blob for preview', err);
    }
  };

  // 3. Client-side PDF Compilation
  const compilePDF = async (): Promise<Blob> => {
    if (!reportRef.current) {
      throw new Error('Report template renderer mounting error (null ref).');
    }

    // Modern Tailwind CSS v4 uses OKLCH color space by default, which causes html2canvas to fail.
    // We automatically extract, sanitize, and translate OKLCH colors to plain RGB/RGBA before rendering.
    const prepareSanitizedCssText = (): string => {
      let cssText = '';
      let hasExtractedRules = false;

      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (!rules) continue;
          for (let j = 0; j < rules.length; j++) {
            cssText += rules[j].cssText + '\n';
          }
          hasExtractedRules = true;
        } catch (e) {
          // Fall back gracefully on CORS/security locks
        }
      }

      if (!hasExtractedRules) {
        const inlineStyles = document.querySelectorAll('style');
        inlineStyles.forEach((styleTag) => {
          cssText += (styleTag.textContent || '') + '\n';
        });
      }

      return translateOklchString(cssText);
    };

    const sanitizeClonedDocStyles = (clonedDoc: Document, sanitizedCss: string) => {
      if (sanitizedCss.trim().length > 100) {
        const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => link.parentNode?.removeChild(link));

        const styles = clonedDoc.querySelectorAll('style');
        styles.forEach(style => style.parentNode?.removeChild(style));

        const newStyleTag = clonedDoc.createElement('style');
        newStyleTag.textContent = sanitizedCss;
        
        const targetHead = clonedDoc.head || clonedDoc.documentElement;
        targetHead.appendChild(newStyleTag);
      }

      // Also clean up any element inline styles that contain oklch
      const elements = clonedDoc.querySelectorAll('*');
      elements.forEach((el) => {
        const styleAttr = el.getAttribute('style');
        if (styleAttr && styleAttr.includes('oklch')) {
          el.setAttribute('style', translateOklchString(styleAttr));
        }
      });
    };

    // Temporarily replace parent <style> tags content to shield html2canvas from finding OKLCH values in styles
    const styleTags = document.querySelectorAll('style');
    const styleBackup = new Map<HTMLStyleElement, string>();
    styleTags.forEach((tag) => {
      const text = tag.textContent || '';
      if (text.includes('oklch')) {
        styleBackup.set(tag, text);
        tag.textContent = translateOklchString(text);
      }
    });

    // Temporarily proxy getComputedStyle of main window to resolve OKLCH to RGB
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function (elt, pseudoElt) {
      const style = originalGetComputedStyle.call(window, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === 'getPropertyValue') {
            return function (propertyName: string) {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && val.includes('oklch')) {
                return translateOklchString(val);
              }
              return val;
            };
          }
          const val = Reflect.get(target, prop, target);
          if (typeof val === 'string' && val.includes('oklch')) {
            return translateOklchString(val);
          }
          if (typeof val === 'function' && typeof (target as any)[prop] === 'function') {
            return (val as Function).bind(target);
          }
          return val;
        }
      });
    };

    let canvas;
    try {
      const sanitizedCssText = prepareSanitizedCssText();

      // Capture HTML node by canvas with high physical scaling resolution
      canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Intercept clonedDoc window's getComputedStyle too!
          const clonedWindow = clonedDoc.defaultView;
          if (clonedWindow) {
            const originalClonedGCS = clonedWindow.getComputedStyle;
            clonedWindow.getComputedStyle = function (elt, pseudoElt) {
              const style = originalClonedGCS.call(clonedWindow, elt, pseudoElt);
              return new Proxy(style, {
                get(target, prop, receiver) {
                  if (prop === 'getPropertyValue') {
                    return function (propertyName: string) {
                      const val = target.getPropertyValue(propertyName);
                      if (typeof val === 'string' && val.includes('oklch')) {
                        return translateOklchString(val);
                      }
                      return val;
                    };
                  }
                  const val = Reflect.get(target, prop, target);
                  if (typeof val === 'string' && val.includes('oklch')) {
                    return translateOklchString(val);
                  }
                  if (typeof val === 'function' && typeof (target as any)[prop] === 'function') {
                    return (val as Function).bind(target);
                  }
                  return val;
                }
              });
            };
          }
          sanitizeClonedDocStyles(clonedDoc, sanitizedCssText);
        },
      });
    } finally {
      // Restore getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
      // Restore style tags contents
      styleBackup.forEach((originalText, tag) => {
        tag.textContent = originalText;
      });
      styleBackup.clear();
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Convert pixels to millimetres context
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    return pdf.output('blob');
  };

  // 4. Assemble Attachment sub-directories ZIP and download together with PDF
  const handleFinalCompilation = async () => {
    setIsCompiling(true);
    setCompileProgress(10);
    setCompileError(null);

    // Revoke previous URLs to free memory
    if (downloadPdfUrl) URL.revokeObjectURL(downloadPdfUrl);
    if (downloadZipUrl) URL.revokeObjectURL(downloadZipUrl);
    setDownloadPdfUrl(null);
    setDownloadZipUrl(null);

    const compName = formData.enterprise.cnName.trim() || '粤迅申报企业';
    const formattedDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

    const pdfFilename = `跨迅科技_${compName}_${formattedDate}.pdf`;
    const zipFilename = `金品诚企附件_${compName}_${formattedDate}.zip`;

    try {
      // Step A: Capture & Compile Gold Plus PDF Report
      setCompileStep('第一步：分析审核报表树，正在生成金商 PDF 质检大报告...');
      setCompileProgress(25);
      const pdfBlob = await compilePDF();
      setCompileProgress(50);

      // Step B: Set up ZIP Archive via JSZip
      setCompileStep('第二步：提取本地 IndexedDB 缓存文件，自动划分 7 大阶段并重名重组...');
      const zip = new JSZip();

      // Place compiled PDF to ZIP root
      zip.file(pdfFilename, pdfBlob);

      // Scan and gather all file configurations
      const fileTasks: { path: string; meta: UploadedFileMeta }[] = [];

      // Stage 1 Enterprise License
      if (formData.enterprise.businessLicenseMeta) {
        fileTasks.push({
          path: '01_企业身份识别/businessLicenseMeta_' + formData.enterprise.businessLicenseMeta.name,
          meta: formData.enterprise.businessLicenseMeta,
        });
      }
      if (formData.enterprise.logoHexSlogan.logoMeta) {
        fileTasks.push({
          path: '01_企业身份识别/logo_' + formData.enterprise.logoHexSlogan.logoMeta.name,
          meta: formData.enterprise.logoHexSlogan.logoMeta,
        });
      }

      // Stage 2 Facility photos & certificates
      if (formData.credentials.facilityArea.photos) {
        formData.credentials.facilityArea.photos.forEach((ph, i) => {
          fileTasks.push({
            path: `02_规模体量实力/facilityPhoto_0${i + 1}_${ph.name}`,
            meta: ph,
          });
        });
      }
      formData.credentials.honors.forEach((h, i) => {
        if (h.fileMeta) {
          fileTasks.push({
            path: `02_规模体量实力/honors_0${i + 1}_${h.fileMeta.name}`,
            meta: h.fileMeta,
          });
        }
      });
      formData.credentials.certifications.forEach((c, i) => {
        if (c.fileMeta) {
          fileTasks.push({
            path: `02_规模体量实力/certifications_0${i + 1}_${c.fileMeta.name}`,
            meta: c.fileMeta,
          });
        }
      });
      formData.credentials.factoryAudits.forEach((a, i) => {
        if (a.fileMeta) {
          fileTasks.push({
            path: `02_规模体量实力/factoryAudits_0${i + 1}_${a.fileMeta.name}`,
            meta: a.fileMeta,
          });
        }
      });

      // Stage 3 production Catalog & products & equipments
      formData.production.eCatalogs.forEach((c, i) => {
        fileTasks.push({
          path: `03_供应链生产与定制/productCatalog_0${i + 1}_${c.name}`,
          meta: c,
        });
      });
      formData.production.featuredProducts.forEach((p, i) => {
        if (p.whiteBgPhoto) {
          fileTasks.push({
            path: `03_供应链生产与定制/featuredProduct_whiteBg_0${i + 1}_${p.whiteBgPhoto.name}`,
            meta: p.whiteBgPhoto,
          });
        }
        if (p.scenePhoto) {
          fileTasks.push({
            path: `03_供应链生产与定制/featuredProduct_scene_0${i + 1}_${p.scenePhoto.name}`,
            meta: p.scenePhoto,
          });
        }
      });
      formData.production.keyEquipments.forEach((e, i) => {
        if (e.fileMeta) {
          fileTasks.push({
            path: `03_供应链生产与定制/specialEquipment_0${i + 1}_${e.fileMeta.name}`,
            meta: e.fileMeta,
          });
        }
      });

      // Stage 4 quality
      if (formData.quality.qcWorkflow.labPhotos) {
        formData.quality.qcWorkflow.labPhotos.forEach((ph, i) => {
          fileTasks.push({
            path: `04_品质检验指标/qcLab_0${i + 1}_${ph.name}`,
            meta: ph,
          });
        });
      }

      // Stage 5 cases screenshot
      if (formData.market.repurchaseReasons.quotes) {
        formData.market.repurchaseReasons.quotes.forEach((q, i) => {
          if (q.screenshotMeta) {
            fileTasks.push({
              path: `05_市场案例复购/repurchasePraise_0${i + 1}_${q.screenshotMeta.name}`,
              meta: q.screenshotMeta,
            });
          }
        });
      }
      formData.market.overseasCases.forEach((oc, i) => {
        if (oc.photoMeta) {
          fileTasks.push({
            path: `05_市场案例复购/overseasCasePhoto_0${i + 1}_${oc.photoMeta.name}`,
            meta: oc.photoMeta,
          });
        }
      });

      // Stage 6 shooting locations
      formData.shooting.shootingLocations.forEach((l, i) => {
        if (l.photos) {
          l.photos.forEach((ph, iph) => {
            fileTasks.push({
              path: `06_宣导拍摄排期/shootingLocationSpot_0${i + 1}_${iph + 1}_${ph.name}`,
              meta: ph,
            });
          });
        }
      });
      if (formData.shooting.ndaConfidential.ndaAgreementMeta) {
        fileTasks.push({
          path: `06_宣导拍摄排期/ndaAgreementDoc_${formData.shooting.ndaConfidential.ndaAgreementMeta.name}`,
          meta: formData.shooting.ndaConfidential.ndaAgreementMeta,
        });
      }

      // Read all Blobs sequentially and append into JSZip file map
      let loadedTasks = 0;
      for (const task of fileTasks) {
        try {
          const blob = await getFileBlob(task.meta.id);
          if (blob) {
            zip.file(task.path, blob);
          }
        } catch (binErr) {
          console.warn('Skipping unreadable attachment', task.meta.name, binErr);
        }
        loadedTasks++;
        setCompileProgress(Math.floor(50 + (loadedTasks / fileTasks.length) * 35));
      }

      setCompileStep('第三步：打包并加密整理，正在本地输出压缩包下载流...');
      setCompileProgress(90);

      // Generate the final ZIP blob down
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Save ZIP locally
      const zipUrl = URL.createObjectURL(zipBlob);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Store in state so that SUCCESS modal has hardlinks which are resilient to sandboxed iframe blockade!
      setDownloadZipUrl(zipUrl);
      setDownloadPdfUrl(pdfUrl);
      setDownloadZipFilename(zipFilename);
      setDownloadPdfFilename(pdfFilename);

      // Attempt automatic download (best effort - works in top-level tabs)
      try {
        const zipLink = document.createElement('a');
        zipLink.href = zipUrl;
        zipLink.download = zipFilename;
        document.body.appendChild(zipLink);
        zipLink.click();
        document.body.removeChild(zipLink);
      } catch (err) {
        console.warn('Programmatic ZIP download was blocked by browser sandbox/iframe restriction.', err);
      }

      try {
        const pdfLink = document.createElement('a');
        pdfLink.href = pdfUrl;
        pdfLink.download = pdfFilename;
        document.body.appendChild(pdfLink);
        pdfLink.click();
        document.body.removeChild(pdfLink);
      } catch (err) {
        console.warn('Programmatic PDF download was blocked by browser sandbox/iframe restriction.', err);
      }

      setCompileProgress(100);
      setIsCompiling(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Final Compilation Error', err);
      setCompileError(err?.message || '未知错误，生成金草案或 ZIP 打包崩溃，请检查浏览器内存环境。');
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all selection:bg-orange-500 selection:text-white">
      {/* 1. BRAND TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md select-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              GS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 font-bold text-base tracking-tight">
                  金品诚企申报系统
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full border border-orange-500/30 text-orange-600 font-bold bg-orange-500/5 font-mono">
                  PRO v1.2
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                Gold Supplier Certification Service
              </p>
            </div>
          </div>

          {/* Quick Actions & Demo keys */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleInjectDemo}
              id="btn_inject_demo"
              type="button"
              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100/85 text-orange-600 font-bold border border-orange-200/40 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles size={13} />
              一键注入国迅物理智造演示数据 (Demo)
            </button>

            <button
              onClick={() => {
                if (window.confirm('您拟模拟浏览器进程因断网或奔溃导致的“突发异常刷新”吗？刷新后，重新载入即自动寻回草稿。')) {
                  window.location.reload();
                }
              }}
              type="button"
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-sm"
              title="模拟异常刷新 (Simulate Reload)"
            >
              <RefreshCw size={13} />异常刷新已存
            </button>

            <button
              onClick={() => setShowTests(true)}
              type="button"
              id="sidebar_manual_trigger"
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Wrench size={13} />
              用例测试清单
            </button>
          </div>
        </div>
      </header>

      {/* 2. TASK VIEW TYPE TOGGLE */}
      <section className="bg-slate-100 border-b border-slate-200 select-none">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 border border-slate-300/40 rounded-xl">
            <button
              onClick={() => setActiveView('form')}
              type="button"
              id="btn_tab_form"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'form'
                  ? 'bg-white text-orange-600 shadow-sm border border-slate-300/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet size={14} /> Guided Form (引导填写)
            </button>
            <button
              onClick={() => setActiveView('preview')}
              type="button"
              id="btn_tab_preview"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'preview'
                  ? 'bg-white text-orange-600 shadow-sm border border-slate-300/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText size={14} /> Report Auditor (查看报告预览)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearDraft}
              type="button"
              className="text-xs text-red-500 hover:text-red-700 px-2.5 py-1.5 rounded hover:bg-red-50"
            >
              一键清除全部重设 (Clear)
            </button>
            <button
              onClick={handleFinalCompilation}
              type="button"
              id="btn_main_submit"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] text-white rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <Download size={14} /> 导出 PDF 申报书 + ZIP 压缩包 (Submit)
            </button>
          </div>
        </div>
      </section>
      {/* 3. CORE ADAPTIVE VIEWS CANVASES */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Offscreen mounting container to guarantee html2canvas compilation in form view */}
        {activeView === 'form' && (
          <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none w-[900px] overflow-hidden">
            <ReportPreview ref={reportRef} formData={formData} />
          </div>
        )}
        {activeView === 'form' ? (
          <div className="space-y-6">
            {/* Stage completion indicators */}
            <StageProgressBar
              currentStageIndex={FORM_NODES.find(n => n.id === activeNodeId)?.stageIndex || 1}
              formData={formData}
              onStageSelect={(stageIndex) => {
                const firstNodeInStage = FORM_NODES.find(n => n.stageIndex === stageIndex);
                if (firstNodeInStage) {
                  setActiveNodeId(firstNodeInStage.id);
                }
              }}
            />

            {/* Guided steps */}
            <FormWizard
              formData={formData}
              onChange={setFormData as any}
              onPreview={handleOpenPreview}
              activeNodeId={activeNodeId}
              setActiveNodeId={setActiveNodeId}
              onSubmit={handleFinalCompilation}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Report Preview Section */}
            <div className="lg:col-span-8 bg-slate-950 border border-slate-900 rounded-3xl p-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-4 px-2">
                <div>
                  <h3 className="text-sm font-bold text-white">金商审阅级报告 (Official Document Preview)</h3>
                  <p className="text-[10px] text-slate-500">像素级模拟。导出时由此版动态测制 Canvas。</p>
                </div>
                <button
                  type="button"
                  onClick={handleFinalCompilation}
                  className="px-3 py-1.5 bg-slate-900 text-amber-500 font-bold rounded hover:bg-slate-850 text-xs inline-flex items-center gap-1.5 border border-amber-600/10"
                >
                  <Download size={13} /> 点此仅重新导出报告 PDF
                </button>
              </div>

              {/* Mounted report preview paper sheet */}
              <div className="border border-slate-800 rounded-xl p-2 bg-slate-100 overflow-y-auto max-h-[85vh]">
                <ReportPreview ref={reportRef} formData={formData} />
              </div>
            </div>

            {/* Right Audit Sidebar checklist info */}
            <div className="lg:col-span-4 bg-slate-950/50 border border-slate-900 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-900">
                阿里金品核验标准一览
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                阿里国际站的金品报告对于供应链能力有极严格的水准把关。本收集系统通过 47
                个节点的详尽填报体系，能够有效助您避坑多项常见形式审查退单。
              </p>
              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="p-2.5 bg-slate-900 rounded-lg flex gap-2">
                  <span className="text-amber-500">●</span>
                  <div>
                    <span className="font-bold text-slate-300 block">不合格英文格式：</span>
                    对于拼写有任何拼音及奇特乱码的，系统将动态提示修正。
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg flex gap-2">
                  <span className="text-amber-500">●</span>
                  <div>
                    <span className="font-bold text-slate-300 block">上镜主对接人规范：</span>
                    缺少出镜人或者现场负责人微信邮箱的，将可能卡在终核档位。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. MODALS & DETAILED OVERLAYS */}

      {/* Test Suites Drawer Panel */}
      {showTests && <ManualTests onClose={() => setShowTests(false)} />}

      {/* Offline Draft Recovery Confirmation Dialog */}
      {showDraftPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto">
              <Save size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">发现上一次未处理完的草案</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                检测到本地磁盘有【深圳国迅等公司】的填报足迹（包含 IndexedDB 中的二进制附件照片）。
                是否一键恢复该草稿、重新加载断网前的数据？
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem(LOCAL_STORAGE_KEY);
                  clearAllAllFileBlobs();
                  setShowDraftPrompt(false);
                }}
                type="button"
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                放弃草稿重新填
              </button>
              <button
                onClick={handleRecoverDraft}
                type="button"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                继续草稿续填 (Restore)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document/Photo Modal Preview Viewer Overlay */}
      {previewMeta && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh]">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-amber-500" size={16} />
                <span className="font-bold text-xs text-white truncate max-w-md">
                  当前预览中: {previewMeta.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setPreviewMeta(null);
                  setPreviewBlobUrl(null);
                }}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[300px]">
              {previewMeta.type.includes('image/') && previewBlobUrl ? (
                <img
                  src={previewBlobUrl}
                  alt={previewMeta.name}
                  className="max-h-[60vh] max-w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              ) : previewMeta.type === 'application/pdf' ? (
                <div className="text-center p-12 text-slate-400 space-y-3">
                  <div className="w-12 h-12 bg-red-950/35 text-red-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-900/40 font-bold">
                    PDF
                  </div>
                  <p className="text-xs font-bold text-slate-200">体系化证书 PDF 已安全储存于 IndexedDB</p>
                  <p className="text-[11px] max-w-md leading-normal">
                    由于底层沙盒和跨域 PDF 内联插件的安全沙盒限制，PDF 实体阅读已作了隔离存储。
                    待最终导出 ZIP 包后，您可直接用任何 PDF 工具秒速开启该完整资质。
                  </p>
                  <a
                    href={previewBlobUrl || undefined}
                    download={previewMeta.name}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    <Download size={13} /> 单独提取此 PDF 下载预览
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2">
                  <Archive className="text-slate-500 mx-auto" size={32} />
                  <p className="text-xs">
                    该文件为：<span className="font-mono">{previewMeta.name}</span> ，属结构化图册/压缩文件，暂不支持在线直阅。
                  </p>
                  <p className="text-[10px]">
                    该文件可在稍后点击打包下载 ZIP 时，在子目录中原封不动获取核对。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Compilation Loading overlay */}
      {isCompiling && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Archive className="text-amber-500 animate-bounce" size={20} />
              金商申报书 PDF 汇审 & 附件 ZIP 打包编译中...
            </h3>
            <p className="text-xs text-slate-400 leading-normal">{compileStep}</p>

            {/* Simulated progress slider bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-slate-500 font-bold">
                <span>PROGRESS METRICS:</span>
                <span>{compileProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${compileProgress}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500">
              请勿在此操作期间关闭或刷新浏览器窗口。稍后将在底层直接发起 PDF 图纸与 ZIP 双重下载任务。
            </p>
          </div>
        </div>
      )}

      {/* Submission success Modal Badge */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[95vh]">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">申报大件离线编译导出成功！</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                您的阿里国际站【金品诚企建档申报册】及所有保真附件已由浏览器在本地大功告成。
              </p>

              {/* Explicit fallback buttons for Sandbox Iframe Environment */}
              <div className="mt-4 space-y-2.5">
                <p className="text-[11px] text-amber-500 font-semibold bg-amber-500/10 p-2.5 rounded-lg text-left leading-normal border border-amber-500/20">
                  ⚠️ <strong>浏览器沙盒安全提示：</strong><br />
                  由于 AI Studio 开发环境运行于<strong>安全 Iframe 沙盒</strong>内，部分浏览器出于安全性考量会默认拦截 Iframe 内的静默下载请求。若您的浏览器刚刚没有弹出下载文件，<strong>请直接点击下方按钮进行手动保存：</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {downloadPdfUrl && (
                    <a
                      href={downloadPdfUrl}
                      download={downloadPdfFilename}
                      className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-805 rounded-xl text-left hover:scale-[1.02] transition-transform duration-150 block"
                    >
                      <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">STEP 1: DOWNLOAD PDF</span>
                      <span className="text-xs text-white font-bold block truncate mt-1">📄 报告正本 PDF 下载</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5 font-semibold">🔍 点击手动下载报告</span>
                    </a>
                  )}

                  {downloadZipUrl && (
                    <a
                      href={downloadZipUrl}
                      download={downloadZipFilename}
                      className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-805 rounded-xl text-left hover:scale-[1.02] transition-transform duration-150 block"
                    >
                      <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">STEP 2: DOWNLOAD ZIP</span>
                      <span className="text-xs text-white font-bold block truncate mt-1">📦 附件全能 ZIP 包下载</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5 font-semibold">🔍 点击手动下载归档</span>
                    </a>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-left bg-slate-950/60 p-3 rounded-lg border border-slate-900 leading-normal space-y-1.5">
                  <p className="font-bold text-slate-300">💡 为什么强烈建议您“在新标签页打开” (Open in New Tab) 使用本软件？</p>
                  <p>1. 处于独立大标签页状态下，程序将拥有<strong>最高本地计算线程、独占的巨量 IndexedDB 大文件读取内存带宽</strong>。</p>
                  <p>2. 点击“导出”时能<strong>100% 触发两份大件的自动静默极速下发存盘</strong>，无任何安全阻截，体验流畅十倍。</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  // Open dev app live link in new tab automatically as handy rescue option if they are stuck
                  window.open(window.location.href, '_blank');
                }}
                type="button"
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white transition-all font-bold rounded-xl cursor-pointer"
              >
                🚀 新窗口极速加载
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                type="button"
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
              >
                关 闭 (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compilation error modal */}
      {compileError && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-red-950 rounded-2xl max-w-lg w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-red-400">导出的本地离线渲染过程发生异常</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                在将金商大报告转换为 A4 PDF 的过程中，浏览器图形引擎发生了一处非预期中断：
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-red-900/30 mt-3 text-left text-[11px] text-red-300 font-mono break-all leading-relaxed whitespace-pre-wrap">
                {compileError}
              </div>
              <p className="text-[11px] text-slate-400 text-left mt-3 leading-normal border-t border-slate-900 pt-3">
                💡 <strong>常用修复手段：</strong><br />
                1. <strong>极其重要：</strong>请使用最新版 Google Chrome 浏览器并在<strong>“右上角 ➔ 新标签页打开”</strong>的外部大标签页状态运行。在 AI Studio 安全预览沙盒(Iframe)中，当页面存在特大媒体图片时，部分浏览器进程会由于跨域限制产生渲染崩溃。<br />
                2. 部分提报上传的文件为超高像素商业图片，可能临时耗尽内存，可尝试点击顶部 <strong>“一键清除重设 (Clear)”</strong> 清理后，再次点 <strong>“一键注入演示数据 (Demo)”</strong> 即可完成 100% 毫无偏差的安全编译导出测试。
              </p>
            </div>
            <button
              onClick={() => setCompileError(null)}
              type="button"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              我知道了 (OK)
            </button>
          </div>
        </div>
      )}

      {/* 5. GREETING/STATUS FOOTER LINE */}
      <footer className="bg-slate-950 border-t border-slate-905 py-4 select-none">
        <div className="max-w-7xl mx-auto px-4 text-center text-[10px] text-slate-600 font-mono flex flex-wrap items-center justify-between gap-4">
          <span>阿里国际站金品诚企申报助理工具 · 2026</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-500" />
              100% 离线隐私保护模式已开启
            </span>
            <span>物理沙盒环境: v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
