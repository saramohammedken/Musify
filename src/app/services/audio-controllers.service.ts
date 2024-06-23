import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioControllersService {
  private audio = new Audio();
  private musicList: any[] = [];
  public trackingPointer: number = 0;
  public musicLength: string ='00:00';
  
  // BehaviorSubjects to keep track of the audio state
  private getCurrentTime: BehaviorSubject<string> = new BehaviorSubject('00:00');
  private progress: BehaviorSubject<number> = new BehaviorSubject(0);
  private isPlaying: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isMuted: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Observable streams for the component to subscribe to
  public getCurrentTime$: Observable<string> = this.getCurrentTime.asObservable();
  public progress$: Observable<number> = this.progress.asObservable();
  public isPlaying$: Observable<boolean> = this.isPlaying.asObservable();
  public isMuted$: Observable<boolean> = this.isMuted.asObservable();

  constructor() {
    // Update music length when the audio's duration changes
    this.audio.ondurationchange = () => {
      this.musicLength = this.formatTime(this.audio.duration);
    }
    
    // Update progress and current time when the audio's time updates
    this.audio.ontimeupdate = () => {
      let progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.progress.next(progress);
      this.getCurrentTime.next(this.formatTime(this.audio.currentTime));
    }
  }

  // Get the currently playing music
  get currentMusic() {
    return this.musicList[this.trackingPointer];
  }

  // Set the playing status based on whether the audio is paused
  setIsPlaying() {
    this.isPlaying.next(!this.audio.paused);
  }

  // Load a list of music tracks
  loadMusicList(musicList: any[]): void {
    this.musicList = musicList;
    if (this.musicList.length) {
      this.loadMusic(this.musicList[0]);
    }
  }

  // Load a specific music track
  loadMusic(music: any): void {
    this.audio.src = music.url;
    const index = this.musicList.findIndex(item => item.id === music.id);
    this.trackingPointer = index;
  }
  
  // Play the audio and handle potential errors
  play():void {
    this.audio.play().then(()=>{
      this.setIsPlaying();
    }).catch(error => {
      console.error('Failed to play the audio:', error);
      alert('Failed to play the audio. Please try again later.');
    });
  }

  // Pause the audio
  pause():void {
    this.audio.pause();
    this.setIsPlaying()
  }

  // Stop the audio and reset the current time
  stop():void {
    this.audio.pause();
    this.setIsPlaying()
    this.audio.currentTime = 0;
  }

  // Adjust the track position based on user input
  adjustTrack(droppedPoint: number): void {
    const newTime = (droppedPoint / 100) * this.audio.duration;
    this.audio.currentTime = newTime;
  }

  // Play the previous track in the list
  previous(): void {
    if (this.trackingPointer > 0) {
      this.trackingPointer--;
      this.loadMusic(this.currentMusic!);
      this.play();
    }
  }

  // Play the next track in the list
  next(): void {
    if (this.trackingPointer < this.musicList.length - 1) {
      this.trackingPointer++;
      this.loadMusic(this.currentMusic!);
      this.play();
    }
  }

  // Change the volume based on user input
  adjustVolume(volume: number):void {
    this.audio.volume = volume / 100;
  }

  // Adjust the volume using keyboard events
  adjustVolumeKeyboardEvent(operation: 'up' | 'down'): void {
    if (operation === 'up') {
      this.audio.volume = Math.min(this.audio.volume + 0.1, 1);
    } else if (operation === 'down') {
      this.audio.volume = Math.max(this.audio.volume - 0.1, 0);
    }
    this.updateMuteStatus();
  }

  // Update the mute status based on volume
  private updateMuteStatus(): void {
    if (this.audio.volume === 0) {
      this.audio.muted = true;
    } else {
      this.audio.muted = false;
    }
    this.isMuted.next(this.audio.muted);
  }
  
  // Mute or unmute the current audio
  toggleSoundMute():void {
    this.audio.muted = !this.audio.muted;
    this.isMuted.next(this.audio.muted);
  }

  // Format time from seconds to mm:ss
  private formatTime(time: number, formatTime: string = 'mm:ss'): string {
    const momnentTime = time * 1000;
    return moment(momnentTime).format(formatTime);
  }

}

