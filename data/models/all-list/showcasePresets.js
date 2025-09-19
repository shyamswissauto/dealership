// data/showcasePresets.js

// A single default preset
export const SHOWCASE_DEFAULT = {
  bg: "/assets/models/model-list-bg1.webp",
  mobileBg: "/assets/models/model-list-mobile-bg1.webp",
  car: "/assets/models/car-list-u70.webp",
  title: "U75PLUS",
  subtitle: "Elevate every journey with comfort and tech that just works.",
  learnHref: "/models/sinotruk-vgv-u75-plus",
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
    title: "U70PRO",
    subtitle: "Off-road power meets everyday comfort.",
    learnHref: "/models/sinotruk-vgv-u70-pro",
    modalImage: "/assets/models/book-a-test-drive.webp",
    reverse: true,
  },
};

export default SHOWCASE_DEFAULT;
