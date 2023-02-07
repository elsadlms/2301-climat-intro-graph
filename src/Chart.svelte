<script>
  import { scaleTime, scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { line } from 'd3-shape';

  export let progression;
  export let width;
  export let height;
  export let data;

  const margin = 40;
  const yearStart = 1600;
  const yearEnd = 2021;
  let infosHeight = 0;
  let infosWidth = 0;

  const scrollScale = scaleLinear()
    .domain([0, 1])
    .range([yearStart, yearEnd])
    .clamp(true);

  $: currentYear = Math.round(scrollScale(progression));

  $: xScale = scaleTime().domain([yearStart, yearEnd]).range([0, width]);

  $: yScale = scaleLinear()
    .domain(
      extent(data.rawEmissions, (d) => {
        if (d.year > yearStart) {
          return d.deseasonalized;
        }
      })
    )
    .range([height - margin * 2, margin/2]);

  $: lineGenerator = line()
    .x((d) => xScale(+d.year))
    .y((d) => yScale(+d.deseasonalized));

  $: clipWidth = progression * width;

  $: chartInlineStyle = `width: ${width}px; height: ${height}px;`;

  $: dotPositionTop = yScale(data.emissionsByYear[currentYear]) - 14;
  $: dotPositionLeft = xScale(currentYear) - 14;

  $: valuePositionTop = yScale(data.emissionsByYear[currentYear]) - infosHeight;
  $: valuePositionLeft = Math.min(
    xScale(currentYear) - infosWidth / 2,
    width - 220
  );

  $: dotStyle = `top: ${dotPositionTop}px; left: ${dotPositionLeft}px;`;
  $: valueStyle = `
    top: ${valuePositionTop < 0 ? 12 : valuePositionTop}px; 
    left: ${valuePositionLeft < 0 ? 12 : valuePositionLeft}px;
  `;
</script>

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
        <p class="lm-climat-intro_value_label">Taux de concentration en CO2</p>
        <p class="lm-climat-intro_value_number">
          {data.emissionsByYear[currentYear]} ppm
        </p>
      </div>
      <div style={dotStyle} class="lm-climat-intro_value_dot" />
    {/if}
  {/if}
</div>

<style>
  .lm-climat-intro_chart {
    background: #000;
    /* position: fixed; */
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
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

  .lm-climat-intro_value_label {
    text-transform: uppercase;
    letter-spacing: 0.2px;
    font-size: 10px;
    opacity: 0.6;
  }

  .lm-climat-intro_value_number {
    font-size: 20px;
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
