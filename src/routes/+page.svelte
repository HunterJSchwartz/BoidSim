<script>
	import Canvas from '$lib/components/Canvas.svelte';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { maxSpeed, alignForce } from '$lib/sim/Simulation';
</script>

<div class="h-full flex flex-col">
	<div>
		<h1 class="text-center text-3xl font-bold my-5 grow-0">Boids</h1>
	</div>
	<div id="canvas-container" class="grow mx-auto w-[90%] flex justify-center">
		<Canvas />
	</div>
	<div class="flex flex-row justify-evenly mt-5 mb-10 grow-0">
		<RangeSlider name="range-slider" bind:value={$maxSpeed} min={2} max={10} step={1}>
			<div class="flex justify-between items-center">
				<div class="font-bold">Speed</div>
				<div class="text-xs">{$maxSpeed} / {10}</div>
			</div>
		</RangeSlider>
		<RangeSlider name="range-slider" bind:value={$alignForce} min={0} max={0.5} step={0.05}>
			<div class="flex justify-between items-center">
				<div class="font-bold">Align</div>
				<div class="text-xs">{$alignForce} / {0.5}</div>
			</div>
		</RangeSlider>
	</div>
</div>
