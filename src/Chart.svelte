<script>
  import { scaleTime, scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { line } from 'd3-shape';

  import Background from './Background.svelte';

  export let progression;
  export let width;
  export let height;
  export let data;

  const margin = 40;
  const offset = 50;
  const dezoomYearStart = 0;
  const yearStart = 1800;
  const yearEnd = 2021;
  let infosHeight = 0;

  const tippingPoint = 0.6;

  const scrollScale = scaleLinear()
    .domain([0, tippingPoint])
    .range([yearStart, yearEnd - offset])
    .clamp(true);

  const dezoomScale = scaleLinear()
    .domain([tippingPoint, 0.9])
    .range([yearEnd - offset, dezoomYearStart])
    .clamp(true);

  $: timeStart =
    progression > tippingPoint
      ? dezoomScale(progression)
      : scrollScale(progression);
  $: timeEnd =
    progression > tippingPoint ? yearEnd : scrollScale(progression) + offset;

  $: currentYear = Math.round(timeEnd);

  $: xScale = scaleTime().domain([timeStart, timeEnd]).range([0, width]);

  $: yScale = scaleLinear()
    .domain(
      extent(data.rawEmissions, (d) => {
        if (d.year > dezoomYearStart) {
          return d.deseasonalized;
        }
      })
    )
    .range([height - margin, 0]);

  $: lineGenerator = line()
    .x((d) => xScale(+d.year))
    .y((d) => yScale(+d.deseasonalized));

  $: chartInlineStyle = `width: ${width}px; height: ${height}px;`;

  $: infosPosition = Math.max(
    yScale(data.emissionsByYear[currentYear]) - infosHeight,
    12
  );
  $: infosInlineStyle = `top: ${infosPosition}px`;
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div style={chartInlineStyle} class="lm-climat-intro_chart">
  <Background
    {progression}
    temperature={data.temperatureByYear[currentYear]}
  />

  {#if width}
    <svg {width} {height}>
      <path
        d={lineGenerator(data.rawEmissions)}
        stroke="white"
        stroke-width={3}
        stroke-linecap="round"
        fill="none"
      />
    </svg>

    {#if currentYear && data.emissionsByYear[currentYear]}
      <div
        bind:clientHeight={infosHeight}
        style={infosInlineStyle}
        class="lm-climat-intro_infos"
      >
        <p>{currentYear}</p>
        <p>{data.emissionsByYear[currentYear]} ppm</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .lm-climat-intro_chart {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .lm-climat-intro_infos {
    font-family: 'Roboto Mono', 'Marr Sans';
    color: #fff;
    position: absolute;
    text-align: right;
    top: 12px;
    right: 12px;
    font-weight: 500;
    font-size: 14px;
    padding-bottom: 12px;
  }

  .lm-climat-intro_infos p {
    margin: 0;
  }

  .lm-climat-intro_infos p + p {
    font-weight: 300;
  }
</style>
