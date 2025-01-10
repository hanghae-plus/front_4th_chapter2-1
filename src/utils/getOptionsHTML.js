import { createOpt } from '../components/opt';

export const getOptionsHTML = ({ prodList }) => {
  return prodList
    .map((x) =>
      createOpt({
        value: x.id,
        text: x.name + ' - ' + x.val + '원',
        disabled: x.q === 0,
      }),
    )
    .map((x) => x.outerHTML)
    .join('');
};
