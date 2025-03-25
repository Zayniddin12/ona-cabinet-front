<template>
  <div class="close__custom">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16797 4.1665L15.8339 15.8324"
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.16713 15.8324L15.833 4.1665"
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style lang="scss">
.close__custom {
  position: relative;
  padding-left: 18px !important;
  margin-left: 4px !important;

  &::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 28px;
    background: #fff;
    top: 0;
    left: 0;
  }
}
</style>
