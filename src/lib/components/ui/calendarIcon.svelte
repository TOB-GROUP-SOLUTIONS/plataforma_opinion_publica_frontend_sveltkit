<script lang="ts">
  export let width: number = 72;
  export let height: number = 72;
  export let className: string = '';
  export let ariaLabel: string = 'Calendario';
</script>

<svg
  {width}
  {height}
  viewBox="0 0 72 72"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  role="img"
  aria-label={ariaLabel}
>
  <g filter="url(#filter0_dd_445_352)">
    <path d="M12 16C12 8.26801 18.268 2 26 2H45.9911C53.7231 2 59.9911 8.26801 59.9911 16V35.9911C59.9911 43.7231 53.7231 49.9911 45.9911 49.9911H26C18.268 49.9911 12 43.7231 12 35.9911V16Z" fill="url(#paint0_linear_445_352)" shape-rendering="crispEdges"/>
    <path d="M31.9963 15.9974V19.9974" stroke="white" stroke-width="1.99963" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M39.9948 15.9974V19.9974" stroke="white" stroke-width="1.99963" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.9943 17.9971H28.9969C27.8925 17.9971 26.9972 18.8923 26.9972 19.9967V33.9941C26.9972 35.0985 27.8925 35.9937 28.9969 35.9937H42.9943C44.0986 35.9937 44.9939 35.0985 44.9939 33.9941V19.9967C44.9939 18.8923 44.0986 17.9971 42.9943 17.9971Z" stroke="white" stroke-width="1.99963" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26.9972 23.996H44.9939" stroke="white" stroke-width="1.99963" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <filter id="filter0_dd_445_352" x="0" y="0" width="71.9911" height="71.9911" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_445_352"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="3"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_445_352"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect2_dropShadow_445_352"/>
      <feOffset dy="10"/>
      <feGaussianBlur stdDeviation="7.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_445_352" result="effect2_dropShadow_445_352"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_445_352" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_445_352" x1="12" y1="2" x2="59.9911" y2="49.9911" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0C2C65" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#0C2C65"/>
    </linearGradient>
  </defs>
</svg>