type JobType = {
  id: number;
  status: "queued" | "processing" | "finished";
  jobFn: JobFnType;
};

type JobFnType = () => Promise<string>;

type CreateProcessorConfigType = {
  frequencyInMilliSeconds: number; // the time value that the batch should run in milliseconds
  size: number; // the number of how many jobs should be processed in concurrency
};

// Mocked unique id value
let uniqueID = 1;

class QueueProcessor {
  #queue: JobType[];
  #results: JobType[];
  #size: number;
  #frequencyInMilliSeconds: number;

  constructor({ size, frequencyInMilliSeconds }: CreateProcessorConfigType) {
    this.#size = size;
    this.#frequencyInMilliSeconds = frequencyInMilliSeconds;
    this.#queue = [];
    this.#results = [];
  }

  // Generates an unique id for the job
  #generateUniqueId() {
    const newId = uniqueID++;
    return newId;
  }

  // Gets the frequency of the queue processor instance
  getFrequency() {
    return this.#frequencyInMilliSeconds;
  }

  // Gets the batch concurrency size
  getSize() {
    return this.#size;
  }

  // Gets the batch concurrency size
  getQueueSize() {
    return this.#queue.length;
  }

  // Adds a job to the job queue with a unique ID
  addJob(jobFn: JobFnType): number {
    const jobId = this.#generateUniqueId();
    const newJob: JobType = {
      id: jobId,
      jobFn,
      status: "queued",
    };
    this.#queue.push(newJob);

    return jobId;
  }
}

export default QueueProcessor;
