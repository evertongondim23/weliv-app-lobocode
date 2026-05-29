import React, { useState } from 'react';
import { Building2, Clock, DollarSign, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../app/components/ui/tabs';
import { useClinic } from '../../contexts/ClinicContext';

export function ClinicSettings() {
  const { clinic } = useClinic();
  const [clinicName, setClinicName] = useState(clinic?.name ?? '');
  const [cnpj, setCnpj] = useState('12.345.678/0001-99');
  const [phone, setPhone] = useState('(11) 3000-0000');
  const [address, setAddress] = useState('Av. Paulista, 1000 — São Paulo, SP');
  const [depositPct, setDepositPct] = useState('0');

  const inputStyle = { borderColor: 'rgba(255,165,0,0.25)' };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Configurações</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>Parâmetros da clínica</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0 gap-6 mb-6" style={{ borderColor: 'rgba(74,55,40,0.1)' }}>
          {[
            { value: 'profile', label: 'Perfil', icon: Building2 },
            { value: 'schedule', label: 'Políticas de Agenda', icon: Clock },
            { value: 'financial', label: 'Financeiro', icon: DollarSign },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium data-[state=active]:border-[#FFA500] data-[state=active]:text-[#4A3728] data-[state=inactive]:text-[#6B5D53]"
            >
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4 border-b" style={{ borderColor: 'rgba(255,165,0,0.12)' }}>
              <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Informações da Clínica</p>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>Nome da Clínica</Label>
                <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="border-2" style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>CNPJ</Label>
                <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="border-2" style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>Telefone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="border-2" style={inputStyle} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>Endereço Principal</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="border-2" style={inputStyle} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }} className="gap-2 border-0">
                  <Save className="size-4" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4 border-b" style={{ borderColor: 'rgba(255,165,0,0.12)' }}>
              <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Políticas de Agenda (padrão da clínica)</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>Profissionais podem sobrepor esses valores nas suas configurações individuais.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {[
                { label: 'Permitir remarcação', id: 'remarcation', type: 'checkbox' as const, defaultChecked: true },
                { label: 'Ativar lista de espera', id: 'waiting', type: 'checkbox' as const, defaultChecked: false },
              ].map(({ label, id, type, defaultChecked }) => (
                <div key={id} className="flex items-center justify-between">
                  <Label htmlFor={id} className="text-sm font-medium cursor-pointer" style={{ color: '#4A3728' }}>{label}</Label>
                  <input id={id} type={type} defaultChecked={defaultChecked} className="size-4 accent-[#FFA500]" />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }} className="gap-2 border-0">
                  <Save className="size-4" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4 border-b" style={{ borderColor: 'rgba(255,165,0,0.12)' }}>
              <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Parâmetros Financeiros</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>Percentual de sinal obrigatório (%)</Label>
                <div className="flex gap-2">
                  {['0', '10', '30', '100'].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositPct(pct)}
                      className="flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition-all"
                      style={
                        depositPct === pct
                          ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white', borderColor: 'transparent' }
                          : { borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728', background: 'white' }
                      }
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }} className="gap-2 border-0">
                  <Save className="size-4" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
