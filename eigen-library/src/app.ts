import { 
    httpServer, 
    httpServerInit, 
    SERVICE_LOCAL_PORT, 
    NODE_ENV
} from "@/libs/service.init";
import chalk from 'chalk'

const main = async (portNumber: number) => {
  await httpServerInit();
  httpServer.listen(portNumber, () => {
      console.log(
          `-----------------------------------------
          \n${chalk.black.bgGreenBright(`🚀 EigenLib HTTP Service is Up and Running\n`
          )}\nMode: ${chalk.blueBright(
            `${NODE_ENV}`
          )}\nURL: ${chalk.blueBright(
            `http://localhost:${portNumber}`
          )}\nAPI Docs: ${chalk.redBright(
            `http://localhost:${portNumber}/api-docs`
          )}\nTime: ${chalk.blueBright(
              `${new Date(Date.now())}`
          )}\n\n-----------------------------------------`
        );
  }).on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`${chalk.green('[http-server]')} ${chalk.redBright(`Port ${portNumber} already in use`)}. Retrying on port: ${portNumber++ + 1}`);
      main(portNumber);
      return;
    }
    console.error(`${chalk.redBright(error.message)}`)
  });
}
// @ts-ignore
main(+SERVICE_LOCAL_PORT);