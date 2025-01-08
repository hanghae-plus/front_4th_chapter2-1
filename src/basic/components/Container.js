import { createWrapElement } from '../renders/warp';

export const Container = () => {
  return `
    <div class="bg-gray-100 p-8">
      ${createWrapElement().outerHTML}
    </div>
  `;
};
