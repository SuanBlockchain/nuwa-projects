import Breadcrumbs from '@/app/ui/breadcrumbs';
import GrowthComponent from '@/app/ui/growth/growth-components';

export default async function Growth() {

  return (
    <div className="flex-grow p-4 md:overflow-y-auto md:p-12">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Growth', href: '/growth', active: true }
        ]}
      />
      <div className="mt-6 rounded-md border bg-gray-50 dark:bg-zinc-900">
      <GrowthComponent />
      </div>
    </div>
  );
}
