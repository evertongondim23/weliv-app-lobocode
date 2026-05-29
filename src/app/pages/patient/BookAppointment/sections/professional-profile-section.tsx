import { AlertCircle, CreditCard, DollarSign, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';
import {
  ADDRESS_BOX_BORDER,
  ALERT_BOX_STYLE,
  AVATAR_BORDER_COLOR,
  AVATAR_FALLBACK_STYLE,
  CARD_BORDER_STYLE,
  CARD_TOP_BAR_STYLE,
  MUTED_COLOR,
  PRIMARY_GRADIENT_STYLE,
  TITLE_COLOR,
} from '../constants/book-appointment.constants';
import type { ProfessionalProfileSectionProps } from '../types/book-appointment.types';

export function ProfessionalProfileSection({
  professional,
  depositInfo,
}: ProfessionalProfileSectionProps) {
  const { depositAmount, requiresDeposit } = depositInfo;

  return (
    <Card className="border-2 shadow-md overflow-hidden" style={CARD_BORDER_STYLE}>
      <div className="h-1.5 w-full" style={CARD_TOP_BAR_STYLE} />
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6 items-center">
          <Avatar className="size-20 border-2" style={{ borderColor: AVATAR_BORDER_COLOR }}>
            <AvatarImage src={professional.avatar} alt={professional.name} />
            <AvatarFallback style={AVATAR_FALLBACK_STYLE}>
              {professional.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-1" style={{ color: TITLE_COLOR }}>
              {professional.name}
            </h1>
            <p className="text-sm mb-1" style={{ color: MUTED_COLOR }}>
              {professional.professionalTitle?.trim() || professional.registrationNumber}
            </p>
            <Badge className="mb-2" style={{ ...PRIMARY_GRADIENT_STYLE, color: 'white', border: 'none' }}>
              {professional.specialty}
            </Badge>
            {professional.biography?.trim() ? (
              <p className="text-sm leading-relaxed line-clamp-4" style={{ color: MUTED_COLOR }}>
                {professional.biography.trim()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div
            className="flex items-center gap-2 text-muted-foreground rounded-lg px-3 py-2 border"
            style={ADDRESS_BOX_BORDER}
          >
            <MapPin className="size-4" />
            <span className="text-sm">{professional.address}</span>
          </div>

          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border"
            style={ALERT_BOX_STYLE}
          >
            <DollarSign className="size-4 text-green-600" />
            <span className="font-semibold" style={{ color: TITLE_COLOR }}>
              R$ {professional.consultationPrice.toFixed(2)}
            </span>
          </div>

          {requiresDeposit && (
            <Alert className="border-2" style={ALERT_BOX_STYLE}>
              <CreditCard className="size-4" />
              <AlertDescription>
                Este profissional requer {professional.depositPercentage}% de depósito no ato da
                marcação (R$ {depositAmount.toFixed(2)})
              </AlertDescription>
            </Alert>
          )}
        </div>

        {professional.remarcationEnabled && (
          <Alert className="mb-1 border-2" style={CARD_BORDER_STYLE}>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Remarcações permitidas: até {professional.remarcationLimit}x por consulta
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
