import { CalendarClock, FileText, KeyRound, Link2, Wallet } from 'lucide-react';
import type { PendingType } from '../../../services/pending.service';

export const typeIcons: Record<PendingType, React.ReactNode> = {
  integration: <Link2 className="size-3.5 shrink-0" />,
  document: <FileText className="size-3.5 shrink-0" />,
  finance: <Wallet className="size-3.5 shrink-0" />,
  schedule: <CalendarClock className="size-3.5 shrink-0" />,
  access: <KeyRound className="size-3.5 shrink-0" />,
};
