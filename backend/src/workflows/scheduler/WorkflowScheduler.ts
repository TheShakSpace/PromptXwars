/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { workflowEngine } from "../engine/WorkflowEngine";

export interface ScheduledJob {
  id: string;
  workflowId: string;
  triggerType: "Immediate" | "Delayed" | "Recurring" | "Triggered" | "Manual";
  input: Record<string, any>;
  scheduledTime?: Date;
  cronExpression?: string; // Standard interval simple cron approximation or periodic millisecond trigger
  intervalMs?: number;
  timerId?: NodeJS.Timeout;
}

export class WorkflowScheduler {
  private static instance: WorkflowScheduler;
  private jobs = new Map<string, ScheduledJob>();

  private constructor() {}

  public static getInstance(): WorkflowScheduler {
    if (!WorkflowScheduler.instance) {
      WorkflowScheduler.instance = new WorkflowScheduler();
    }
    return WorkflowScheduler.instance;
  }

  /**
   * Schedules a delayed single execution of a workflow
   */
  public scheduleDelayed(workflowId: string, input: Record<string, any>, delayMs: number): ScheduledJob {
    const id = `job_${Math.random().toString(36).substring(2, 11)}`;
    const scheduledTime = new Date(Date.now() + delayMs);

    const timerId = setTimeout(async () => {
      try {
        console.log(`[WorkflowScheduler] Triggering scheduled delayed job '${id}' for workflow '${workflowId}'...`);
        await workflowEngine.run(workflowId, input);
      } catch (err: any) {
        console.error(`[WorkflowScheduler] Scheduled job '${id}' failed:`, err.message);
      } finally {
        this.jobs.delete(id);
      }
    }, delayMs);

    const job: ScheduledJob = {
      id,
      workflowId,
      triggerType: "Delayed",
      input,
      scheduledTime,
      timerId,
    };

    this.jobs.set(id, job);
    return job;
  }

  /**
   * Schedules a recurring periodic execution of a workflow
   */
  public scheduleRecurring(workflowId: string, input: Record<string, any>, intervalMs: number): ScheduledJob {
    const id = `job_${Math.random().toString(36).substring(2, 11)}`;

    const timerId = setInterval(async () => {
      try {
        console.log(`[WorkflowScheduler] Triggering recurring periodic job '${id}' for workflow '${workflowId}'...`);
        await workflowEngine.run(workflowId, input);
      } catch (err: any) {
        console.error(`[WorkflowScheduler] Recurring job '${id}' encountered execution failure:`, err.message);
      }
    }, intervalMs);

    // Prevent blocking process shutdown
    timerId.unref?.();

    const job: ScheduledJob = {
      id,
      workflowId,
      triggerType: "Recurring",
      input,
      intervalMs,
      timerId,
    };

    this.jobs.set(id, job);
    return job;
  }

  /**
   * Cancels/unschedules a job
   */
  public cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.timerId) {
      clearTimeout(job.timerId);
      clearInterval(job.timerId);
    }

    this.jobs.delete(jobId);
    console.log(`[WorkflowScheduler] Successfully cancelled scheduled job '${jobId}'.`);
    return true;
  }

  /**
   * Lists all active scheduled jobs
   */
  public getJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values()).map((job) => ({
      id: job.id,
      workflowId: job.workflowId,
      triggerType: job.triggerType,
      input: job.input,
      scheduledTime: job.scheduledTime,
      intervalMs: job.intervalMs,
    }));
  }

  /**
   * Clears all scheduled jobs cleanly
   */
  public clear(): void {
    for (const job of this.jobs.values()) {
      if (job.timerId) {
        clearTimeout(job.timerId);
        clearInterval(job.timerId);
      }
    }
    this.jobs.clear();
  }
}

export const workflowScheduler = WorkflowScheduler.getInstance();
