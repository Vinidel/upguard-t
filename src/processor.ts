import qflow from "qflow";

type JobType = {
  id: number;
  status: "queued" | "finished";
};

type JobTypeWithJobFn = JobType & {
  jobFn: JobFnType;
};

type JobTypeWithResult = JobType & {
  result?: string;
};

type JobFnType = () => Promise<string>;

type CreateProcessorConfigType = {
  frequencyInMilliSeconds: number; // the time value that the batch should run in milliseconds
  size: number; // the number of how many jobs should be processed in concurrency
};

class QueueProcessor {
  #queue: JobTypeWithJobFn[];
  #results: JobTypeWithResult[];
  #size: number;
  #frequencyInMilliSeconds: number;

  // Mocked auto increment unique id value
  #uniqueID = 1;
  #qFlowInstance: any;

  constructor({ size, frequencyInMilliSeconds }: CreateProcessorConfigType) {
    this.#size = size;
    this.#frequencyInMilliSeconds = frequencyInMilliSeconds;
    this.#queue = [];
    this.#results = [];
  }

  // Generates an unique id for the job
  #generateUniqueId() {
    const newId = this.#uniqueID++;
    return newId;
  }

  // Returns true if processor has started processing jobs
  #hasStartedProcessingJobs() {
    return Boolean(this.#qFlowInstance);
  }

  // Gets the frequency of the queue processor instance
  getFrequency() {
    return this.#frequencyInMilliSeconds;
  }

  // Gets the batch concurrency size
  getSize() {
    return this.#size;
  }

  // Gets the queue size
  getQueueSize() {
    return this.#queue.length;
  }

  // Adds a job to the job queue with a unique ID
  addJob(jobFn: JobFnType): JobType {
    const jobId = this.#generateUniqueId();
    const newJob: JobType = {
      id: jobId,
      status: "queued",
    };
    this.#results.push(newJob);

    // Only add to the queue if processor hasn't started
    if (!this.#hasStartedProcessingJobs()) {
      this.#queue.push({ ...newJob, jobFn });
    }

    // Call qflow.enq if processor has started
    if (this.#hasStartedProcessingJobs()) {
      this.#qFlowInstance.enq({ ...newJob, jobFn });
    }

    return newJob;
  }

  // Start processing the queue with the setup values
  // waits for #frequencyInMilliSeconds if it has processed batch
  start() {
    this.#qFlowInstance = qflow(this.#queue)
      .deq(async (val: JobTypeWithJobFn, next: () => void) => {
        const r = await val.jobFn();
        const jobIndex = this.#results.findIndex((j: JobTypeWithResult) => j.id === val.id);

        this.#results[jobIndex].status = "finished";
        this.#results[jobIndex].result = r;

        // Check if has executed batch size
        const hasExecutedBatchSize =
          this.#results.filter((j: JobTypeWithResult) => j.status === "finished").length %
            this.#size ===
          0;

        if (hasExecutedBatchSize) {
          return setTimeout(next, this.#frequencyInMilliSeconds);
        }

        return next();
      })
      .start(this.#size);
  }

  // Returns the current status of the job with equal id
  getJobStatus(jobId: number): string | undefined {
    const foundJob = this.#results.find((j: JobType) => j.id === jobId);
    return foundJob?.status;
  }

  // Returns the job result
  getJob(jobId: number): JobTypeWithResult | undefined {
    const foundJob = this.#results.find((j: JobType) => j.id === jobId);
    return foundJob;
  }

  // Shutdown the processor by setting everything to empty and returns true
  // if still processing it returns false
  shutdown(): boolean {
    if (this.#queue.length) {
      return false;
    }

    this.#queue = [];
    this.#results = [];

    return true;
  }
}

export default QueueProcessor;
