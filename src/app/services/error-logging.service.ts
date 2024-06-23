import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  constructor() { }
  logError(error: any): void {
    // Send the error to back end (for example)
    console.error('Logging error:', error);
  }
}
