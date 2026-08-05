// TrackingNotifier — Observer Pattern Subject for real-time tracking updates

import { TrackingUpdate } from './TrackingUpdate';

export interface Observer {
  onTrackingUpdate(update: TrackingUpdate): void;
}

export class TrackingNotifier {
  private static instance: TrackingNotifier;
  private observers: Observer[] = [];

  public static getInstance(): TrackingNotifier {
    if (!TrackingNotifier.instance) {
      TrackingNotifier.instance = new TrackingNotifier();
    }
    return TrackingNotifier.instance;
  }

  public subscribe(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notifyObservers(update: TrackingUpdate): void {
    for (const observer of this.observers) {
      try {
        observer.onTrackingUpdate(update);
      } catch (err) {
        console.error('Error notifying observer:', err);
      }
    }
  }

  public getObserverCount(): number {
    return this.observers.length;
  }
}
