// Query selectors
// const carousel = document.querySelector(".carousel");
// // carousel.innerHTML = content;

// const container = document.querySelector(".testimonial");
// const arrowButtons = document.querySelectorAll(".container i");
// const firstCardWidth = carousel.querySelector(".slide").offsetWidth;
// const carouselChildren = [...carousel.children];

// initial values
// let isDragging = false,
//   startX,
//   startScrollLeft,
//   timeoutId;

// let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

/**
 * @function dragStart
 * @description this function apply when the mouse is down to enable the scrolling
 * @param e target event
 */
// const dragStart = (e) => {
//   isDragging = true;
//   carousel.classList.add("dragging");
//   startX = e.pageX;
//   startScrollLeft = carousel.scrollLeft;
// };

/**
 * @function dragging
 * @description this function apply when the mouse is move and calculate the carousel scrolling
 * @param e
 */
// const dragging = (e) => {
//   if (!isDragging) return;
//   carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
// };

/**
 * @function dragStop
 * @description this function apply when the mouse is up to stop the dragging
 */
// const dragStop = () => {
//   isDragging = false;
//   carousel.classList.remove("dragging");
// };

/**
 * Handle arrows clicking
 */
// arrowButtons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     console.log("clicked");
//     carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;

//     console.log(carousel.scrollLeft);
//   });
// });

// insert copies of the last few cards to the beginning of carousel for infinite scrolling
// carouselChildren
//   .slice(-cardPerView)
//   .reverse()
//   .forEach((card) => {
//     carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
//   });

// insert copies of the first few cards to the end of carousel for infinite scrolling
// carouselChildren
//   .slice(0, cardPerView)

//   .forEach((card) => {
//     carousel.insertAdjacentHTML("beforeend", card.outerHTML);
//   });

// const InfinityScroll = () => {
//   // if the carousel is at the beginning, scroll to the end
//   if (carousel.scrollLeft === 0) {
//     carousel.classList.add("no-transition");
//     carousel.scrollLeft =
//       carousel.scrollWidth - carouselChildren.length * carousel.offsetWidth;
//     carousel.classList.remove("no-transition");
//   }
//   // if the carousel is at the end, scroll to the beginning
//   else if (
//     Math.ceil(carousel.scrollLeft) ===
//     carousel.scrollWidth - carousel.offsetWidth
//   ) {
//     carousel.classList.add("no-transition");
//     carousel.scrollLeft = carousel.offsetWidth;
//     carousel.classList.remove("no-transition");
//   }

//   //   Clear existing timeout and start autoplay if ouse is not hovering over carousel
//   clearTimeout(timeoutId);
//   //   if (!container.matches(":hover")) autoPlay();
// };

// Auto playing the slider
// const autoPlay = () => {
//   timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2000);
// };
// autoPlay();
// Event Listener
// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// document.addEventListener("mouseup", dragStop);
// carousel.addEventListener("scroll", InfinityScroll);
// container.addEventListener("mouseenter", () => clearTimeout(timeoutId));
// container.addEventListener("mouseleave", autoPlay);
