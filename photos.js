const lightbox = document.querySelector('#photo-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');

document.querySelectorAll('.photo-open').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.src;
    lightboxImage.alt = button.dataset.alt;
    lightbox.showModal();
  });
});

document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
