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
- Just for this exercise I didn't take in consideration if the batch processor library is well maintained, if there are any opened issues or if satisfies all the project needs, I picked up less complex to use.
- In a real world scenario the qflow library should not used.
- No app example has been implemented

## What can be improved

- Error handling, create a dead letter queue to register any job execution error
- Retry strategy is not implemented
- Qflow doesn't expose methods to shutdown the processor
- JobFn has a specific type it should be a generic function type
- 
