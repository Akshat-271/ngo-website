const track = document.querySelector(".carousel-track");
const images = Array.from(document.querySelectorAll(".carousel-img"));

let index = 0;

// Helper to update the center image
function updateCarousel() {
    images.forEach(img => img.classList.remove("active"));

    // Apply "active" to center image
    images[index].classList.add("active");

    // Move track so active image comes to center
    const offset = (index * (images[0].offsetWidth + 40)) - 
                   (track.parentElement.offsetWidth / 2) + 
                   (images[0].offsetWidth / 2);

    track.style.transform = `translateX(-${offset}px)`;
}

// Auto-slide every 2 seconds
setInterval(() => {
    index++;
    if (index >= images.length) index = 0;
    updateCarousel();
}, 2000);

// Initial position
window.onload = () => {
    setTimeout(updateCarousel, 200);
};
