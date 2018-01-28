import { trigger, transition } from '@angular/animations';

import { slideIn, zoomIn } from '../../shared/animations';

export const imgPreviewStateTrigger = trigger('imgPreviewState', [
  transition(':enter', zoomIn('0.6', '200ms ease-out'))
]);
