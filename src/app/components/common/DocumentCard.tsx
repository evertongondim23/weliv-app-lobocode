import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentCardProps {
  title: string;
  type: string;
  uploadDate: string;
  fileSize?: string;
  onView?: () => void;
  onDownload?: () => void;
}

export function DocumentCard({ 
  title, 
  type, 
  uploadDate, 
  fileSize = '2.4 MB',
  onView,
  onDownload 
}: DocumentCardProps) {
  const typeColors: Record<string, string> = {
    'Exame': '#3B82F6',
    'Receita': '#10B981',
    'Laudo': '#8B5CF6',
    'Atestado': '#F59E0B',
    'Relatório': '#EC4899',
  };

  const typeColor = typeColors[type] || '#FFA500';

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="h-2 w-full" style={{ background: typeColor }} />
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div 
            className="p-4 rounded-xl"
            style={{ background: `${typeColor}20` }}
          >
            <FileText className="size-8" style={{ color: typeColor }} />
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#4A3728' }}>
                  {title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge style={{ background: typeColor }}>{type}</Badge>
                  <span className="text-xs" style={{ color: '#6B5D53' }}>
                    {format(new Date(uploadDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <span className="text-xs" style={{ color: '#6B5D53' }}>
                    • {fileSize}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onView && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onView}
                  className="border-2"
                  style={{ borderColor: typeColor, color: typeColor }}
                >
                  <Eye className="size-4 mr-1" />
                  Visualizar
                </Button>
              )}
              {onDownload && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onDownload}
                  className="border-2"
                  style={{ borderColor: typeColor, color: typeColor }}
                >
                  <Download className="size-4 mr-1" />
                  Baixar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
