import { startServer } from "./server/index.ts";
import { setupCluster } from "./server/cluster.ts";

setupCluster(startServer);
