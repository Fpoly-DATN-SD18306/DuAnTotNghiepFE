import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio('audio/new_audio_1.mp3'); // Đường dẫn đến file âm thanh
  }

  playSound(): void {
    this.audio.currentTime = 0; // Đặt lại thời gian phát để phát lại âm thanh
    this.audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
}
