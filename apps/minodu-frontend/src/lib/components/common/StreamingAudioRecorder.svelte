<script lang="ts">
	import type { Optional } from '$lib/types';
	import { onMount } from 'svelte';

	export let mediaDeviveAvailable: boolean = true;
	export let recording: boolean = false;
	export let onDataReceived: Optional<(blob: Blob) => void> = undefined;
	export let onCompleted: Optional<() => void> = undefined;

	let audioContext: AudioContext;
	let audioWorkletNode: AudioWorkletNode;
	let stream: MediaStream;

	const workletCode = `
        class PCMProcessor extends AudioWorkletProcessor {
        process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) {
            const channelData = input[0];
            // Convert Float32 to Int16 PCM
            const pcmData = new Int16Array(channelData.length);
            for (let i = 0; i < channelData.length; i++) {
                const s = Math.max(-1, Math.min(1, channelData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            // Send to main thread
            this.port.postMessage(pcmData);
            }
            return true;
        }
        }
        registerProcessor('pcm-processor', PCMProcessor);
    `;

	onMount(async () => {
		mediaDeviveAvailable = navigator.mediaDevices?.getUserMedia !== undefined;
	});

	export async function startRecording() {
		try {
			// Request microphone access
			stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					channelCount: 1,
					sampleRate: 16000,
					echoCancellation: true,
					noiseSuppression: true
				}
			});

			// Create AudioContext
			audioContext = new AudioContext({ sampleRate: 16000 });

			// Create blob URL for worklet
			const blob = new Blob([workletCode], { type: 'application/javascript' });
			const workletUrl = URL.createObjectURL(blob);

			// Load the worklet
			await audioContext.audioWorklet.addModule(workletUrl);
			URL.revokeObjectURL(workletUrl);

			// Create worklet node
			audioWorkletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

			// Handle messages from worklet
			audioWorkletNode.port.onmessage = (event) => {
				onDataReceived?.(event.data);
			};

			// Connect audio graph
			const source = audioContext.createMediaStreamSource(stream);
			source.connect(audioWorkletNode);
			audioWorkletNode.connect(audioContext.destination);

			recording = true;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	}

	export async function stopRecording() {
		if (!recording) return;

		recording = false;

		// Disconnect audio graph
		if (audioWorkletNode) {
			audioWorkletNode.disconnect();
			audioWorkletNode.port.onmessage = null;
		}

		// Close audio context
		await audioContext?.close();

		// Stop all tracks
		stream?.getTracks().forEach((track) => track.stop());

		onCompleted?.();
	}
</script>

<div class="streaming-audio-recorder">
	<div class="controls">
		{#if !recording}
			<button on:click={startRecording} class="btn record"> Start Recording </button>
		{:else}
			<button on:click={stopRecording} class="btn stop"> Stop Recording </button>
		{/if}
	</div>
</div>
