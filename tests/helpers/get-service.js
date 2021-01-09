import { getContext } from '@ember/test-helpers';

export default function(serviceName) {
  let context = getContext();
  return context.owner.lookup(`service:${serviceName}`);
}
