import { trigger, transition, group, query } from '@angular/animations';

import { slideIn, slideOut } from './shared/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('home => places',
    group([
      query(':enter', slideIn('0, -20%', '500ms ease-out'), { optional: true }),
      query(':leave', slideOut('0, 100%', '300ms'), { optional: true })
    ])
  )
])
