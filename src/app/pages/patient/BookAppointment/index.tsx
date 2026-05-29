import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { BookAppointmentNotFound } from './components/book-appointment-not-found';
import { PaymentDepositDialog } from './components/payment-deposit-dialog';
import { WaitingListDialog } from './components/waiting-list-dialog';
import { OUTLINE_BUTTON_STYLE } from './constants/book-appointment.constants';
import { useBookAppointment } from './hooks/use-book-appointment';
import { AppointmentCalendarSection } from './sections/appointment-calendar-section';
import { AppointmentSummarySection } from './sections/appointment-summary-section';
import { AvailableSlotsSection } from './sections/available-slots-section';
import { ProfessionalProfileSection } from './sections/professional-profile-section';

export function BookAppointment() {
  const {
    professional,
    notFound,
    navigateToSearch,
    depositInfo,
    selectedDate,
    selectedTime,
    calendar,
    slots,
    summary,
    paymentDialog,
    waitingListDialog,
  } = useBookAppointment();

  if (notFound || !professional) {
    return <BookAppointmentNotFound onBack={navigateToSearch} />;
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <Button
        variant="outline"
        onClick={navigateToSearch}
        className="w-fit border-2 hover:bg-[#FFF8E7]"
        style={OUTLINE_BUTTON_STYLE}
      >
        <ArrowLeft className="size-4 mr-2" />
        Voltar
      </Button>

      <ProfessionalProfileSection professional={professional} depositInfo={depositInfo} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentCalendarSection {...calendar} />
        <AvailableSlotsSection professional={professional} {...slots} />
      </div>

      {selectedDate && selectedTime && (
        <AppointmentSummarySection professional={professional} {...summary} />
      )}

      <PaymentDepositDialog professional={professional} {...paymentDialog} />
      <WaitingListDialog {...waitingListDialog} />
    </div>
  );
}
