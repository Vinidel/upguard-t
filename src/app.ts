// Example of how to use the API

import QueueProcessor from "./processor";

const listOfAsyncJobs = [
  () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce")),
  () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce")),
  () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce")),
  () => new Promise<string>((resolve) => resolve("Mulan McNugget Sauce")),
];

const jobIds: number[] = [];

const frequency = 5;
const size = 2;
const p = new QueueProcessor({ size, frequencyInMilliSeconds: frequency });
listOfAsyncJobs.forEach((e) => {
  const job = p.addJob(e);
  jobIds.push(job.id);
});
p.start();

jobIds.forEach((e) => console.log(p.getJob(e)));
