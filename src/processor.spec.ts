// import customProcessor from "./processor";
import QueueProcessor from "./processor";

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

  test("adds a Job to the job queue and returns a job id", () => {
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const mockedJob = () => new Promise<string>((resolve) => resolve("come watch TV"));
    const result = p.addJob(mockedJob);
    expect(result).toEqual(1);
  });

  test("generates an unique ID on every job addition", () => {
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const mockedJob = () => new Promise<string>((resolve) => resolve("I'm a pickle"));
    const firstJobId = p.addJob(mockedJob);
    const secondJobId = p.addJob(mockedJob);
    expect(firstJobId).not.toEqual(secondJobId);
  });

  test("adds jobs to the processor queue", () => {
    const frequency = 5;
    const size = 1;
    const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
    const mockedJob = () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce"));
    p.addJob(mockedJob);
    p.addJob(mockedJob);
    const expectedQueueSize = 2;
    expect(p.getQueueSize()).toEqual(expectedQueueSize);
  });
});
