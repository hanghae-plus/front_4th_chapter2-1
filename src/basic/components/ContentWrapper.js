export default function ContentWrapper() {
  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  return contentWrapper;
}
