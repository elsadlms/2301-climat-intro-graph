<script>
  import { scaleTime, scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { line } from 'd3-shape';

  export let progression;
  export let width;
  export let height;
  export let data;

  const margin = 40;
  const yearStart = 1840;
  const yearStep = 1896;
  const yearEnd = 2021;
  let infosHeight = 0;
  let infosWidth = 0;

  $: scrollScale1 = scaleLinear()
    .domain([0, 0.33])
    .range([yearStart, yearStep])
    .clamp(true);
  $: scrollScale2 = scaleLinear()
    .domain([0.33, 1])
    .range([yearStep, yearEnd])
    .clamp(true);
  $: scrollScale = (progression) =>
    progression < 0.33 ? scrollScale1(progression) : scrollScale2(progression);

  $: currentYear = Math.round(scrollScale(progression));

  $: xScale1 = scaleTime()
    .domain([yearStart, yearStep])
    .range([0, width * 0.33]);
  $: xScale2 = scaleTime()
    .domain([yearStep, yearEnd])
    .range([width * 0.33, width]);
  $: xScale = (year) => (year < yearStep ? xScale1(year) : xScale2(year));

  $: yScale = scaleLinear()
    .domain(
      extent(data.rawEmissions, (d) => {
        if (d.year > yearStart) {
          return d.deseasonalized;
        }
      })
    )
    .range([height - margin * 2, margin / 2]);

  $: lineGenerator = line()
    .x((d) => xScale(+d.year))
    .y((d) => yScale(+d.deseasonalized));

  $: formattedEmissions = Number(data.emissionsByYear[currentYear]).toFixed(1).toString().replace('.', ',');

  $: clipWidth = progression > 0 ? progression * width : 0;

  $: chartInlineStyle = `width: ${width}px; height: ${height}px;`;

  $: dotPositionTop = yScale(data.emissionsByYear[currentYear]) - 14;
  $: dotPositionLeft = xScale(currentYear) - 14;

  $: valuePositionTop = yScale(data.emissionsByYear[currentYear]) - infosHeight;
  $: valuePositionLeft = Math.min(
    xScale(currentYear) - infosWidth / 2,
    width - 180
  );

  $: dotStyle = `top: ${dotPositionTop}px; left: ${dotPositionLeft}px;`;
  $: valueStyle = `
    top: ${valuePositionTop < 0 ? 12 : valuePositionTop}px; 
    left: ${valuePositionLeft < 0 ? 12 : valuePositionLeft}px;
  `;
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div style={chartInlineStyle} class="lm-climat-intro_chart">
  {#if width}
    <svg {width} {height} clip-path="url(#lm-clip-reveal)">
      <clipPath id="lm-clip-reveal">
        <rect width={clipWidth} {height} />
      </clipPath>
      <path
        d={lineGenerator(data.rawEmissions)}
        stroke="#FF6933"
        stroke-width={4}
        stroke-linecap="round"
        fill="none"
      />
    </svg>

    {#if currentYear && data.emissionsByYear[currentYear]}
      <div class="lm-climat-intro_year">
        <p>{currentYear}</p>
      </div>

      <div
        bind:clientHeight={infosHeight}
        bind:clientWidth={infosWidth}
        style={valueStyle}
        class="lm-climat-intro_value"
      >
        <p class="lm-climat-intro_value_label">Concentration en CO<sub>2</sub></p>
        <p class="lm-climat-intro_value_number">
          <span>{formattedEmissions}</span>
          <span>parties<br />par million</span>
        </p>
      </div>
      <div style={dotStyle} class="lm-climat-intro_value_dot" />
    {/if}
  {/if}
</div>

<style>
  .lm-climat-intro_chart {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    /* à suppr */
    /* background: #000;
    position: fixed; */
  }

  .lm-climat-intro_year {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 33vw;
    font-weight: 600;
    position: absolute;
    top: 0;
    color: #fff;
    opacity: 0.08;
    font-family: 'Roboto Mono';
    user-select: none;
  }

  .lm-climat-intro_value {
    color: #fff;
    position: absolute;
    text-align: center;
    font-weight: 500;
    margin-top: 12px;
    padding-bottom: 36px;
    line-height: 150%;
  }

  .lm-climat-intro_value p {
    margin: 0;
  }

  .lm-climat-intro_value_label {
    text-transform: uppercase;
    letter-spacing: 0.2px;
    font-size: 10px;
    opacity: 0.6;
  }

  .lm-climat-intro_value_number {
    font-size: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lm-climat-intro_value_number span {
    display: block;
  }

  .lm-climat-intro_value_number span:nth-child(2) {
    font-size: 9px;
    line-height: 10px;
    text-transform: uppercase;
    text-align: left;
    padding-left: 6px;
  }

  .lm-climat-intro_value_dot {
    height: 28px;
    width: 28px;
    background-color: #ff6933;
    display: inline-block;
    border-radius: 28px;
    position: absolute;
  }
</style>
