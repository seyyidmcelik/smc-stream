import cluster from 'cluster';
import { availableParallelism } from 'os';

export function setupCluster(callback: () => void) {
    if (cluster.isPrimary) {
        const numCPUs = availableParallelism();
        console.log(`Primary process is running. Forking ${numCPUs} workers.`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} exited. Forking a new one.`);
            cluster.fork();
        });
    } else {
        callback();
    }
}
