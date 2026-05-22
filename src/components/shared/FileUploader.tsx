/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, File, Trash2, Eye, AlertCircle } from 'lucide-react';
import { UploadedFileMeta } from '../../types';
import { saveFileBlob, getFileBlob } from '../../utils/indexedDB';

interface FileUploaderProps {
  accept: string; // e.g., ".pdf,.jpg,.png"
  maxSizeMb?: number; // default is 20
  value?: UploadedFileMeta;
  onChange: (meta?: UploadedFileMeta) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  label?: string;
  fieldId: string;
}

export default function FileUploader({
  accept,
  maxSizeMb = 20,
  value,
  onChange,
  onPreview,
  label = '选择文件或拖拽至此',
  fieldId,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);

    // Validate size
    const limitBytes = maxSizeMb * 1024 * 1024;
    if (file.size > limitBytes) {
      setError(`文件过大！最大允许为 ${maxSizeMb} MB。该文件为 ${(file.size / (1024 * 1024)).toFixed(1)} MB。`);
      return;
    }

    // Validate type/extension
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map((e) => e.trim().toLowerCase());
    if (accept !== '*' && !acceptedExtensions.includes(fileExt)) {
      setError(`不支持的文件格式！仅支持 ${accept}`);
      return;
    }

    // Simulate upload progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 80);

    try {
      // Store in IndexedDB
      const fileId = `${fieldId}_${Date.now()}_${Math.random().toString(36).substring(4)}`;
      await saveFileBlob(fileId, file);

      // Create metadata
      const meta: UploadedFileMeta = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Wrap up progress and call parent
      setTimeout(() => {
        setProgress(null);
        onChange(meta);
      }, 400);

    } catch (e) {
      clearInterval(interval);
      setProgress(null);
      setError('保存到本地数据库时发生异常错误，请重试');
      console.error(e);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    onChange(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full text-slate-300">
      {value ? (
        /* File Uploaded view */
        <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-3 truncate">
            <div className="p-2 bg-slate-900 rounded text-amber-500 shrink-0">
              <File size={20} />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{value.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">
                {(value.size / 1024).toFixed(1)} KB | {value.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(value)}
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
              title="预览该图片/文件"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded transition-colors"
              title="清空重新上传"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone view */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
            dragActive
              ? 'border-amber-500 bg-amber-500/5'
              : 'border-slate-700 bg-slate-900 hover:border-slate-650 hover:bg-slate-800/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={accept}
            className="hidden"
          />

          {progress !== null ? (
            /* Progress view */
            <div className="w-full text-center py-2">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-2" />
              <p className="text-xs text-amber-400 font-medium">文件秒存归档中 {progress}%</p>
              <p className="text-[10px] text-slate-500 mt-1">请勿关闭浏览器</p>
            </div>
          ) : (
            /* Initial uploading icons view */
            <>
              <Upload
                size={22}
                className={`transition-colors duration-250 ${
                  dragActive ? 'text-amber-500 scale-110' : 'text-slate-500 group-hover:text-slate-400'
                }`}
              />
              <p className="text-xs font-semibold text-slate-350 mt-2.5 text-center">{label}</p>
              <p className="text-[10px] text-slate-550 mt-1">
                支持格式: <span className="font-mono text-slate-500">{accept}</span> | 大小上限 {maxSizeMb}MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 text-[11px] text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-1.5 rounded-md leading-normal select-none">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
