import { StyledTabs } from '../../../app/components/common/StyledTabs';
import { useAdminUnitsServicesPage } from './hooks/use-admin-units-services-page';
import { ServicesListSection } from './sections/services-list-section';
import { SpecialtiesTabSection } from './sections/specialties-tab-section';
import { UnitsTabSection } from './sections/units-tab-section';

export function AdminUnitsServicesPage() {
  const { servicesCount, specialtiesCount, servicesTab } = useAdminUnitsServicesPage();

  return (
    <StyledTabs
      defaultValue="services"
      tabs={[
        {
          value: 'units',
          label: 'Unidades',
          content: <UnitsTabSection />,
        },
        {
          value: 'specialties',
          label: 'Especialidades',
          count: specialtiesCount,
          content: <SpecialtiesTabSection />,
        },
        {
          value: 'services',
          label: 'Serviços',
          count: servicesCount,
          content: <ServicesListSection {...servicesTab} />,
        },
      ]}
    />
  );
}
