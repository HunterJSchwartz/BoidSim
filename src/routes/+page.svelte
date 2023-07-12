<script>
	import Canvas from '$lib/components/Canvas.svelte';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	let value = 0;
	const max = 10;
</script>

<div class="h-full flex flex-col">
	<div>
		<h1 class="text-center text-3xl font-bold my-5 grow-0">Boids</h1>
	</div>
	<div id="canvas-container" class="grow mx-auto w-[90%] flex justify-center">
		<Canvas />
	</div>
	<div class="flex flex-row justify-evenly my-5 grow-0">
		<RangeSlider name="range-slider" bind:value {max} step={1} ticked>
			<div class="flex justify-between items-center">
				<div class="font-bold">Label</div>
				<div class="text-xs">{value} / {max}</div>
			</div>
		</RangeSlider>
	</div>
</div>
