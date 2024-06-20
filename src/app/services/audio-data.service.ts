import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Music } from '../music';

@Injectable({
  providedIn: 'root'
})
export class AudioDataService {

  constructor() { }

  // Returns a mock list of audio tracks
  getAudioList(): Observable<Music[]>{
    let musicList: Music[] = [
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
   return of(musicList);
  }
  
}
