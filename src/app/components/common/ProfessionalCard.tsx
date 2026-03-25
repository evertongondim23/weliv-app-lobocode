import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, DollarSign, Star } from 'lucide-react';

interface ProfessionalCardProps {
  id: string;
  name: string;
  specialty: string;
  location: string;
  consultationPrice: number;
  rating: number;
  avatar?: string;
  available: boolean;
  onBookClick: (id: string) => void;
}

export function ProfessionalCard({
  id,
  name,
  specialty,
  location,
  consultationPrice,
  rating,
  avatar,
  available,
  onBookClick
}: ProfessionalCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div 
        className="h-2 w-full" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }} 
      />
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="size-16 border-2" style={{ borderColor: '#FFA500' }}>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback 
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: '#4A3728' }}>
                  {name}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: '#FFA500' }}>
                  {specialty}
                </p>
              </div>
              <Badge 
                variant={available ? 'default' : 'secondary'}
                style={available ? { background: '#4CAF50' } : {}}
              >
                {available ? 'Disponível' : 'Indisponível'}
              </Badge>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5D53' }}>
                <MapPin className="size-4 text-[#FFA500]" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5D53' }}>
                <DollarSign className="size-4 text-[#FFA500]" />
                <span className="font-semibold">R$ {consultationPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5D53' }}>
                <Star className="size-4 text-[#FFA500]" fill="#FFA500" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <span>(Avaliações)</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full"
              disabled={!available}
              onClick={() => onBookClick(id)}
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
            >
              Agendar Consulta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
