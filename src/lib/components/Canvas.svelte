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
			resizeTo: parent
		});

		Initialize(150, canvas.width, canvas.height, scene);
		/*
		sprite = PIXI.Sprite.from('/sprites/boid.png');
		sprite.anchor.set(0.5, 1);
		sprite.x = scene.screen.width / 2;
		sprite.y = scene.screen.height / 2;
		sprite.scale.x = 0.075;
		sprite.scale.y = 0.075;
		scene.stage.addChild(sprite);
        */
		scene.ticker.add((delta) => {
			UpdateBoids(delta);
		});
	});
</script>

<canvas id="scene" bind:this={canvas} />
