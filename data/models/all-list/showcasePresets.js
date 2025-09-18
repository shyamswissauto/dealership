// data/showcasePresets.js

// A single default preset
export const SHOWCASE_DEFAULT = {
  bg: "/assets/models/model-list-bg1.webp",
  mobileBg: "/assets/models/model-list-mobile-bg1.webp",
  car: "/assets/models/car-list-u70.webp",
  title: "U70 PRO",
  subtitle: "Elevate every journey with comfort and tech that just works.",
  learnHref: "#",
  modalImage: "/assets/models/book-a-test-drive.webp",
  reverse: false,
};

// (Optional) multiple presets by model
export const SHOWCASE_PRESETS = {
  u70pro: { ...SHOWCASE_DEFAULT },
  s9offroad: {
    bg: "/assets/models/model-list-bg2.webp",
    mobileBg: "/assets/models/model-list-bg2.webp",
    car: "/assets/models/car-list-u75.webp",
    title: "BOLDEN S9",
    subtitle: "Off-road power meets everyday comfort.",
    learnHref: "/models/s9",
    modalImage: "/assets/models/book-a-test-drive.webp",
    reverse: true,
  },
};

export default SHOWCASE_DEFAULT;
