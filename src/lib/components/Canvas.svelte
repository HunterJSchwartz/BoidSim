<script lang="ts">
	import { Initialize, UpdateBoids } from '$lib/sim/Simulation';
	import * as PIXI from 'pixi.js';

	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	let sprite: PIXI.Sprite;

	onMount(() => {
		let parent: HTMLElement = document.getElementById('canvas-container') as HTMLElement;
		let scene = new PIXI.Application({
			view: canvas,
			resizeTo: parent,
			backgroundAlpha: 0
		});

		Initialize(150, canvas, scene);
		scene.ticker.add((delta) => {
			UpdateBoids(delta);
		});
	});
</script>

<canvas id="scene" bind:this={canvas} />
