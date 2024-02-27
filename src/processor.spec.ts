// import customProcessor from "./processor";
import QueueProcessor from "./processor";

// Custom wait function that waits for 3 seconds
const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

describe("Processor", () => {
  test("creates an instance of the processor with correct frequency", () => {
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    expect(p.getFrequency()).toEqual(frequency);
  });

  test("creates an instance of the processor with correct size", () => {
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    expect(p.getFrequency()).toEqual(frequency);
  });

  test("returns a JobResult with status queued when a job is added to the queue", () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("I'm a pickle"));
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const job = p.addJob(mockedJob);
    expect(job.status).toEqual("queued");
  });

  test("adds a Job to the job queue and returns a job result with an id", () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("come watch TV"));
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const result = p.addJob(mockedJob);
    const expectedId = 1;
    expect(result.id).toEqual(expectedId);
  });

  test("generates an unique ID on every job addition", () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("I'm a pickle"));
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const firstJob = p.addJob(mockedJob);
    const secondJob = p.addJob(mockedJob);
    expect(firstJob.id).not.toEqual(secondJob.id);
  });

  test("adds jobs to the processor queue", () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce"));
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    const expectedQueueSize = 2;
    expect(p.getQueueSize()).toEqual(expectedQueueSize);
  });

  test("sets job status to queued when job hasn't been processed", async () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("To Live Is To Risk It All"));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const firstJob = p.addJob(mockedJob);
    p.addJob(mockedJob);
    const j = p.getJob(firstJob.id);
    expect(j?.status).toEqual("queued");
  });

  test("sets job status to finished when job is processed successfully", async () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce"));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const firstJob = p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    // Wait for start function to start processing jobs
    await wait();
    const j = p.getJob(firstJob.id);
    expect(j?.status).toEqual("finished");
  });

  test("sets job result value when job is processed successfully", async () => {
    const mockedResult = "Boom! Big reveal!";
    const mockedJob = () => new Promise<string>((resolve) => resolve(mockedResult));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const firstJob = p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    // Wait for start function to start processing jobs
    await wait();
    const j = p.getJob(firstJob.id);
    expect(j?.result).toEqual("Boom! Big reveal!");
  });

  test("does not shutdown if queue is still being processed", async () => {
    const mockedJob = () =>
      new Promise<string>((resolve) => resolve("Sometimes science is more art than science"));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    const shutdownResult = p.shutdown();
    expect(shutdownResult).toBeFalsy();
  });

  test("shutdown if all jobs have been processed", async () => {
    const mockedJob = () =>
      new Promise<string>((resolve) =>
        resolve("so everyone’s supposed to sleep every single night now?"),
      );
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    // Wait for start function to start processing jobs
    await wait();
    const shutdownResult = p.shutdown();
    expect(shutdownResult).toBeTruthy();
  });

  test("sets queue to empty after shutdown", async () => {
    const mockedJob = () =>
      new Promise<string>((resolve) => resolve("Sometimes science is more art than science"));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const firstJob = p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    // Wait for start function to start processing jobs
    await wait();
    p.shutdown();
    expect(p.getJob(firstJob.id)).toBeFalsy();
  });

  test("processes jobs that were added after the processor has started", async () => {
    const mockedJob = () => new Promise<string>((resolve) => resolve("get schwifty"));
    const frequency = 5;
    const size = 2;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    p.start();
    // Wait for start function to start processing jobs
    const lastJob = p.addJob(mockedJob);
    await wait();
    expect(p.getJob(lastJob.id)?.status).toEqual("finished");
  });
});
