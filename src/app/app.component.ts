import { Component } from '@angular/core';
import { Music } from './music';
import * as moment from 'moment';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[NgClass],
})

export class AppComponent {
  title = 'Musify';
  logoUrl = 'assets/img/Logo.png';
  audio = new Audio();
  musicLength: string = '0:00';
  currentTime: string = '0:00';
  progress=0;

   // List of static music tracks
   musicList: Music[] = [
    {
      id: 1,
      album: 'assets/albums/Fragil.png',
      title: 'Frágil',
      artist: 'Yahritza y Su Esencia and Grupo Frontera',
      url: 'assets/audios/Fragil.mp4',
    },
    { 
      id: 2,
      album: 'assets/albums/Sway.jpeg',
      title: 'Sway',
      artist: 'Michael Bublé',
      url: 'assets/audios/Sway.mp4',
    },
    { 
      id: 3,
      album: 'assets/albums/Human.jpeg',
      title: 'Human',
      artist: 'Rag\'n\'Bone Man',
      url: 'assets/audios/Human.mp4',
    },
  ]; 
  
  trackingPointer: number = 0;
  currentMusic: Music = this.musicList[this.trackingPointer];

  constructor() {
    this.audio.ondurationchange = () => {
      const totalSeconds = Math.floor(this.audio.duration);
      const duration = moment.duration(totalSeconds, 'seconds');
      this.musicLength = duration.seconds() < 10 ? 
                          `${Math.floor(duration.asMinutes())}:0${duration.seconds()}` : 
                          `${Math.floor(duration.asMinutes())}:${duration.seconds()}`;
    }

    this.audio.ontimeupdate = () => {
      const currentSeconds = Math.floor(this.audio.currentTime);
      const duration = moment.duration(currentSeconds, 'seconds');
      this.currentTime = duration.seconds() < 10 ? 
                          `${Math.floor(duration.asMinutes())}:0${duration.seconds()}` : 
                          `${Math.floor(duration.asMinutes())}:${duration.seconds()}`;
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
    }
    
  }

  // Play or pause the current audio.
  togglePlayPause(): void {
      if (this.audio.paused) {
        if (this.audio.readyState === 0) {
          this.trackingPointer = 0;
          this.currentMusic = this.musicList[0];
          this.audio.src = this.currentMusic.url;
        }
        this.audio.play().catch(error => {
          console.error('Failed to play the audio:', error);
          alert('Failed to play the audio. Please try again later.');
        });
      } else {
        this.audio.pause();
      }
  } 

  // stop the current audio and reset.
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  // Play the next track in the list. If it is the last do nothing
  next(): void {
    if (this.trackingPointer < this.musicList.length - 1) {
      this.trackingPointer++;
      this.currentMusic = this.musicList[this.trackingPointer];
      this.audio.src = this.currentMusic.url;
      this.audio.play().catch(error => {
        console.error('Failed to play the audio:', error);
        alert('Failed to play the audio. Please try again later.');
      });
    }
  }

  // Play the previous track in the list. If it is the first do nothing
  previous(): void {
    if (this.trackingPointer > 0) {
      this.trackingPointer--;
      this.currentMusic = this.musicList[this.trackingPointer];
      this.audio.src = this.currentMusic.url;
      this.audio.play().catch(error => {
        console.error('Failed to play the audio:', error);
        alert('Failed to play the audio. Please try again later.');
      });
    }
  }

   // Handle Right/Left keyboard events
   handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight': // to skip forward
        this.next();
        break;
      case 'ArrowLeft': // to skip backward
        this.previous();
        break;
    }
  }

  // Clean the audio element when this component is destroyed
  ngOnDestroy(): void {
    this.audio.pause();
    this.audio.src = '';
  }
  
}