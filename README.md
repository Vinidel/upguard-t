# upguard-t

This is the implementation of the Upguard coding challenge number 1 Micro-Batching

## Dependencies

- NodeJs: v20.11.1
- NPM: 10.2.4
- Typescript
- qflow
- Jest

## Commands

Run npm install to install all dependencies

```
npm i 
```

Run npm test to run all tests

```
npm test
```

Run npm lint to show the linting report

```
npm run lint
```

## Considerations

- The micro batching is not meant to be implemented.
- Just for this exercise I didn't take in consideration if the batch processor library is well maintained, if there are any opened issues or if satisfies all the project needs, I chose the simplest library to use.
- In a real world scenario the qflow library should not be used.
- The tets document how to use the Processor

## What can be improved

- Error handling, maybe a a dead letter queue to register any job execution error.
- Retry strategy is not implemented, there should be a way to retry in case of any errors.
- Qflow doesn't expose methods to shutdown the processor, as detailed in cosiderations qflow should not be used in the real world.
- JobFn has a specific type it should be a generic function type so it can be re-used in different scenarios
