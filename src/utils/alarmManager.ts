/**
 * Alarm Manager Utility
 * Uses Web Audio API for alarm sounds and Browser Notification API for alerts
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize the AudioContext (must be called from a user gesture)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a subtle alarm beep sound using Web Audio API
 */
export function playAlarmSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Subtle alarm sound - gentle beep pattern
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5 note
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5 note

    // Volume envelope - gentle fade in/out
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.4);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);

    // Play a second beep after a pause
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);

        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.5);
      } catch {
        // Silently ignore secondary beep errors
      }
    }, 800);
  } catch {
    // Silently ignore audio errors - alarm is non-critical
  }
}

/**
 * Request notification permission from the browser
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("هذا المتصفح لا يدعم الإشعارات");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Show a browser notification for a task
 */
export function showTaskNotification(title: string, taskName: string): void {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    const notification = new Notification("⏰ " + title, {
      body: `حان موعد: ${taskName}`,
      icon: "/favicon.ico",
      tag: "task-alarm",
      silent: true, // We handle sound ourselves
    } as NotificationOptions);

    // Close the notification after 10 seconds
    setTimeout(() => notification.close(), 10000);

    // Play alarm sound
    playAlarmSound();

    // Focus the window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

/**
 * Show an in-app toast notification
 */
export function showInAppNotification(taskName: string, time: string): void {
  // Dispatch a custom event that the app can listen to
  const event = new CustomEvent("task-alarm", {
    detail: { taskName, time },
  });
  window.dispatchEvent(event);
}

/**
 * Trigger both browser and in-app notifications
 */
export function triggerAlarm(taskName: string, time: string): void {
  showTaskNotification("🔔 تنبيه المهمة", taskName);
  showInAppNotification(taskName, time);
}

/**
 * Check if we should trigger an alarm for a given time
 * @param alarmTime - The alarm time in HH:mm format
 * @param lastTriggeredTime - The last time we triggered this alarm (to avoid repeats)
 */
export function shouldTriggerAlarm(
  alarmTime: string,
  lastTriggeredTime: number | null
): boolean {
  const now = new Date();
  const [hours, minutes] = alarmTime.split(":").map(Number);

  // Check if current time matches the alarm time (within 1 minute window)
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const alarmMinutes = hours * 60 + minutes;
  const diff = Math.abs(currentMinutes - alarmMinutes);

  if (diff > 1) return false;

  // Don't trigger if we already did in the last 60 seconds
  if (lastTriggeredTime) {
    const timeSinceTrigger = Date.now() - lastTriggeredTime;
    if (timeSinceTrigger < 60000) return false;
  }

  return true;
}
