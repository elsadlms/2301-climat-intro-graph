<script>
  import { csv } from 'd3-fetch';
  import { afterUpdate, onMount } from 'svelte';

  import Chart from './Chart.svelte';

  export let context;
  export let pContext;

  let { progression, width, height } = context;

  onMount(() => {
    if (progression === null) progression = 0;
  });

  afterUpdate(() => {
    if (pContext && context.progression != pContext.progression) {
      progression = context.progression;
    }

    if (pContext && context.width != pContext.width) {
      width = context.width;
    }

    if (pContext && context.height != pContext.height) {
      height = context.height;
    }
  });

  let rawEmissions;
  let emissionsByYear;

  csv(
    'https://assets-decodeurs.lemonde.fr/redacweb/2301-scrollgngn-graph-intro/emissions.csv'
  ).then((data) => {
    rawEmissions = data;
  });

  csv(
    '	https://assets-decodeurs.lemonde.fr/redacweb/2301-scrollgngn-graph-intro/emissionsByYear.csv'
  ).then((data) => {
    emissionsByYear = data.columns;
  });
</script>

<div class="lm-climat-intro">
  {#if rawEmissions && emissionsByYear}
    <Chart
      {progression}
      {width}
      {height}
      data={{ rawEmissions, emissionsByYear }}
    />
  {/if}
</div>

<style global>
  .lm-climat-intro {
    font-family: var(--ff-marr-sans, 'Marr Sans');
    height: 100%;
    width: 100%;
    /* à suppr */
    /* height: 300vh; */
  }
</style>
