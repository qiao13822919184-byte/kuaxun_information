/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';
import { FormDataState, UploadedFileMeta } from '../../types';

interface StageProps {
  formData: FormDataState;
  onChange: (updater: (prev: FormDataState) => FormDataState) => void;
  onPreview: (meta: UploadedFileMeta) => void;
  nodeId: string;
}

export default function Stage7Contact({
  formData,
  onChange,
  onPreview,
  nodeId,
}: StageProps) {
  const { contacts } = formData;

  const updateContacts = (fieldset: Partial<typeof contacts>) => {
    onChange((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, ...fieldset },
    }));
  };

  const addEcommerce = () => {
    const updated = [...contacts.ecommerceMatrix, { id: 'eco_' + Date.now(), platform: 'Alibaba国际旺铺', url: '', isFeatured: true }];
    updateContacts({ ecommerceMatrix: updated });
  };

  const removeEcommerce = (id: string) => {
    updateContacts({ ecommerceMatrix: contacts.ecommerceMatrix.filter((e) => e.id !== id) });
  };

  const handleEcommerceChange = (id: string, fieldset: Partial<typeof contacts.ecommerceMatrix[0]>) => {
    updateContacts({
      ecommerceMatrix: contacts.ecommerceMatrix.map((e) => (e.id === id ? { ...e, ...fieldset } : e)),
    });
  };

  const addTeammate = () => {
    const updated = [
      ...contacts.contactsTeam,
      {
        id: 'team_' + Date.now(),
        name: '',
        position: '',
        email: '',
        phone: '',
        whatsApp: '',
        weChat: '',
        role: contacts.contactsTeam.length === 0 ? '项目主对接' : '外贸业务员',
      },
    ];
    updateContacts({ contactsTeam: updated });
  };

  const removeTeammate = (id: string) => {
    updateContacts({ contactsTeam: contacts.contactsTeam.filter((c) => c.id !== id) });
  };

  const handleTeammateChange = (id: string, fieldset: Partial<typeof contacts.contactsTeam[0]>) => {
    // If setting role to '项目主对接', set all other teammates to '外贸业务员' to preserve unique coordination
    let updated = contacts.contactsTeam.map((c) => {
      if (c.id === id) {
        return { ...c, ...fieldset };
      }
      if (fieldset.role === '项目主对接') {
        return { ...c, role: c.role === '项目主对接' ? '外贸业务员' : c.role };
      }
      return c;
    });
    updateContacts({ contactsTeam: updated });
  };

  switch (nodeId) {
    case 'ecommerceMatrix':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">公司现有电商、阿里旗舰店及独立官网运营矩阵</h3>
            <button
              type="button"
              onClick={addEcommerce}
              className="bg-slate-800 text-amber-500 hover:bg-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 登记店铺
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {contacts.ecommerceMatrix.map((eco) => (
              <div key={eco.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs">
                <div className="flex-1 flex flex-col md:flex-row gap-2">
                  <div className="w-44 shrink-0">
                    <select
                      value={eco.platform}
                      onChange={(e) => handleEcommerceChange(eco.id, { platform: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white font-semibold"
                    >
                      {['Alibaba国际旺铺', '独立站Shopify', 'Made-in-China (制造网)', 'Global Sources (环球资源)', 'Amazon 旗舰店', '1688批发商铺', '其他自营多渠道'].map((pf) => (
                        <option key={pf} value={pf}>{pf}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={eco.url}
                      onChange={(e) => handleEcommerceChange(eco.id, { url: e.target.value })}
                      placeholder="https://yourstore.en.alibaba.com (直达URL)"
                      className="w-full bg-slate-950 border border-slate-755 p-2 rounded text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 select-none">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      checked={eco.isFeatured}
                      onChange={(e) => handleEcommerceChange(eco.id, { isFeatured: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span>主推建档渠道</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeEcommerce(eco.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {contacts.ecommerceMatrix.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs italic bg-slate-900 border border-slate-850 rounded">
                您尚未登记旺铺网址。请点击右上方“登记店铺”添加至少一处在售公有旺铺网址。
              </div>
            )}
          </div>
        </div>
      );

    case 'contactsTeam':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-bold text-white">建档推进及联系主要跟单团队 (要求有一位主负责人)</label>
              <p className="text-[10px] text-slate-550">主对接责任制：系统提供邮箱/电话规范检验并强制唯一首脑协调</p>
            </div>
            <button
              type="button"
              onClick={addTeammate}
              className="bg-slate-800 text-amber-500 hover:bg-slate-705 font-semibold px-2.5 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1 leading-none"
            >
              <Plus size={14} /> 新增人员
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
            {contacts.contactsTeam.map((c, i) => (
              <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-850 pb-1.5 text-xs text-slate-550">
                  <span className="font-bold text-amber-550">跟单骨干跟进职员 #0{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTeammate(c.id)}
                    className="text-[10px] text-slate-500 hover:text-red-400"
                  >
                    移除
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-white">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">对接人姓名</span>
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => handleTeammateChange(c.id, { name: e.target.value })}
                      placeholder="谢晓芬"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">对接人本厂具体职位</span>
                    <input
                      type="text"
                      value={c.position}
                      onChange={(e) => handleTeammateChange(c.id, { position: e.target.value })}
                      placeholder="外贸高级顾问"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">对接项目协调职责角色</span>
                    <select
                      value={c.role}
                      onChange={(e) => handleTeammateChange(c.id, { role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-755 p-2 text-xs rounded font-bold"
                    >
                      <option value="项目主对接">项目主对接 (唯一首脑)</option>
                      <option value="外贸客盘跟单">外贸金牌标兵</option>
                      <option value="现场安全及拍摄协助负责人">现场摄制及安全协调负责人</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">工作电子邮箱 (严格格式)</span>
                    <input
                      type="email"
                      value={c.email}
                      onChange={(e) => handleTeammateChange(c.id, { email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-slate-950 border border-slate-750 p-2 text-xs rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs text-white">
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">手机号码（包含国际区号）</span>
                    <input
                      type="text"
                      value={c.phone}
                      onChange={(e) => handleTeammateChange(c.id, { phone: e.target.value })}
                      placeholder="+86 138 2291 9184"
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">WhatsApp 号码</span>
                    <input
                      type="text"
                      value={c.whatsApp}
                      onChange={(e) => handleTeammateChange(c.id, { whatsApp: e.target.value })}
                      placeholder="+8613822919184"
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 mb-1">微信号码</span>
                    <input
                      type="text"
                      value={c.weChat}
                      onChange={(e) => handleTeammateChange(c.id, { weChat: e.target.value })}
                      placeholder="xiaofen_sales"
                      className="w-full bg-slate-950 border border-slate-750 p-2 rounded font-mono"
                    />
                  </div>
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
