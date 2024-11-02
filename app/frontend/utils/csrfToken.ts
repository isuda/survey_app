export const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
  return token && token.content;
};
