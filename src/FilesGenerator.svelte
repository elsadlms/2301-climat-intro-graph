<script>
  /* juste pour préparer les fichiers */

  import { saveAs } from 'file-saver';
  import { onMount } from 'svelte';

  export let temperatureData;
  export let emissionsData;

  const emissionsByYear = [];
  const temperatureByYear = [];

  const yearStart = 1500;
  const yearEnd = 2021;

  onMount(() => {
    for (let i = yearStart; i < yearEnd + 1; i++) {
      let n = 0;
      while (!emissionsData.find((d) => +d.year === i - n)) {
        n++;
      }
      emissionsByYear[i] = emissionsData.find(
        (d) => +d.year === i - n
      ).deseasonalized;

      const yearTemperatureData = temperatureData.find((d) => +d.year === i);
      temperatureByYear[i] =
        yearTemperatureData.observed === ''
          ? yearTemperatureData.reconstructed
          : yearTemperatureData.observed;
    }
  });

  const exportFiles = () => {    
    const temperatureFile = new Blob([temperatureByYear], { type: 'text/csv' });
    saveAs(temperatureFile, 'temperatureByYear.csv');

    const emissionsFile = new Blob([emissionsByYear], { type: 'text/csv' });
    saveAs(emissionsFile, 'emissionsByYear.csv');
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
  {#if temperatureByYear && emissionsByYear}
    <p on:click={exportFiles}>Export files!</p>
  {/if}
</div>
