<script>
  import { interpolateRgb } from 'd3-interpolate';

  export let temperature;
  export let progression;

  $: colorScaleToRed = interpolateRgb('#192A3F', '#762401')
  $: colorScaleToBlack = interpolateRgb('#762401', '#010609')

  $: backgroundColor = progression > 0.9 ? colorScaleToBlack((progression - 0.9) * 10) : colorScaleToRed(Math.max(temperature, 0))
  $: inlineStyle = `background-color: ${backgroundColor};`
</script>

<div style={inlineStyle} class="lm-climat-intro_background" />

<style>
  .lm-climat-intro_background {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: -1;
  }
</style>
