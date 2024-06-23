import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { Music } from '../music';
import { AsyncPipe, NgClass } from '@angular/common';
import { AudioDataService } from '../services/audio-data.service';
import { AudioControllersService } from '../services/audio-controllers.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorLoggingService } from '../services/error-logging.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[NgClass, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  title = 'Musify';
  logoUrl = 'assets/img/Logo.png';
  @ViewChild('volume') volume: ElementRef | undefined;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  openMenu: boolean = false;
  audioList: Music[]=[];

  audioControllersService = inject(AudioControllersService);
  audioDataService = inject(AudioDataService);
  errorLogginService = inject(ErrorLoggingService)
  private destroy$ = new Subject<void>();
  
  constructor() {}

  ngOnInit(): void {
    // Load the audio list
    this.audioDataService.getAudioList()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (audioList) =>{
        this.audioControllersService.loadMusicList(audioList);
        this.audioList = audioList;
      },
      error: (err) => {this.errorLogginService.logError(err);}
    });
    
    // Check the playback status
    this.audioControllersService.isPlaying$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (isPlaying) => {
        this.isPlaying = isPlaying;
      },
      error: (err) => {this.errorLogginService.logError(err);}
    });

    // Check the mute status
    this.audioControllersService.isMuted$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (isMuted) => {
        this.isMuted = isMuted;
      },
      error: (err) => {this.errorLogginService.logError(err);}
    });
  }

  // Play or pause the current audio.
  togglePlayPause(): void {
    this.isPlaying ? this.audioControllersService.pause() : this.audioControllersService.play();
  } 

  // Adjust the track position based on user input
  adjustTrack(event: any): void {
    this.audioControllersService.adjustTrack(event.target.value);
  }

  // Stop the current audio and reset.
  stop(): void {
    this.audioControllersService.stop();
  }

  // Play the next track in the list
  next(): void {
    this.audioControllersService.next();
  }

  // Play the previous track in the list
  previous(): void {
    this.audioControllersService.previous();
  }

  // Mute or unmute the current audio
  toggleSoundMute(): void {
    this.audioControllersService.toggleSoundMute();
  }

  // Change the volume based on user input
  adjustVolume(event: any): void {
    this.audioControllersService.adjustVolume(event.target.value);
  }

  // Handle keyboard events for controlling playback and volume
  handleKeyboardEvent(event: KeyboardEvent): void {    
    switch (event.key) {
      case 'ArrowRight': // to skip forward
        this.next();
        break;
      case 'ArrowLeft': // to skip backward
        this.previous();
        break;
      case 'ArrowUp': //  to increase volume
        this.volume?.nativeElement.focus();
        this.audioControllersService.adjustVolumeKeyboardEvent('up');
        break;
      case 'ArrowDown': // to decrease volume
        this.volume?.nativeElement.focus();
        this.audioControllersService.adjustVolumeKeyboardEvent('down');
        break;
      case 'm': // 'm' key to mute/unmute
        this.toggleSoundMute();
        break;
      default:
        break;
    }
  }

  // Change the current track based on user input
  changePlayList(targetId: number): void{
    const targetMusic = this.audioList.find(item => item.id === targetId);
    this.audioControllersService.loadMusic(targetMusic);
    this.audioControllersService.play();
  }

  // Clean up subscriptions when the component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
