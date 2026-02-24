<script lang="ts">
  export let className = '';
  export let ariaLabel: string = 'Calendario';
</script>

<svg
  viewBox="12 2 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={"w-full h-full block " + className}
  role="img"
  aria-label={ariaLabel}
>
  <g>
    <path
      d="M12 16C12 8.26801 18.268 2 26 2H45.9911C53.7231 2 59.9911 8.26801 59.9911 16V35.9911C59.9911 43.7231 53.7231 49.9911 45.9911 49.9911H26C18.268 49.9911 12 43.7231 12 35.9911V16Z"
      fill="url(#paint0_linear_445_352)"
    />
    <path d="M31.9963 15.9974V19.9974" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M39.9948 15.9974V19.9974" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M42.9943 17.9971H28.9969C27.8925 17.9971 26.9972 18.8923 26.9972 19.9967V33.9941C26.9972 35.0985 27.8925 35.9937 28.9969 35.9937H42.9943C44.0986 35.9937 44.9939 35.0985 44.9939 33.9941V19.9967C44.9939 18.8923 44.0986 17.9971 42.9943 17.9971Z"
      stroke="white"
      stroke-width="2"
    />
    <path d="M26.9972 23.996H44.9939" stroke="white" stroke-width="2"/>
  </g>

  <defs>
    <linearGradient id="paint0_linear_445_352" x1="12" y1="2" x2="60" y2="50">
      <stop stop-color="#0C2C65" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#0C2C65"/>
    </linearGradient>
  </defs>
</svg>