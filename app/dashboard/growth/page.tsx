import Breadcrumbs from '@/app/ui/growth/breadcrumbs';
import GrowthComponent from '@/app/ui/growth/growth-components';

export default async function Growth() {

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Growth', href: '/growth', active: true }
          ]}/>
      <GrowthComponent />
    </div>
  );
}
