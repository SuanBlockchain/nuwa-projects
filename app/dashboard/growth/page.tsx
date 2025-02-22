import Breadcrumbs from '@/app/ui/growth/breadcrumbs';
import GrowthComponent from '@/app/ui/growth/growth-components';

export default async function Growth() {

  return (
    <div className="flex-grow p-6 md:overflow-y-auto md:p-12 w-full md:w-auto overflow-x-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Growth', href: '/growth', active: true }
        ]}
      />
      <GrowthComponent />
    </div>
  );
}
