// data/showcasePresets.js

// A single default preset
export const SHOWCASE_DEFAULT = {
  bg: "/assets/models/model-list-bg1.webp",
  mobileBg: "/assets/models/pro-mobilebg.webp",
  car: "/assets/models/car-list-u70.webp",
  title: "U70PRO",
  subtitle: "Off-road power meets everyday comfort.",
  learnHref: "/models/sinotruk-vgv-u70-pro",
  modalImage: "/assets/popup/u70pro-popup.webp",
  reverse: false,
};

// (Optional) multiple presets by model
export const SHOWCASE_PRESETS = {
  u70pro: { ...SHOWCASE_DEFAULT },
  u75plus: {
    bg: "/assets/models/model-list-bg2.webp",
    mobileBg: "/assets/models/plus-mobilebg.webp",
    car: "/assets/models/car-list-u75.webp",
    title: "U75PLUS",    
    subtitle: "Elevate every journey with comfort and tech that just works.",
    learnHref: "/models/sinotruk-vgv-u75-plus",
    modalImage: "/assets/popup/u75plus-popup.webp",
    reverse: true,
  },
};

export default SHOWCASE_DEFAULT;
